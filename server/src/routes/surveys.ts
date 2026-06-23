import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { surveys } from '../db/schema/surveys';
import { profiles } from '../db/schema/profiles';
import { eq, and, desc, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const MILESTONES = ['6months', '12months', '2years', '4years'] as const;

const surveySchema = z.object({
  milestone: z.enum(MILESTONES),
  isEmployed: z.boolean(),
  country: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  position: z.string().optional().nullable(),
  salary: z.number().int().optional().nullable(),
  isInSpecialty: z.boolean().optional().nullable(),
  employedAt: z.string().optional().nullable(),
});

function getMilestoneDuration(milestone: string): number {
  switch (milestone) {
    case '6months': return 6;
    case '12months': return 12;
    case '2years': return 24;
    case '4years': return 48;
    default: return 0;
  }
}

// GET /api/surveys/stats — public aggregate statistics
router.get('/stats', async (c) => {
  try {
    const universityId = c.req.query('university_id');
    const milestone = c.req.query('milestone');

    let milestoneFilter = '';
    if (milestone && ['6months', '12months', '2years', '4years'].includes(milestone)) {
      milestoneFilter = `AND s.milestone = '${milestone}'`;
    }

    let universityJoin = '';
    let universityFilter = '';
    if (universityId) {
      universityJoin = 'JOIN profiles p ON s.user_id = p.user_id';
      universityFilter = `AND p.university_id = '${universityId}'`;
    }

    const overall = await db.execute(sql`
      SELECT
        s.milestone,
        COUNT(*)::int AS total,
        ROUND((AVG(CASE WHEN s.is_employed THEN 1.0 ELSE 0.0 END) * 100)::numeric, 1) AS employment_rate,
        ROUND(AVG(s.salary)::numeric, 0) AS avg_salary,
        ROUND((AVG(CASE WHEN s.is_in_specialty THEN 1.0 ELSE 0.0 END) * 100)::numeric, 1) AS in_specialty_rate
      FROM surveys s
      ${universityJoin ? sql.raw(universityJoin) : sql``}
      WHERE 1=1 ${sql.raw(milestoneFilter)} ${sql.raw(universityFilter)}
      GROUP BY s.milestone
      ORDER BY s.milestone
    `);

    const topCompanies = await db.execute(sql`
      SELECT s.company, COUNT(*)::int AS count
      FROM surveys s
      WHERE s.company IS NOT NULL AND s.company != ''
      GROUP BY s.company
      ORDER BY count DESC
      LIMIT 15
    `);

    const byUniversity = await db.execute(sql`
      SELECT
        p.university_id,
        u.short_name AS university_name,
        COUNT(*)::int AS total_responses,
        ROUND((AVG(CASE WHEN s.is_employed THEN 1.0 ELSE 0.0 END) * 100)::numeric, 1) AS employment_rate,
        ROUND(AVG(s.salary)::numeric, 0) AS avg_salary
      FROM surveys s
      JOIN profiles p ON s.user_id = p.user_id
      JOIN universities u ON p.university_id = u.id
      ${sql.raw(milestoneFilter ? `AND ${milestoneFilter.replace('AND', 'WHERE')}` : '')}
      GROUP BY p.university_id, u.short_name
      HAVING COUNT(*) >= 1
      ORDER BY total_responses DESC
      LIMIT 20
    `);

    const bySpecialty = await db.execute(sql`
      SELECT
        p.specialty_id,
        sp.name AS specialty_name,
        COUNT(*)::int AS total_responses,
        ROUND((AVG(CASE WHEN s.is_employed THEN 1.0 ELSE 0.0 END) * 100)::numeric, 1) AS employment_rate,
        ROUND(AVG(s.salary)::numeric, 0) AS avg_salary
      FROM surveys s
      JOIN profiles p ON s.user_id = p.user_id
      JOIN specialties sp ON p.specialty_id = sp.id
      WHERE p.specialty_id IS NOT NULL
      GROUP BY p.specialty_id, sp.name
      HAVING COUNT(*) >= 1
      ORDER BY total_responses DESC
      LIMIT 20
    `);

    const totalCount = await db.execute(sql`
      SELECT COUNT(*)::int AS total FROM surveys
    `);

    return c.json({
      totalSurveys: totalCount.rows[0]?.total || 0,
      byMilestone: overall.rows,
      topCompanies: topCompanies.rows,
      byUniversity: byUniversity.rows,
      bySpecialty: bySpecialty.rows,
    });
  } catch (err) {
    console.error('Survey stats error:', err);
    return c.json({ error: 'Failed to fetch survey stats' }, 500);
  }
});

// GET /api/surveys/status — current survey availability
router.get('/status', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));
    const allUserSurveys = await db.select().from(surveys).where(eq(surveys.userId, authUser.id));

    const completedMilestones = allUserSurveys.map(s => s.milestone);
    const debugGraduationYear = c.req.query('debug_graduation_year');
    let graduationYear = profile?.expectedGraduationYear;
    let isDebugMode = false;

    if (debugGraduationYear) {
      const parsed = parseInt(debugGraduationYear);
      if (!isNaN(parsed)) {
        graduationYear = parsed;
        isDebugMode = true;
      }
    }

    const now = new Date();
    const currentYear = now.getFullYear();

    if (!graduationYear || graduationYear > currentYear) {
      return c.json({
        canFill: false,
        reason: 'still_studying',
        graduationYear,
        completedMilestones,
        trajectory: allUserSurveys.sort((a, b) => a.milestone.localeCompare(b.milestone)),
        isDebugMode,
      });
    }

    // Estimated graduation date: July 1 of graduation year
    const graduationDate = new Date(graduationYear, 6, 1);
    const monthsSinceGraduation = (now.getFullYear() - graduationDate.getFullYear()) * 12
      + (now.getMonth() - graduationDate.getMonth());

    const availableMilestones: string[] = [];
    let nextMilestone: string | null = null;

    for (const ms of MILESTONES) {
      const requiredMonths = getMilestoneDuration(ms);
      if (monthsSinceGraduation >= requiredMonths) {
        if (!completedMilestones.includes(ms)) {
          availableMilestones.push(ms);
          if (!nextMilestone) nextMilestone = ms;
        }
      } else {
        if (!nextMilestone && !completedMilestones.includes(ms)) {
          nextMilestone = ms;
        }
        break;
      }
    }

    return c.json({
      canFill: availableMilestones.length > 0,
      reason: availableMilestones.length > 0 ? 'ready' : 'wait',
      graduationYear,
      monthsSinceGraduation,
      availableMilestones,
      completedMilestones,
      nextMilestone,
      trajectory: allUserSurveys.sort((a, b) => a.milestone.localeCompare(b.milestone)),
      isDebugMode,
    });
  } catch (err) {
    console.error('Survey status error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/surveys — all surveys for current user
router.get('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const items = await db.select().from(surveys)
      .where(eq(surveys.userId, authUser.id))
      .orderBy(surveys.milestone);
    return c.json(items);
  } catch (err) {
    console.error('Get surveys error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// POST /api/surveys — submit a survey
router.post('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const parsed = surveySchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    // Check milestone not already filled
    const existing = await db.select().from(surveys)
      .where(and(eq(surveys.userId, authUser.id), eq(surveys.milestone, parsed.data.milestone)));

    if (existing.length > 0) {
      return c.json({ error: 'Survey for this milestone already submitted' }, 409);
    }

    const [item] = await db.insert(surveys).values({
      userId: authUser.id,
      milestone: parsed.data.milestone,
      isEmployed: parsed.data.isEmployed,
      country: parsed.data.country || null,
      company: parsed.data.company || null,
      position: parsed.data.position || null,
      salary: parsed.data.salary || null,
      isInSpecialty: parsed.data.isEmployed ? (parsed.data.isInSpecialty ?? null) : null,
      employedAt: parsed.data.employedAt ? new Date(parsed.data.employedAt) : null,
    }).returning();

    return c.json(item, 201);
  } catch (err) {
    console.error('Submit survey error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// GET /api/surveys/trajectory — career trajectory for current user
router.get('/trajectory', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const items = await db.select().from(surveys)
      .where(eq(surveys.userId, authUser.id))
      .orderBy(surveys.milestone);

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));
    const graduationYear = profile?.expectedGraduationYear;

    const trajectory = items.map(s => {
      let year: number | null = null;
      if (graduationYear) {
        year = graduationYear + Math.round(getMilestoneDuration(s.milestone) / 12);
      }
      return { ...s, year };
    });

    return c.json(trajectory);
  } catch (err) {
    console.error('Survey trajectory error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

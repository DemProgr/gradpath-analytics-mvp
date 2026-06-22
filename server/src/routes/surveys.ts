import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { surveys } from '../db/schema/surveys';
import { profiles } from '../db/schema/profiles';
import { eq, and, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const MILESTONES = ['6months', '2years', '5years'] as const;

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
    case '2years': return 24;
    case '5years': return 60;
    default: return 0;
  }
}

// GET /api/surveys/status — current survey availability
router.get('/status', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));
    const allUserSurveys = await db.select().from(surveys).where(eq(surveys.userId, authUser.id));

    const completedMilestones = allUserSurveys.map(s => s.milestone);
    const graduationYear = profile?.expectedGraduationYear;
    const now = new Date();
    const currentYear = now.getFullYear();

    if (!graduationYear || graduationYear > currentYear) {
      return c.json({
        canFill: false,
        reason: 'still_studying',
        graduationYear,
        completedMilestones,
        trajectory: allUserSurveys.sort((a, b) => a.milestone.localeCompare(b.milestone)),
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

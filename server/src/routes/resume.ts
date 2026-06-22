import { Hono } from 'hono';
import { db } from '../db';
import { profiles } from '../db/schema/profiles';
import { universities } from '../db/schema/universities';
import { faculties } from '../db/schema/faculties';
import { specialties } from '../db/schema/specialties';
import { skills } from '../db/schema/skills';
import { languages } from '../db/schema/languages';
import { projects } from '../db/schema/projects';
import { certificates } from '../db/schema/certificates';
import { eq } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

// GET /api/resume/data — aggregated profile data for resume generation
router.get('/data', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');

    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, authUser.id));

    let university = null;
    let faculty = null;
    let specialty = null;

    if (profile?.universityId) {
      const [uni] = await db.select().from(universities).where(eq(universities.id, profile.universityId));
      university = uni || null;
    }
    if (profile?.facultyId) {
      const [fac] = await db.select().from(faculties).where(eq(faculties.id, profile.facultyId));
      faculty = fac || null;
    }
    if (profile?.specialtyId) {
      const [spec] = await db.select().from(specialties).where(eq(specialties.id, profile.specialtyId));
      specialty = spec || null;
    }

    const [userSkills, userLanguages, userProjects, userCertificates] = await Promise.all([
      db.select().from(skills).where(eq(skills.userId, authUser.id)).orderBy(skills.order),
      db.select().from(languages).where(eq(languages.userId, authUser.id)).orderBy(languages.order),
      db.select().from(projects).where(eq(projects.userId, authUser.id)).orderBy(projects.order),
      db.select().from(certificates).where(eq(certificates.userId, authUser.id)).orderBy(certificates.order),
    ]);

    return c.json({
      user: {
        id: authUser.id,
        email: authUser.email,
      },
      profile: profile || null,
      university,
      faculty,
      specialty,
      skills: userSkills,
      languages: userLanguages,
      projects: userProjects,
      certificates: userCertificates,
    });
  } catch (err) {
    console.error('Resume data error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

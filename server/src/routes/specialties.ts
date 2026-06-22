import { Hono } from 'hono';
import { db } from '../db';
import { specialties } from '../db/schema/specialties';
import { universities } from '../db/schema/universities';
import { eq, and, ilike } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const universityId = c.req.query('university_id');
    const universityShortName = c.req.query('university_short_name');
    const facultyId = c.req.query('faculty_id');

    let results;

    if (universityId) {
      const conditions = [eq(specialties.universityId, universityId)];
      if (facultyId) {
        conditions.push(eq(specialties.facultyId, facultyId));
      }
      results = await db
        .select({
          id: specialties.id,
          name: specialties.name,
          code: specialties.code,
          degreeType: specialties.degreeType,
          durationYears: specialties.durationYears,
          description: specialties.description,
          facultyId: specialties.facultyId,
          universityId: specialties.universityId,
          instituteId: specialties.instituteId,
        })
        .from(specialties)
        .where(and(...conditions))
        .orderBy(specialties.name);
    } else if (universityShortName) {
      const conditions = [ilike(universities.shortName, universityShortName)];
      if (facultyId) {
        conditions.push(eq(specialties.facultyId, facultyId));
      }
      results = await db
        .select({
          id: specialties.id,
          name: specialties.name,
          code: specialties.code,
          degreeType: specialties.degreeType,
          durationYears: specialties.durationYears,
          description: specialties.description,
          facultyId: specialties.facultyId,
          universityId: specialties.universityId,
          instituteId: specialties.instituteId,
          universityShortName: universities.shortName,
          universityCity: universities.city,
        })
        .from(specialties)
        .innerJoin(universities, eq(specialties.universityId, universities.id))
        .where(and(...conditions))
        .orderBy(specialties.name);
    } else {
      results = await db
        .select()
        .from(specialties)
        .orderBy(specialties.name);
    }

    return c.json(results);
  } catch (err) {
    console.error('Error fetching specialties:', err);
    return c.json({ error: 'Failed to fetch specialties' }, 500);
  }
});

router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const [result] = await db
      .select()
      .from(specialties)
      .where(eq(specialties.id, id));

    if (!result) {
      return c.json({ error: 'Specialty not found' }, 404);
    }

    return c.json(result);
  } catch (err) {
    console.error('Error fetching specialty:', err);
    return c.json({ error: 'Failed to fetch specialty' }, 500);
  }
});

export default router;

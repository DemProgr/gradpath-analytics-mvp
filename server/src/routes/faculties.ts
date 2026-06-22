import { Hono } from 'hono';
import { db } from '../db';
import { faculties } from '../db/schema/faculties';
import { eq } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const universityId = c.req.query('university_id');

    let results;

    if (universityId) {
      results = await db
        .select()
        .from(faculties)
        .where(eq(faculties.universityId, universityId))
        .orderBy(faculties.name);
    } else {
      results = await db
        .select()
        .from(faculties)
        .orderBy(faculties.name);
    }

    return c.json(results);
  } catch (err) {
    console.error('Error fetching faculties:', err);
    return c.json({ error: 'Failed to fetch faculties' }, 500);
  }
});

export default router;

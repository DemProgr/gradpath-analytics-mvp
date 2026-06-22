import { Hono } from 'hono';
import { db } from '../db';
import { universities } from '../db/schema/universities';
import { like, ilike, eq, sql } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const city = c.req.query('city');
    const search = c.req.query('search');

    let results;

    if (search) {
      results = await db
        .select()
        .from(universities)
        .where(
          ilike(universities.shortName, `%${search}%`)
        )
        .orderBy(universities.city, universities.shortName);
    } else if (city) {
      results = await db
        .select()
        .from(universities)
        .where(eq(universities.city, city))
        .orderBy(universities.shortName);
    } else {
      results = await db
        .select()
        .from(universities)
        .orderBy(universities.city, universities.shortName);
    }

    return c.json(results);
  } catch (err) {
    console.error('Error fetching universities:', err);
    return c.json({ error: 'Failed to fetch universities' }, 500);
  }
});

router.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const [result] = await db
      .select()
      .from(universities)
      .where(eq(universities.id, id));

    if (!result) {
      return c.json({ error: 'University not found' }, 404);
    }

    return c.json(result);
  } catch (err) {
    console.error('Error fetching university:', err);
    return c.json({ error: 'Failed to fetch university' }, 500);
  }
});

export default router;

import { Hono } from 'hono';
import { db } from '../db';
import { careerPaths } from '../db/schema/career-paths';
import { eq } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const category = c.req.query('category');

    let results;

    if (category) {
      results = await db
        .select()
        .from(careerPaths)
        .where(eq(careerPaths.specialtyCategory, category))
        .orderBy(careerPaths.levelOrder);
    } else {
      results = await db
        .select()
        .from(careerPaths)
        .orderBy(careerPaths.specialtyCategory, careerPaths.levelOrder);
    }

    return c.json(results);
  } catch (err) {
    console.error('Error fetching career paths:', err);
    return c.json({ error: 'Failed to fetch career paths' }, 500);
  }
});

router.get('/:category', async (c) => {
  try {
    const category = c.req.param('category');
    const results = await db
      .select()
      .from(careerPaths)
      .where(eq(careerPaths.specialtyCategory, category))
      .orderBy(careerPaths.levelOrder);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching career path:', err);
    return c.json({ error: 'Failed to fetch career path' }, 500);
  }
});

export default router;

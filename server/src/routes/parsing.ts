import { Hono } from 'hono';
import { db } from '../db';
import { parsingSessions } from '../db/schema/parsing-sessions';
import { eq, desc } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const results = await db
      .select()
      .from(parsingSessions)
      .orderBy(desc(parsingSessions.createdAt));

    return c.json(results);
  } catch (err) {
    console.error('Error fetching parsing sessions:', err);
    return c.json({ error: 'Failed to fetch parsing sessions' }, 500);
  }
});

router.get('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const [result] = await db
      .select()
      .from(parsingSessions)
      .where(eq(parsingSessions.id, id));

    if (!result) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json(result);
  } catch (err) {
    console.error('Error fetching session:', err);
    return c.json({ error: 'Failed to fetch session' }, 500);
  }
});

router.post('/', authMiddleware, adminMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const [newSession] = await db.insert(parsingSessions).values({
      source: body.source,
      category: body.category,
      status: 'running',
    }).returning();

    return c.json(newSession);
  } catch (err) {
    console.error('Error creating session:', err);
    return c.json({ error: 'Failed to create session' }, 500);
  }
});

router.patch('/:id', authMiddleware, adminMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '0');
    const body = await c.req.json();

    const [updated] = await db
      .update(parsingSessions)
      .set(body)
      .where(eq(parsingSessions.id, id))
      .returning();

    if (!updated) {
      return c.json({ error: 'Session not found' }, 404);
    }

    return c.json(updated);
  } catch (err) {
    console.error('Error updating session:', err);
    return c.json({ error: 'Failed to update session' }, 500);
  }
});

export default router;

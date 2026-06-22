import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { languages } from '../db/schema/languages';
import { eq, and, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  name: z.string().min(1, 'Название языка обязательно'),
  cefrLevel: z.enum(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']).default('B1'),
});

const updateSchema = createSchema.partial();

router.get('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const items = await db.select().from(languages)
      .where(eq(languages.userId, authUser.id))
      .orderBy(languages.order);
    return c.json(items);
  } catch (err) {
    console.error('Get languages error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.post('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [result] = await db.select({ max: sql<number>`max(${languages.order})` })
      .from(languages)
      .where(eq(languages.userId, authUser.id));

    const newOrder = (result?.max ?? -1) + 1;

    const [item] = await db.insert(languages).values({
      userId: authUser.id,
      name: parsed.data.name,
      cefrLevel: parsed.data.cefrLevel,
      order: newOrder,
    }).returning();

    return c.json(item, 201);
  } catch (err) {
    console.error('Create language error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.put('/:id', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const body = await c.req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [existing] = await db.select().from(languages)
      .where(and(eq(languages.id, id), eq(languages.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Language not found' }, 404);

    const [updated] = await db.update(languages)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(languages.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Update language error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(languages)
      .where(and(eq(languages.id, id), eq(languages.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Language not found' }, 404);

    await db.delete(languages).where(eq(languages.id, id));
    return c.json({ message: 'Language deleted' });
  } catch (err) {
    console.error('Delete language error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.put('/reorder', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json() as { ids: number[] };
    if (!body.ids || !Array.isArray(body.ids)) {
      return c.json({ error: 'Provide ids array' }, 400);
    }

    for (let i = 0; i < body.ids.length; i++) {
      await db.update(languages)
        .set({ order: i, updatedAt: new Date() })
        .where(and(eq(languages.id, body.ids[i]), eq(languages.userId, authUser.id)));
    }

    return c.json({ message: 'Reordered' });
  } catch (err) {
    console.error('Reorder languages error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

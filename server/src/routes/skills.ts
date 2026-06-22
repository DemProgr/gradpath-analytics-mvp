import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { skills } from '../db/schema/skills';
import { eq, and, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  name: z.string().min(1, 'Название навыка обязательно'),
  proficiencyLevel: z.enum(['beginner', 'intermediate', 'advanced', 'expert']).default('intermediate'),
});

const updateSchema = createSchema.partial();

router.get('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const items = await db.select().from(skills)
      .where(eq(skills.userId, authUser.id))
      .orderBy(skills.order);
    return c.json(items);
  } catch (err) {
    console.error('Get skills error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.post('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [result] = await db.select({ max: sql<number>`max(${skills.order})` })
      .from(skills)
      .where(eq(skills.userId, authUser.id));

    const newOrder = (result?.max ?? -1) + 1;

    const [item] = await db.insert(skills).values({
      userId: authUser.id,
      name: parsed.data.name,
      proficiencyLevel: parsed.data.proficiencyLevel,
      order: newOrder,
    }).returning();

    return c.json(item, 201);
  } catch (err) {
    console.error('Create skill error:', err);
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

    const [existing] = await db.select().from(skills)
      .where(and(eq(skills.id, id), eq(skills.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Skill not found' }, 404);

    const [updated] = await db.update(skills)
      .set({ ...parsed.data, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Update skill error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(skills)
      .where(and(eq(skills.id, id), eq(skills.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Skill not found' }, 404);

    await db.delete(skills).where(eq(skills.id, id));
    return c.json({ message: 'Skill deleted' });
  } catch (err) {
    console.error('Delete skill error:', err);
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
      await db.update(skills)
        .set({ order: i, updatedAt: new Date() })
        .where(and(eq(skills.id, body.ids[i]), eq(skills.userId, authUser.id)));
    }

    return c.json({ message: 'Reordered' });
  } catch (err) {
    console.error('Reorder skills error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

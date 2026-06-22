import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { projects } from '../db/schema/projects';
import { eq, and, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  title: z.string().min(1, 'Название проекта обязательно'),
  description: z.string().optional(),
  role: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
});

const updateSchema = createSchema.partial();

router.get('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const items = await db.select().from(projects)
      .where(eq(projects.userId, authUser.id))
      .orderBy(projects.order);
    return c.json(items);
  } catch (err) {
    console.error('Get projects error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.post('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [result] = await db.select({ max: sql<number>`max(${projects.order})` })
      .from(projects)
      .where(eq(projects.userId, authUser.id));

    const newOrder = (result?.max ?? -1) + 1;

    const [item] = await db.insert(projects).values({
      userId: authUser.id,
      title: parsed.data.title,
      description: parsed.data.description || null,
      role: parsed.data.role || null,
      url: parsed.data.url || null,
      startDate: parsed.data.startDate ? new Date(parsed.data.startDate) : null,
      endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
      order: newOrder,
    }).returning();

    return c.json(item, 201);
  } catch (err) {
    console.error('Create project error:', err);
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

    const [existing] = await db.select().from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Project not found' }, 404);

    const updateData: any = { ...parsed.data, updatedAt: new Date() };
    if (parsed.data.startDate !== undefined) updateData.startDate = parsed.data.startDate ? new Date(parsed.data.startDate) : null;
    if (parsed.data.endDate !== undefined) updateData.endDate = parsed.data.endDate ? new Date(parsed.data.endDate) : null;

    const [updated] = await db.update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Update project error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Project not found' }, 404);

    await db.delete(projects).where(eq(projects.id, id));
    return c.json({ message: 'Project deleted' });
  } catch (err) {
    console.error('Delete project error:', err);
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
      await db.update(projects)
        .set({ order: i, updatedAt: new Date() })
        .where(and(eq(projects.id, body.ids[i]), eq(projects.userId, authUser.id)));
    }

    return c.json({ message: 'Reordered' });
  } catch (err) {
    console.error('Reorder projects error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

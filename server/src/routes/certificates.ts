import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { certificates } from '../db/schema/certificates';
import { eq, and, sql } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  name: z.string().min(1, 'Название сертификата обязательно'),
  issuer: z.string().min(1, 'Организация обязательна'),
  url: z.string().url().optional().or(z.literal('')),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional().nullable(),
});

const updateSchema = createSchema.partial();

router.get('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const items = await db.select().from(certificates)
      .where(eq(certificates.userId, authUser.id))
      .orderBy(certificates.order);
    return c.json(items);
  } catch (err) {
    console.error('Get certificates error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.post('/', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const body = await c.req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [result] = await db.select({ max: sql<number>`max(${certificates.order})` })
      .from(certificates)
      .where(eq(certificates.userId, authUser.id));

    const newOrder = (result?.max ?? -1) + 1;

    const [item] = await db.insert(certificates).values({
      userId: authUser.id,
      name: parsed.data.name,
      issuer: parsed.data.issuer,
      url: parsed.data.url || null,
      issueDate: parsed.data.issueDate ? new Date(parsed.data.issueDate) : null,
      expiryDate: parsed.data.expiryDate ? new Date(parsed.data.expiryDate) : null,
      order: newOrder,
    }).returning();

    return c.json(item, 201);
  } catch (err) {
    console.error('Create certificate error:', err);
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

    const [existing] = await db.select().from(certificates)
      .where(and(eq(certificates.id, id), eq(certificates.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Certificate not found' }, 404);

    const { issueDate, expiryDate, ...restData } = parsed.data;
    const updateData: Partial<typeof certificates.$inferInsert> = {
      ...restData,
      updatedAt: new Date(),
      issueDate: issueDate !== undefined ? (issueDate ? new Date(issueDate) : null) : undefined,
      expiryDate: expiryDate !== undefined ? (expiryDate ? new Date(expiryDate) : null) : undefined,
    };

    const [updated] = await db.update(certificates)
      .set(updateData)
      .where(eq(certificates.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Update certificate error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const authUser = c.get('user');
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(certificates)
      .where(and(eq(certificates.id, id), eq(certificates.userId, authUser.id)));
    if (!existing) return c.json({ error: 'Certificate not found' }, 404);

    await db.delete(certificates).where(eq(certificates.id, id));
    return c.json({ message: 'Certificate deleted' });
  } catch (err) {
    console.error('Delete certificate error:', err);
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
      await db.update(certificates)
        .set({ order: i, updatedAt: new Date() })
        .where(and(eq(certificates.id, body.ids[i]), eq(certificates.userId, authUser.id)));
    }

    return c.json({ message: 'Reordered' });
  } catch (err) {
    console.error('Reorder certificates error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

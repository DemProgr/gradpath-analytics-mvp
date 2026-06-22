import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { blogs } from '../db/schema/blogs';
import { eq, like, sql, desc } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1),
  author: z.string().min(1),
  coverImage: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  try {
    const tag = c.req.query('tag');
    const search = c.req.query('search');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = (page - 1) * limit;

    let query: any = db.select().from(blogs);
    const conditions: any[] = [];

    if (tag) conditions.push(sql`${tag} = ANY(${blogs.tags})`);
    if (search) {
      conditions.push(
        sql`(${like(blogs.title, `%${search}%`)} OR ${like(blogs.excerpt, `%${search}%`)})`
      );
    }

    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`;
      query = query.where(whereClause);
    }

    const results = await query.orderBy(desc(blogs.publishedAt)).limit(limit).offset(offset);
    return c.json(results);
  } catch (err) {
    console.error('Error fetching blogs:', err);
    return c.json({ error: 'Failed to fetch blogs' }, 500);
  }
});

router.get('/:slug', async (c) => {
  try {
    const slug = c.req.param('slug');
    const [item] = await db.select().from(blogs).where(eq(blogs.slug, slug));
    if (!item) return c.json({ error: 'Not found' }, 404);
    return c.json(item);
  } catch (err) {
    console.error('Error fetching blog:', err);
    return c.json({ error: 'Failed to fetch blog' }, 500);
  }
});

router.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [item] = await db.insert(blogs).values(parsed.data as any).returning();
    return c.json(item, 201);
  } catch (err) {
    console.error('Error creating blog:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.put('/:id', authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const body = await c.req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [existing] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!existing) return c.json({ error: 'Not found' }, 404);

    const [updated] = await db.update(blogs)
      .set(parsed.data as any)
      .where(eq(blogs.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Error updating blog:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!existing) return c.json({ error: 'Not found' }, 404);

    await db.delete(blogs).where(eq(blogs.id, id));
    return c.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting blog:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

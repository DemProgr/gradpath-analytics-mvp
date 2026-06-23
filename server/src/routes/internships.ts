import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { internships } from '../db/schema/internships';
import { eq, like, sql, SQL } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  city: z.string().optional().nullable(),
  salaryMin: z.number().int().optional().nullable(),
  salaryMax: z.number().int().optional().nullable(),
  salaryCurrency: z.string().default('BYN'),
  duration: z.string().optional().nullable(),
  type: z.enum(['paid', 'unpaid', 'unknown']).default('paid'),
  category: z.string().min(1),
  requirements: z.array(z.string()).optional(),
  description: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  sourceUrl: z.string().optional().nullable(),
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  try {
    const category = c.req.query('category');
    const city = c.req.query('city');
    const type = c.req.query('type');
    const search = c.req.query('search');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const offset = (page - 1) * limit;

    const baseQuery = db.select().from(internships);
    const conditions: SQL[] = [];

    if (category && category !== 'all') {
      conditions.push(eq(internships.category, category));
    }
    if (city && city !== 'all') {
      conditions.push(eq(internships.city, city));
    }
    if (type && type !== 'all') {
      conditions.push(eq(internships.type, type));
    }
    if (search) {
      conditions.push(
        sql`(${like(internships.title, `%${search}%`)} OR ${like(internships.company, `%${search}%`)})`
      );
    }

    const query = conditions.length > 0
      ? baseQuery.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`)
      : baseQuery;

    const results = await query
      .orderBy(internships.postedAt)
      .limit(limit)
      .offset(offset);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching internships:', err);
    return c.json({ error: 'Failed to fetch internships' }, 500);
  }
});

router.get('/stats', async (c) => {
  try {
    const result = await db.execute(sql`
      SELECT
        COUNT(*)::bigint as total,
        COUNT(*) FILTER (WHERE type = 'paid')::bigint as paid_count,
        COUNT(*) FILTER (WHERE category = 'ИТ' OR category = 'IT')::bigint as it_count,
        COUNT(DISTINCT company)::bigint as company_count
      FROM internships
    `);
    return c.json(result.rows[0] || { total: 0, paid_count: 0, it_count: 0, company_count: 0 });
  } catch (err) {
    console.error('Error fetching internship stats:', err);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

router.get('/categories', async (c) => {
  try {
    const result = await db.execute(sql`
      SELECT DISTINCT category FROM internships ORDER BY category
    `);
    return c.json((result.rows as { category: string }[]).map((r) => r.category));
  } catch (err) {
    console.error('Error fetching categories:', err);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

router.get('/cities', async (c) => {
  try {
    const result = await db.execute(sql`
      SELECT DISTINCT city FROM internships WHERE city IS NOT NULL ORDER BY city
    `);
    return c.json((result.rows as { city: string | null }[]).map((r) => r.city));
  } catch (err) {
    console.error('Error fetching cities:', err);
    return c.json({ error: 'Failed to fetch cities' }, 500);
  }
});

router.post('/', authMiddleware, async (c) => {
  try {
    const body = await c.req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) return c.json({ error: parsed.error.flatten().fieldErrors }, 400);

    const [item] = await db.insert(internships).values(parsed.data as typeof internships.$inferInsert).returning();
    return c.json(item, 201);
  } catch (err) {
    console.error('Error creating internship:', err);
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

    const [existing] = await db.select().from(internships).where(eq(internships.id, id));
    if (!existing) return c.json({ error: 'Not found' }, 404);

    const [updated] = await db.update(internships)
      .set(parsed.data as typeof internships.$inferInsert)
      .where(eq(internships.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Error updating internship:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(internships).where(eq(internships.id, id));
    if (!existing) return c.json({ error: 'Not found' }, 404);

    await db.delete(internships).where(eq(internships.id, id));
    return c.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting internship:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db';
import { events } from '../db/schema/events';
import { eq, like, sql, gte, lte, SQL } from 'drizzle-orm';
import { authMiddleware } from '../middleware/auth';

const router = new Hono();

const createSchema = z.object({
  title: z.string().min(1),
  organizer: z.string().min(1),
  organizerType: z.enum(['company', 'university', 'student_org', 'other']).default('other'),
  date: z.string().min(1),
  endDate: z.string().optional().nullable(),
  time: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  format: z.enum(['offline', 'online', 'hybrid']).default('offline'),
  type: z.enum(['career_fair', 'open_day', 'meetup', 'workshop', 'lecture', 'other']).default('other'),
  description: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateSchema = createSchema.partial();

router.get('/', async (c) => {
  try {
    const type = c.req.query('type');
    const city = c.req.query('city');
    const format = c.req.query('format');
    const organizerType = c.req.query('organizerType');
    const from = c.req.query('from');
    const to = c.req.query('to');
    const search = c.req.query('search');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '100');
    const offset = (page - 1) * limit;

    const baseQuery = db.select().from(events);
    const conditions: SQL[] = [];

    if (type && type !== 'all') conditions.push(eq(events.type, type));
    if (city && city !== 'all') conditions.push(eq(events.city, city));
    if (format && format !== 'all') conditions.push(eq(events.format, format));
    if (organizerType && organizerType !== 'all') conditions.push(eq(events.organizerType, organizerType));
    if (from) conditions.push(gte(events.date, from));
    if (to) conditions.push(lte(events.date, to));
    if (search) {
      conditions.push(
        sql`(${like(events.title, `%${search}%`)} OR ${like(events.organizer, `%${search}%`)})`
      );
    }

    const query = conditions.length > 0
      ? baseQuery.where(conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`)
      : baseQuery;

    const results = await query
      .orderBy(events.date)
      .limit(limit)
      .offset(offset);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching events:', err);
    return c.json({ error: 'Failed to fetch events' }, 500);
  }
});

router.get('/upcoming', async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const results = await db.select().from(events)
      .where(gte(events.date, today))
      .orderBy(events.date)
      .limit(20);
    return c.json(results);
  } catch (err) {
    console.error('Error fetching upcoming events:', err);
    return c.json({ error: 'Failed to fetch upcoming events' }, 500);
  }
});

router.get('/stats', async (c) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const result = await db.execute(sql`
      SELECT
        COUNT(*)::bigint as total,
        COUNT(*) FILTER (WHERE date >= ${today}::date)::bigint as upcoming,
        COUNT(DISTINCT organizer)::bigint as organizers,
        COUNT(DISTINCT city)::bigint as cities
      FROM events
    `);
    return c.json(result.rows[0] || { total: 0, upcoming: 0, organizers: 0, cities: 0 });
  } catch (err) {
    console.error('Error fetching event stats:', err);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

router.get('/cities', async (c) => {
  try {
    const result = await db.execute(sql`
      SELECT DISTINCT city FROM events WHERE city IS NOT NULL ORDER BY city
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

    const [item] = await db.insert(events).values(parsed.data as typeof events.$inferInsert).returning();
    return c.json(item, 201);
  } catch (err) {
    console.error('Error creating event:', err);
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

    const [existing] = await db.select().from(events).where(eq(events.id, id));
    if (!existing) return c.json({ error: 'Not found' }, 404);

    const [updated] = await db.update(events)
      .set(parsed.data as typeof events.$inferInsert)
      .where(eq(events.id, id))
      .returning();

    return c.json(updated);
  } catch (err) {
    console.error('Error updating event:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.delete('/:id', authMiddleware, async (c) => {
  try {
    const id = parseInt(c.req.param('id') || '', 10);
    if (isNaN(id)) return c.json({ error: 'Invalid id' }, 400);

    const [existing] = await db.select().from(events).where(eq(events.id, id));
    if (!existing) return c.json({ error: 'Not found' }, 404);

    await db.delete(events).where(eq(events.id, id));
    return c.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Error deleting event:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export default router;

import { Hono } from 'hono';
import { db } from '../db';
import { vacancies } from '../db/schema/vacancies';
import { eq, ilike, sql } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const category = c.req.query('category');
    const city = c.req.query('city');
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '100');
    const offset = (page - 1) * limit;

    let query = db.select().from(vacancies);
    const conditions: any[] = [];

    if (category) {
      conditions.push(eq(vacancies.category, category));
    }
    if (city) {
      conditions.push(eq(vacancies.city, city));
    }

    if (conditions.length > 0) {
      const whereClause = conditions.length === 1 ? conditions[0] : sql`${conditions[0]}`;
      query = query.where(whereClause) as any;
    }

    const results = await (query as any)
      .orderBy(vacancies.parsedAt)
      .limit(limit)
      .offset(offset);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching vacancies:', err);
    return c.json({ error: 'Failed to fetch vacancies' }, 500);
  }
});

router.get('/stats', async (c) => {
  try {
    const result = await db.execute(sql`
      SELECT
        COALESCE(v.category, 'Другое') as category,
        COUNT(*)::bigint as count,
        ROUND(AVG(v.salary_min) FILTER (WHERE v.salary_min IS NOT NULL))::numeric as avg_salary_min,
        ROUND(AVG(v.salary_max) FILTER (WHERE v.salary_max IS NOT NULL))::numeric as avg_salary_max,
        ROUND(AVG((v.salary_min + v.salary_max) / 2) FILTER (WHERE v.salary_min IS NOT NULL OR v.salary_max IS NOT NULL))::numeric as avg_salary
      FROM vacancies v
      GROUP BY COALESCE(v.category, 'Другое')
      ORDER BY COUNT(*) DESC
    `);

    return c.json(result.rows);
  } catch (err) {
    console.error('Error fetching vacancy stats:', err);
    return c.json({ error: 'Failed to fetch vacancy stats' }, 500);
  }
});

router.get('/count', async (c) => {
  try {
    const result = await db.execute(sql`SELECT COUNT(*)::bigint as count FROM vacancies`);
    return c.json({ count: result.rows[0]?.count || 0 });
  } catch (err) {
    console.error('Error counting vacancies:', err);
    return c.json({ error: 'Failed to count vacancies' }, 500);
  }
});

export default router;

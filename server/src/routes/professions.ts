import { Hono } from 'hono';
import { db } from '../db';
import { professionForecasts } from '../db/schema/profession-forecasts';
import { professionSalaries } from '../db/schema/profession-salaries';
import { professionsSalary } from '../db/schema/professions-salary';
import { eq, ilike, and, sql } from 'drizzle-orm';

interface ProfessionAnalyticsRow {
  id: string;
  profession_name: string;
  category: string;
  demand_level: string;
  forecast_year: number;
  forecast_source: string;
  forecast_city: string;
  description: string | null;
  related_specialties: unknown;
  avg_salary: string | null;
  min_salary: string | null;
  max_salary: string | null;
  vacancies_count: number | null;
  salary_year: number | null;
  salary_month: number | null;
  salary_source: string | null;
  overall_rating: string;
}

const router = new Hono();

router.get('/analytics', async (c) => {
  try {
    const demand = c.req.query('demand');
    const category = c.req.query('category');
    const city = c.req.query('city');
    const year = c.req.query('year');
    const search = c.req.query('search');

    let results = await db.execute(sql`
      SELECT
        pf.id,
        pf.profession_name,
        pf.category,
        pf.demand_level,
        pf.forecast_year,
        pf.source as forecast_source,
        pf.city as forecast_city,
        pf.description,
        pf.related_specialties,
        ps.avg_salary,
        ps.min_salary,
        ps.max_salary,
        ps.vacancies_count,
        ps.year as salary_year,
        ps.month as salary_month,
        ps.source as salary_source,
        CASE
          WHEN pf.demand_level = 'high' AND (ps.avg_salary > 3000 OR ps.vacancies_count > 500) THEN 'excellent'
          WHEN pf.demand_level = 'high' OR ps.avg_salary > 2500 THEN 'good'
          WHEN pf.demand_level = 'medium' THEN 'average'
          ELSE 'below_average'
        END as overall_rating
      FROM profession_forecasts pf
      LEFT JOIN profession_salaries ps
        ON pf.profession_name = ps.profession_name
        AND ps.year = pf.forecast_year
      WHERE pf.forecast_year >= 2026
      ORDER BY
        CASE
          WHEN pf.demand_level = 'high' THEN 0
          WHEN pf.demand_level = 'medium' THEN 1
          ELSE 2
        END,
        pf.profession_name
    `);

    let rows = results.rows as unknown as ProfessionAnalyticsRow[];

    if (demand && demand !== 'all') {
      rows = rows.filter((r) => r.demand_level === demand);
    }
    if (category && category !== 'all') {
      rows = rows.filter((r) => r.category === category);
    }
    if (city && city !== 'all') {
      rows = rows.filter((r) => r.forecast_city === city);
    }
    if (year) {
      rows = rows.filter((r) => r.forecast_year === parseInt(year));
    }
    if (search) {
      rows = rows.filter((r) =>
        r.profession_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    return c.json(rows);
  } catch (err) {
    console.error('Error fetching profession analytics:', err);
    return c.json({ error: 'Failed to fetch profession analytics' }, 500);
  }
});

router.get('/salaries', async (c) => {
  try {
    const results = await db
      .select()
      .from(professionSalaries)
      .orderBy(professionSalaries.year);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching profession salaries:', err);
    return c.json({ error: 'Failed to fetch profession salaries' }, 500);
  }
});

router.get('/salary', async (c) => {
  try {
    const results = await db
      .select()
      .from(professionsSalary)
      .orderBy(professionsSalary.professionName);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching professions salary:', err);
    return c.json({ error: 'Failed to fetch professions salary' }, 500);
  }
});

router.get('/top', async (c) => {
  try {
    const limit = parseInt(c.req.query('limit') || '10');
    const results = await db.execute(sql`
      SELECT
        pf.id,
        pf.profession_name,
        pf.category,
        pf.demand_level,
        pf.forecast_year,
        pf.source as forecast_source,
        pf.city as forecast_city,
        pf.description,
        pf.related_specialties,
        ps.avg_salary,
        ps.min_salary,
        ps.max_salary,
        ps.vacancies_count,
        CASE
          WHEN pf.demand_level = 'high' AND (ps.avg_salary > 3000 OR ps.vacancies_count > 500) THEN 'excellent'
          WHEN pf.demand_level = 'high' OR ps.avg_salary > 2500 THEN 'good'
          WHEN pf.demand_level = 'medium' THEN 'average'
          ELSE 'below_average'
        END as overall_rating
      FROM profession_forecasts pf
      LEFT JOIN profession_salaries ps
        ON pf.profession_name = ps.profession_name
        AND ps.year = pf.forecast_year
      WHERE pf.forecast_year >= 2026
      ORDER BY
        CASE
          WHEN pf.demand_level = 'high' THEN 0
          WHEN pf.demand_level = 'medium' THEN 1
          ELSE 2
        END
      LIMIT ${limit}
    `);
    return c.json(results.rows);
  } catch (err) {
    console.error('Error fetching top professions:', err);
    return c.json({ error: 'Failed to fetch top professions' }, 500);
  }
});

router.get('/search', async (c) => {
  try {
    const query = c.req.query('q');
    if (!query) return c.json([]);

    const results = await db.execute(sql`
      SELECT DISTINCT
        pf.profession_name,
        pf.category,
        pf.demand_level,
        ps.avg_salary
      FROM profession_forecasts pf
      LEFT JOIN profession_salaries ps
        ON pf.profession_name = ps.profession_name
      WHERE pf.profession_name ILIKE ${'%' + query + '%'}
      ORDER BY pf.profession_name
      LIMIT 20
    `);

    return c.json(results.rows);
  } catch (err) {
    console.error('Error searching professions:', err);
    return c.json({ error: 'Failed to search professions' }, 500);
  }
});

router.get('/cities', async (c) => {
  try {
    const results = await db.execute(sql`
      SELECT DISTINCT forecast_city
      FROM profession_forecasts
      WHERE forecast_city IS NOT NULL
      ORDER BY forecast_city
    `);
    return c.json((results.rows as { forecast_city: string }[]).map((r) => r.forecast_city));
  } catch (err) {
    console.error('Error fetching cities:', err);
    return c.json({ error: 'Failed to fetch cities' }, 500);
  }
});

router.get('/stats', async (c) => {
  try {
    const all = await db.execute(sql`SELECT COUNT(*)::bigint as count FROM profession_forecasts WHERE forecast_year >= 2026`);
    const high = await db.execute(sql`SELECT COUNT(*)::bigint as count FROM profession_forecasts WHERE demand_level = 'high' AND forecast_year >= 2026`);
    const medium = await db.execute(sql`SELECT COUNT(*)::bigint as count FROM profession_forecasts WHERE demand_level = 'medium' AND forecast_year >= 2026`);
    const low = await db.execute(sql`SELECT COUNT(*)::bigint as count FROM profession_forecasts WHERE demand_level = 'low' AND forecast_year >= 2026`);

    return c.json({
      total: Number(all.rows[0]?.count || 0),
      byDemand: {
        high: Number(high.rows[0]?.count || 0),
        medium: Number(medium.rows[0]?.count || 0),
        low: Number(low.rows[0]?.count || 0),
      },
    });
  } catch (err) {
    console.error('Error fetching profession stats:', err);
    return c.json({ error: 'Failed to fetch profession stats' }, 500);
  }
});

export default router;

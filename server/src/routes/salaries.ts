import { Hono } from 'hono';
import { db } from '../db';
import { salaryStats } from '../db/schema/salary-stats';
import { salaryStatistics } from '../db/schema/salary-statistics';
import { regionSalaryStats } from '../db/schema/region-salary-stats';
import { eq, sql } from 'drizzle-orm';

const router = new Hono();

router.get('/stats', async (c) => {
  try {
    const results = await db
      .select()
      .from(salaryStats)
      .orderBy(salaryStats.avgSalary);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching salary stats:', err);
    return c.json({ error: 'Failed to fetch salary stats' }, 500);
  }
});

router.get('/statistics', async (c) => {
  try {
    const results = await db
      .select()
      .from(salaryStatistics)
      .orderBy(salaryStatistics.year, salaryStatistics.regionName, salaryStatistics.industryName);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching salary statistics:', err);
    return c.json({ error: 'Failed to fetch salary statistics' }, 500);
  }
});

router.get('/region-stats', async (c) => {
  try {
    const results = await db
      .select()
      .from(regionSalaryStats)
      .orderBy(regionSalaryStats.year, regionSalaryStats.region);

    return c.json(results);
  } catch (err) {
    console.error('Error fetching region salary stats:', err);
    return c.json({ error: 'Failed to fetch region salary stats' }, 500);
  }
});

export default router;

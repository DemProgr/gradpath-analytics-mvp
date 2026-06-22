import { Hono } from 'hono';
import { db } from '../db';
import { admissionStats } from '../db/schema/admission-stats';
import { eq, and } from 'drizzle-orm';

const router = new Hono();

router.get('/', async (c) => {
  try {
    const specialtyId = c.req.query('specialty_id');
    const year = c.req.query('year');

    let results;

    if (specialtyId && year) {
      results = await db
        .select()
        .from(admissionStats)
        .where(
          and(
            eq(admissionStats.specialtyId, specialtyId),
            eq(admissionStats.year, parseInt(year))
          )
        )
        .orderBy(admissionStats.year);
    } else if (specialtyId) {
      results = await db
        .select()
        .from(admissionStats)
        .where(eq(admissionStats.specialtyId, specialtyId))
        .orderBy(admissionStats.year);
    } else {
      results = await db
        .select()
        .from(admissionStats)
        .orderBy(admissionStats.year);
    }

    return c.json(results);
  } catch (err) {
    console.error('Error fetching admission stats:', err);
    return c.json({ error: 'Failed to fetch admission stats' }, 500);
  }
});

export default router;

import { Hono } from 'hono';
import { db } from '../db';
import { vacancies } from '../db/schema/vacancies';
import { parsingSessions } from '../db/schema/parsing-sessions';
import { eq, sql } from 'drizzle-orm';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = new Hono();

router.post('/rabota', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { category } = await c.req.json();

    const [session] = await db.insert(parsingSessions).values({
      source: 'rabota.by',
      category,
      status: 'running',
      currentPage: 0,
      totalPages: 0,
      totalFound: 0,
      newVacancies: 0,
      duplicatesSkipped: 0,
    }).returning();

    return c.json({
      success: true,
      sessionId: session.id,
      message: `Parsing started for category: ${category || 'all'}`,
    });
  } catch (err) {
    console.error('Error starting parse-rabota:', err);
    return c.json({ error: 'Failed to start parsing' }, 500);
  }
});

router.post('/university', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { universityUrl, universityName } = await c.req.json();

    const [session] = await db.insert(parsingSessions).values({
      source: 'university',
      category: universityName || universityUrl,
      status: 'running',
      currentPage: 0,
      totalPages: 1,
      totalFound: 0,
      newVacancies: 0,
      duplicatesSkipped: 0,
    }).returning();

    return c.json({
      success: true,
      sessionId: session.id,
      message: `Parsing university: ${universityName || universityUrl}`,
    });
  } catch (err) {
    console.error('Error starting parse-university:', err);
    return c.json({ error: 'Failed to start parsing' }, 500);
  }
});

export default router;

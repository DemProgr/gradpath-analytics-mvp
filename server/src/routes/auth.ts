import { Hono } from 'hono';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { users } from '../db/schema/users';
import { userRoles } from '../db/schema/user-roles';
import { eq } from 'drizzle-orm';
import { authMiddleware, signToken } from '../middleware/auth';

const router = new Hono();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

router.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: parsed.error.flatten().fieldErrors }, 400);
    }

    const { email, password } = parsed.data;

    const existing = await db.select().from(users).where(eq(users.email, email));
    if (existing.length > 0) {
      return c.json({ error: 'User with this email already exists' }, 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await db.insert(users).values({
      email,
      hashedPassword,
      displayName: email.split('@')[0],
    }).returning();

    await db.insert(userRoles).values({ userId: String(newUser.id), role: 'user' });

    const token = signToken({
      id: newUser.id,
      email: newUser.email!,
      role: 'user',
    });

    return c.json({
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        displayName: newUser.displayName,
        role: 'user',
      },
    });
  } catch (err) {
    console.error('Register error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: 'Invalid email or password format' }, 400);
    }

    const { email, password } = parsed.data;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const valid = await bcrypt.compare(password, user.hashedPassword!);
    if (!valid) {
      return c.json({ error: 'Invalid email or password' }, 401);
    }

    const role = user.role || 'user';

    const token = signToken({
      id: user.id,
      email: user.email!,
      role,
    });

    return c.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

router.get('/me', authMiddleware, async (c) => {
  const authUser = c.get('user');

  const [user] = await db.select().from(users).where(eq(users.id, authUser.id));
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const role = user.role || 'user';

  return c.json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role,
    },
  });
});

export default router;

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { users } from '@/db/schema';

const app = new Hono().post(
  '/',
  zValidator('json', z.object({ name: z.string(), email: z.string().email(), password: z.string().min(3).max(20) })),
  async (c) => {
    const { name, email, password } = c.req.valid('json');
    const result = await db.select().from(users).where(eq(users.email, email));

    if (result.length) {
      return c.json({ error: 'Email already in use' }, 400);
    }

    await db.insert(users).values({
      name,
      email,
      password: bcrypt.hashSync(password, 12),
    });

    return c.json(null, 200);
  }
);

export default app;

import { Hono } from 'hono';
import { verifyAuth } from '@hono/auth-js';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';

const app = new Hono().post(
  '/',
  verifyAuth(),
  zValidator(
    'json',
    z.object({
      name: z.string(),
      json: z.string(),
      width: z.number(),
      height: z.number(),
    })
  ),
  async (c) => {
    const json = c.req.valid('json');
    const auth = c.get('authUser');

    const result = await db
      .insert(projects)
      .values({
        userId: auth.user!.id,
        createdAt: new Date(),
        updateAt: new Date(),
        ...json,
      })
      .returning();

    const project = result[0];

    if (!project) {
      return c.json({ error: 'Something went wrong' }, 400);
    }

    return c.json({ data: project });
  }
);

export default app;

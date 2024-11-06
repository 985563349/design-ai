import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { eq, and, desc } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';

const insertProjectSchema = createInsertSchema(projects);

const app = new Hono()
  .get('/', zValidator('query', z.object({ page: z.coerce.number(), limit: z.coerce.number() })), async (c) => {
    const auth = c.get('authUser');
    const { page, limit } = c.req.valid('query');

    const result = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, auth.session.user!.id!))
      .offset((page - 1) * limit)
      .limit(limit)
      .orderBy(desc(projects.createdAt));

    return c.json({ data: result });
  })

  .get('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const auth = c.get('authUser');
    const { id } = c.req.valid('param');

    const result = await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, auth.session.user!.id!), eq(projects.id, id)));

    const project = result[0];

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ data: project });
  })

  .post(
    '/',
    zValidator('json', insertProjectSchema.pick({ name: true, json: true, width: true, height: true })),
    async (c) => {
      const auth = c.get('authUser');
      const json = c.req.valid('json');

      const result = await db
        .insert(projects)
        .values({
          userId: auth.session.user!.id!,
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
  )

  .patch(
    '/:id',
    zValidator('param', z.object({ id: z.string() })),
    zValidator('json', insertProjectSchema.pick({ name: true, json: true, width: true, height: true }).partial()),
    async (c) => {
      const auth = c.get('authUser');
      const { id } = c.req.valid('param');
      const json = c.req.valid('json');

      const result = await db
        .update(projects)
        .set({ ...json, updateAt: new Date() })
        .where(and(eq(projects.userId, auth.session.user!.id!), eq(projects.id, id)))
        .returning();

      const project = result[0];

      if (!project) {
        return c.json({ error: 'Project not found' }, 404);
      }

      return c.json({ data: project });
    }
  )

  .delete('/:id', zValidator('param', z.object({ id: z.string() })), async (c) => {
    const auth = c.get('authUser');
    const { id } = c.req.valid('param');

    const result = await db
      .delete(projects)
      .where(and(eq(projects.userId, auth.session.user!.id!), eq(projects.id, id)))
      .returning();

    const project = result[0];

    if (!project) {
      return c.json({ error: 'Project not found' }, 404);
    }

    return c.json({ data: project });
  });

export default app;

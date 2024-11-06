import { Hono } from 'hono';
import { desc, eq } from 'drizzle-orm';

import { db } from '@/db/drizzle';
import { projects } from '@/db/schema';

const app = new Hono().get('/', async (c) => {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.isTemplate, true))
    .orderBy(desc(projects.createdAt));

  return c.json({ data: result });
});

export default app;

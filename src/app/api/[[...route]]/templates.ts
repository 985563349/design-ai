import { Hono } from 'hono';

const app = new Hono().get('/', async (c) => {
  return c.json({ data: 'templates' });
});

export default app;

import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { env } from 'hono/adapter';
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js';

import authConfig from '@/auth.config';
import users from './users';
import projects from './projects';
import templates from './templates';
import images from './images';
import ai from './ai';

// Revert to 'edge' if planning on running on the edge
export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

app.use(
  '*',
  initAuthConfig((c) => ({ secret: env(c).AUTH_SECRET, ...authConfig }))
);

app.use('/users', authHandler());
app.use('*', verifyAuth());

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app
  .route('/users', users)
  .route('/projects', projects)
  .route('/templates', templates)
  .route('/images', images)
  .route('/ai', ai);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;

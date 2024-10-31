import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { env } from 'hono/adapter';
import { initAuthConfig } from '@hono/auth-js';

import authConfig from '@/auth.config';
import users from './users';
import projects from './projects';
import images from './images';

// Revert to 'edge' if planning on running on the edge
export const runtime = 'nodejs';

const app = new Hono().basePath('/api');

app.use(
  '*',
  initAuthConfig((c) => ({ secret: env(c).AUTH_SECRET, ...authConfig }))
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const routes = app.route('/users', users).route('/projects', projects).route('/images', images);

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;

import { Hono } from 'hono';
import { verifyAuth } from '@hono/auth-js';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch,
});

const app = new Hono().get('/', verifyAuth(), async (c) => {
  const images = await unsplash.photos.getRandom({
    collectionIds: ['20210505'],
    count: 50,
  });

  if (images.errors) {
    return c.json({ error: 'Something went wrong' }, 400);
  }

  let response = images.response;

  if (!Array.isArray(response)) {
    response = [response];
  }

  return c.json({ data: response });
});

export default app;

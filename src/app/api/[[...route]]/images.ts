import { Hono } from 'hono';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch,
});

const app = new Hono().get('/', async (c) => {
  const result = await unsplash.photos.getRandom({
    collectionIds: ['20210505'],
    count: 50,
  });

  if (result.errors) {
    return c.json({ error: 'Something went wrong' }, 400);
  }

  let images = result.response;

  if (!Array.isArray(images)) {
    images = [images];
  }

  return c.json(images);
});

export default app;

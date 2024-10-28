import { Hono } from 'hono';
import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY!,
  fetch,
});

const app = new Hono().get('/', async (c) => {
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
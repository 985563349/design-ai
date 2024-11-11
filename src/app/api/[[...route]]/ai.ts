import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import Replicate from 'replicate';
import { z } from 'zod';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

const app = new Hono()
  .post('/generate-image', zValidator('json', z.object({ prompt: z.string() })), async (c) => {
    const { prompt } = c.req.valid('json');

    const input = {
      cfg: 3.5,
      steps: 28,
      prompt,
      aspect_ratio: '3:2',
      output_format: 'webp',
      output_quality: 90,
      negative_prompt: '',
      prompt_strength: 0.85,
    };

    const output = await replicate.run('stability-ai/stable-diffusion-3', { input });
    const url = (output as string[])[0];

    if (!url) {
      return c.json({ error: 'Something went wrong' }, 400);
    }

    return c.json({ data: url });
  })
  .post('/remove-background', zValidator('json', z.object({ image: z.string() })), async (c) => {
    const { image } = c.req.valid('json');

    const input = {
      image,
    };

    const output: unknown = await replicate.run('cjwbw/rembg:fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003', {
      input,
    });

    if (!output) {
      return c.json({ error: 'Something went wrong' }, 400);
    }

    return c.json({ data: output as string });
  });

export default app;

import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import Replicate from 'replicate';
import { z } from 'zod';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
  useFileOutput: false,
});

const app = new Hono().post('/generate-image', zValidator('json', z.object({ prompt: z.string() })), async (c) => {
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
});

export default app;

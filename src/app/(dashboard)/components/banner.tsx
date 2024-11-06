'use client';

import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { ArrowRight, Sparkles } from 'lucide-react';

import { client } from '@/lib/hono';
import { Button } from '@/components/ui/button';

const $post = client.api.projects.$post;

const Banner: React.FC = () => {
  const mutation = useMutation<InferResponseType<typeof $post>, Error, InferRequestType<typeof $post>['json']>({
    mutationFn: async (json) => {
      const response = await $post({ json });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return await response.json();
    },
  });

  const onClick = () => {
    mutation.mutate({ name: 'Untitled project', json: '', width: 900, height: 1200 });
  };

  return (
    <div className="flex items-center gap-x-6 rounded-xl p-6 aspect-[5/1] text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
      <div className="flex items-center justify-center rounded-full size-28 bg-white/50">
        <div className="flex items-center justify-center rounded-full size-20 bg-white">
          <Sparkles className="text-blue-600 fill-blue-600" />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-semibold">Visualize your ideas with Image AI</h1>
        <p className="mb-2 text-sm">Turn inspiration into design in no time. Simply upload an image and let AI do the rest.</p>
        <Button onClick={onClick} className="w-40" variant="secondary">
          Start creating
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Banner;

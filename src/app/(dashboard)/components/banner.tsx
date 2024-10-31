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
    mutation.mutate({
      name: '未命名项目',
      json: '',
      width: 900,
      height: 1200,
    });
  };

  return (
    <div className="flex items-center gap-x-6 rounded-xl p-6 aspect-[5/1] text-white bg-gradient-to-r from-blue-600 via-blue-500 to-blue-400">
      <div className="flex items-center justify-center rounded-full size-28 bg-white/50">
        <div className="flex items-center justify-center rounded-full size-20 bg-white">
          <Sparkles className="text-blue-600 fill-blue-600" />
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl font-semibold">利用图像 AI 实现您的创意</h1>
        <p className="mb-2 text-sm">瞬间将灵感转化为设计。只需上传图片，剩下的就交给 AI 吧。</p>
        <Button onClick={onClick} className="w-40" variant="secondary">
          开始创建
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
};

export default Banner;

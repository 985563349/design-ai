'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { Loader, Search, TriangleAlert } from 'lucide-react';

import { client } from '@/lib/hono';

const $post = client.api.projects.$post;

const TemplatesSection: React.FC = () => {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await client.api.templates.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      return (await response.json()).data;
    },
  });

  const mutation = useMutation<InferResponseType<typeof $post, 200>, Error, InferRequestType<typeof $post>['json']>({
    mutationFn: async (json) => {
      const response = await $post({ json });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return response.json();
    },
    onSuccess({ data }) {
      router.push(`/design/${data.id}`);
    },
  });

  const onClick = (template: InferRequestType<typeof $post>['json']) => {
    mutation.mutate({ ...template, name: 'Untitled project' });
  };

  if (isLoading) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-semibold">Start from a template</h3>
        <div className="flex items-center justify-center min-h-32">
          <Loader className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-semibold">Start from a template</h3>
        <div className="flex flex-col items-center justify-center gap-y-4 min-h-32">
          <TriangleAlert className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Error fetching templates</p>
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div>
        <h3 className="mb-4 text-lg font-semibold">Start from a template</h3>
        <div className="flex flex-col items-center justify-center gap-y-4 min-h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No templates found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="mb-4 text-lg font-semibold">Start from a template</h3>

      <div className="grid grid-cols-8 gap-4">
        {data?.map((template, index) => (
          <div className="space-y-2 group cursor-pointer" key={index} onClick={() => onClick(template)}>
            <div style={{ aspectRatio: '900/1200' }} className="relative rounded-xl overflow-hidden">
              <Image
                className="object-cover transform group-hover:scale-105 transition"
                fill
                src={template.thumbnailUrl!}
                alt="template"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition backdrop-filter backdrop-blur-sm bg-black/50">
                <p className="font-medium text-white">Open in editor</p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">{template.name}</p>
              <p className="text-xs text-muted-foreground opacity-0 group-hover:opacity-75 transition">
                {`${template.width} x ${template.height} px`}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplatesSection;

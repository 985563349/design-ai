'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { Loader, Search, TriangleAlert } from 'lucide-react';

import { client } from '@/lib/hono';

const TemplatesSection: React.FC = () => {
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
          <div className="space-y-2 group cursor-pointer" key={index}>
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

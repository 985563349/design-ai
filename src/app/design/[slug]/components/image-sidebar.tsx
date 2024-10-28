'use client';

import Image from 'next/image';
import Link from 'next/link';
import { fabric } from 'fabric';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader } from 'lucide-react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { client } from '@/lib/hono';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const ImageSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage, getWorkspace, add } = useEditorController();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const response = await client.api.images.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      return (await response.json()).data;
    },
  });

  const addImage = (url: string) => {
    if (!stage) return;

    const callback = (image: fabric.Image) => {
      const workspace = getWorkspace();

      image.scaleToWidth(workspace?.width ?? 0);
      image.scaleToHeight(workspace?.height ?? 0);

      add(image);
    };

    fabric.Image.fromURL(url, callback, { crossOrigin: 'anonymous' });
  };

  return (
    <Drawer
      visible={activeTool === 'images'}
      title="Images"
      description="Add images to your canvas"
      onClose={() => setActiveTool('select')}
    >
      {isLoading && (
        <div className="flex-1 flex items-center justify-center w-80">
          <Loader className="text-muted-foreground animate-spin" />
        </div>
      )}

      {isError && (
        <div className="flex-1 flex items-center justify-center flex-col gap-y-4 w-80">
          <AlertTriangle className="text-muted-foreground" />
          <p className="text-muted-foreground">Failed to fetch images</p>
        </div>
      )}

      {data && (
        <ScrollArea className="w-80">
          <div className="grid grid-cols-2 gap-4 p-4">
            {data.map((image) => (
              <button
                key={image.id}
                className="relative border rounded-sm w-full h-28 group hover:opacity-75 transition bg-muted overflow-hidden"
                onClick={() => addImage(image.urls.regular)}
              >
                <Image className="object-cover" fill src={image.urls.small} alt={image.alt_description ?? 'Image'} />
                <Link
                  className="absolute left-0 bottom-0 p-1 w-full text-xs text-left truncate text-white bg-black/50 opacity-0 group-hover:opacity-100 hover:underline"
                  href={image.links.html}
                  target="_blank"
                >
                  {image.user.name}
                </Link>
              </button>
            ))}
          </div>
        </ScrollArea>
      )}
    </Drawer>
  );
};

export default ImageSidebar;

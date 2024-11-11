'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { fabric } from 'fabric';
import { AlertTriangle, ImageIcon, Loader } from 'lucide-react';

import { client } from '@/lib/hono';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';

const ImageSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage, getWorkspace, add } = useEditorController();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['images'],
    queryFn: async () => {
      const response = await client.api.images.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }

      return response.json();
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
      <div className="flex-1 flex flex-col gap-y-4 w-80 overflow-hidden">
        <div className="px-4 pt-4">
          <Button className="w-full">
            <ImageIcon />
            Open Image
          </Button>
        </div>

        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader className="text-muted-foreground animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex-1 flex items-center justify-center flex-col gap-y-4">
            <AlertTriangle className="text-muted-foreground" />
            <p className="text-muted-foreground">Failed to fetch images</p>
          </div>
        )}

        {data && (
          <ScrollArea>
            <div className="grid grid-cols-2 gap-4 px-4 pb-4">
              {data.map((image) => (
                <div
                  key={image.id}
                  className="relative border rounded-sm w-full h-28 group hover:opacity-75 transition bg-muted overflow-hidden cursor-pointer"
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
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </Drawer>
  );
};

export default ImageSidebar;

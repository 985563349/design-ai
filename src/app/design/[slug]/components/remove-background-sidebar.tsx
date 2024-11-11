'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useMutation } from '@tanstack/react-query';
import { fabric } from 'fabric';
import { AlertTriangleIcon, Loader2 } from 'lucide-react';

import { client } from '@/lib/hono';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const RemoveBackgroundSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage, getWorkspace, add } = useEditorController();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();

  // @ts-ignore
  const src = selectedObject?._originalElement?.currentSrc;

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

  const mutation = useMutation({
    mutationFn: async (image: string) => {
      const response = await client.api.ai['remove-background'].$post({ json: { image } });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return response.json();
    },

    onSuccess({ data }) {
      addImage(data);
    },
  });

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      visible={activeTool === 'remove-background'}
      title="Background removal"
      description="Remove background from image using AI"
      onClose={() => setActiveTool('select')}
    >
      <div className="flex-1 flex flex-col w-80 overflow-hidden">
        {!src && (
          <div className="flex-1 flex flex-col items-center justify-center gap-y-4">
            <AlertTriangleIcon className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Feature not available for this object</p>
          </div>
        )}

        {src && (
          <ScrollArea>
            <div className="p-4 space-y-4">
              <div className="relative aspect-square rounded-md overflow-hidden transition bg-muted">
                <Image src={src} alt="Image" className="object-cover" fill />
              </div>
              <Button
                className="w-full"
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate(src);
                }}
              >
                {mutation.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                Remove background
              </Button>
            </div>
          </ScrollArea>
        )}
      </div>
    </Drawer>
  );
};

export default RemoveBackgroundSidebar;

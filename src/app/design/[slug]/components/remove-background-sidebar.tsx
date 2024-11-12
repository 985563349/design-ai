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
import useDerivedState from '@/hooks/use-derived-state';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const RemoveBackgroundSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage } = useEditorController();
  const { save } = useEditorHistory();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const [currentSrc, setCurrentSrc] = useDerivedState<string>(
    // @ts-ignore
    () => selectedObject?._originalElement?.currentSrc,
    [selectedObject]
  );

  const changeImageSrc = (src: string) => {
    if (!stage || !selectedObject) return;

    (selectedObject as fabric.Image).setSrc(src, () => {
      stage.renderAll();
      save();
    });
    setCurrentSrc(src);
  };

  const mutation = useMutation({
    mutationFn: async (image: string) => {
      const response = await client.api.ai['remove-background'].$post({ json: { image } });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return response.json();
    },

    onSuccess({ url }) {
      changeImageSrc(url);
    },
  });

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      open={activeTool === 'remove-background'}
      title="Background removal"
      description="Remove background from image using AI"
      onClose={() => setActiveTool('select')}
    >
      <div className="flex-1 flex flex-col w-80 overflow-hidden">
        {!currentSrc && (
          <div className="flex-1 flex flex-col items-center justify-center gap-y-4">
            <AlertTriangleIcon className="text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Feature not available for this object</p>
          </div>
        )}

        {currentSrc && (
          <ScrollArea>
            <div className="p-4 space-y-4">
              <div className="relative aspect-square rounded-md overflow-hidden transition bg-muted">
                <Image src={currentSrc} alt="Image" className="object-cover" fill />
              </div>
              <Button
                className="w-full"
                disabled={mutation.isPending}
                onClick={() => {
                  mutation.mutate(currentSrc);
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

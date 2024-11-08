'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AlertTriangleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const RemoveBackgroundSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();

  // @ts-ignore
  const src = selectedObject?._originalElement?.currentSrc;

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
              <Button className="w-full">Remove background</Button>
            </div>
          </ScrollArea>
        )}
      </div>
    </Drawer>
  );
};

export default RemoveBackgroundSidebar;

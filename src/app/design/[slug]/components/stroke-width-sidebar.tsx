'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const StrokeWidthSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const strokeWidth = useEditorStore((state) => state.strokeWidth);
  const setStrokeWidth = useEditorStore((state) => state.setStrokeWidth);
  const strokeDashArray = useEditorStore((state) => state.strokeDashArray);
  const setStrokeDashArray = useEditorStore((state) => state.setStrokeDashArray);

  const { stage } = useEditorController();
  const { save } = useEditorHistory();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const effectiveStrokeWidth = selectedObject?.get('strokeWidth') ?? strokeWidth;
  const effectiveStrokeDashArray = selectedObject?.get('strokeDashArray') ?? strokeDashArray;

  const onStrokeWidthChange = (width: number) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => object.set({ strokeWidth: width }));
      stage.renderAll();
    }

    setStrokeWidth(width);
  };

  const onStrokeWidthCommit = () => {
    if (stage?.getActiveObjects().length) {
      save();
    }
  };

  const onStrokeTypeChange = (type: number[]) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => object.set({ strokeDashArray: type }));
      stage.renderAll();
      save();
    }

    setStrokeDashArray(type);
  };

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      open={activeTool === 'stroke-width'}
      title="Stroke Options"
      description="Modify the stroke of your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-8">
          <div className="space-y-4">
            <Label className="text-sm">Stroke width</Label>
            <Slider
              value={[effectiveStrokeWidth]}
              onValueChange={(value) => onStrokeWidthChange(value[0])}
              onValueCommit={onStrokeWidthCommit}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-sm">Stroke type</Label>
            <Button
              className={cn(
                '!p-4 w-full border-2 border-transparent',
                !effectiveStrokeDashArray.length && 'border-blue-500'
              )}
              variant="secondary"
              size="lg"
              onClick={() => onStrokeTypeChange([])}
            >
              <div className="rounded-full border-4 border-black w-full"></div>
            </Button>

            <Button
              className={cn(
                '!p-4 w-full border-2 border-transparent',
                effectiveStrokeDashArray.length && 'border-blue-500'
              )}
              variant="secondary"
              size="lg"
              onClick={() => onStrokeTypeChange([5, 5])}
            >
              <div className="rounded-full border-4 border-dashed border-black w-full"></div>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default StrokeWidthSidebar;

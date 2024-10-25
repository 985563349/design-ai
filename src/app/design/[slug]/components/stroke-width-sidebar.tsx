'use client';

import { useMemo } from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const StrokeWidthSidebar: React.FC = () => {
  const { activeTool, strokeWidth, strokeDashArray, setActiveTool, setStrokeWidth, setStrokeDashArray } = useEditorStore(
    (state) => state
  );
  const { stage, selectedObjects } = useEditorController();

  const effectiveStrokeColor = useMemo(
    () => selectedObjects[0]?.get('strokeWidth') ?? strokeWidth,
    [selectedObjects, strokeWidth]
  );

  const effectiveStrokeDashArray = useMemo(
    () => selectedObjects[0]?.get('strokeDashArray') ?? strokeDashArray,
    [selectedObjects, strokeDashArray]
  );

  const changeStrokeWidth = (width: typeof strokeWidth) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: width });
      });
      stage.freeDrawingBrush.width = width;
      stage.renderAll();
    }

    setStrokeWidth(width);
  };

  const changeStrokeType = (type: typeof strokeDashArray) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: type });
      });
      stage.renderAll();
    }

    setStrokeDashArray(type);
  };

  return (
    <Drawer
      visible={activeTool === 'stroke-width'}
      title="Stroke Options"
      description="Modify the stroke of your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="space-y-4 p-4 border-b">
          <Label className="text-sm">Stroke width</Label>
          <Slider value={[effectiveStrokeColor]} onValueChange={(value) => changeStrokeWidth(value[0])} />
        </div>

        <div className="space-y-4 p-4 border-b">
          <Label className="text-sm">Stroke type</Label>
          <Button
            className={cn('!p-4 w-full border-2 border-transparent', !effectiveStrokeDashArray.length && 'border-blue-500')}
            variant="secondary"
            size="lg"
            onClick={() => changeStrokeType([])}
          >
            <div className="rounded-full border-4 border-black w-full"></div>
          </Button>

          <Button
            className={cn('!p-4 w-full border-2 border-transparent', effectiveStrokeDashArray.length && 'border-blue-500')}
            variant="secondary"
            size="lg"
            onClick={() => changeStrokeType([5, 5])}
          >
            <div className="rounded-full border-4 border-dashed border-black w-full"></div>
          </Button>
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default StrokeWidthSidebar;

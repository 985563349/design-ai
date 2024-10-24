'use client';

import { useMemo } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const StrokeColorSidebar: React.FC = () => {
  const { stage, selectedObjects } = useEditorController();
  const { activeTool, strokeColor, setActiveTool, setStrokeColor } = useEditorStore((state) => state);

  const effectiveStrokeColor = useMemo(
    () => (selectedObjects[0]?.get('stroke') ?? strokeColor) as string,
    [selectedObjects, strokeColor]
  );

  const changeStrokeColor = (color: typeof strokeColor) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        object.set({ stroke: color });
      });
      stage.freeDrawingBrush.color = color;
      stage.renderAll();
    }
    setStrokeColor(color);
  };

  return (
    <Drawer
      visible={activeTool === 'stroke-color'}
      title="Stroke Color"
      description="Add stroke color to your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4">
          <ColorPicker value={effectiveStrokeColor} onChange={changeStrokeColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default StrokeColorSidebar;

'use client';

import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const StrokeColorSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const strokeColor = useEditorStore((state) => state.strokeColor);
  const setStrokeColor = useEditorStore((state) => state.setStrokeColor);

  const { stage } = useEditorController();

  const [selectedObject, setSelectedObjects] = useState<fabric.Object>();
  const effectiveStrokeColor = selectedObject?.get('stroke') ?? strokeColor;

  const changeStrokeColor = (color: typeof strokeColor) => {
    if (!stage) return;

    stage.getActiveObjects().forEach((object) => object.set({ stroke: color }));
    stage.renderAll();
    setStrokeColor(color);
  };

  useOnSelectionChange((objects) => setSelectedObjects(objects[0]));

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

'use client';

import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const StrokeColorSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const strokeColor = useEditorStore((state) => state.strokeColor);
  const setStrokeColor = useEditorStore((state) => state.setStrokeColor);

  const { stage } = useEditorController();
  const { save } = useEditorHistory();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const effectiveStrokeColor = selectedObject?.get('stroke') ?? strokeColor;

  const onColorChange = (color: string) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => object.set({ stroke: color }));
      stage.renderAll();
    }
    setStrokeColor(color);
  };

  const onChangeComplete = () => {
    if (stage?.getActiveObjects().length) {
      save();
    }
  };

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      open={activeTool === 'stroke-color'}
      title="Stroke Color"
      description="Add stroke color to your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4">
          <ColorPicker value={effectiveStrokeColor} onChange={onColorChange} onChangeComplete={onChangeComplete} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default StrokeColorSidebar;

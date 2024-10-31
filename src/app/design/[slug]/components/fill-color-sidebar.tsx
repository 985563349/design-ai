'use client';

import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const FillColorSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const fillColor = useEditorStore((state) => state.fillColor);
  const setFillColor = useEditorStore((state) => state.setFillColor);

  const { stage } = useEditorController();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const effectiveFillColor = selectedObject?.get('fill') ?? fillColor;

  const changeFillColor = (color: typeof fillColor) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => object.set({ fill: color }));
      stage.renderAll();
    }
    setFillColor(color);
  };

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      visible={activeTool === 'fill'}
      title="Fill Color"
      description="Add fill color to your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4">
          <ColorPicker value={effectiveFillColor as string} onChange={changeFillColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default FillColorSidebar;

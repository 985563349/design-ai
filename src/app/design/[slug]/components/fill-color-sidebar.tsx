'use client';

import { useMemo } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const FillColorSidebar: React.FC = () => {
  const { stage, selectedObjects } = useEditorController();
  const { activeTool, fillColor, setActiveTool, setFillColor } = useEditorStore((state) => state);

  const activeFillColor = useMemo(() => selectedObjects[0]?.get('fill') ?? fillColor, [selectedObjects, fillColor]);

  const changeFillColor = (color: typeof fillColor) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => object.set({ fill: color }));
      stage.renderAll();
    }
    setFillColor(color);
  };

  return (
    <Drawer
      visible={activeTool === 'fill'}
      title="Fill Color"
      description="Add fill color to your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4">
          <ColorPicker value={activeFillColor as string} onChange={changeFillColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default FillColorSidebar;

'use client';

import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import Drawer from '@/components/drawer';
import useDerivedState from '@/hooks/use-derived-state';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const OpacitySidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage } = useEditorController();
  const { save } = useEditorHistory();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const [opacity, setOpacity] = useDerivedState(() => selectedObject?.get('opacity') ?? 1, [selectedObject]);

  const onOpacityChange = (opacity: number) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => object.set({ opacity }));
      stage.renderAll();
    }

    setOpacity(opacity);
  };

  const onOpacityCommit = () => {
    if (stage?.getActiveObjects().length) {
      save();
    }
  };

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      open={activeTool === 'opacity'}
      title="Opacity"
      description="Change the opacity of the select opacity"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="space-y-4 p-4">
          <Slider
            value={[opacity]}
            min={0}
            max={1}
            step={0.01}
            onValueChange={(value) => onOpacityChange(value[0])}
            onValueCommit={onOpacityCommit}
          />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default OpacitySidebar;

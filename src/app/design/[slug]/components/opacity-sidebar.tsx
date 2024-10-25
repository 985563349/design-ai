'use client';

import useDerivedState from '@/hooks/use-computed-state';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const OpacitySidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage, selectedObjects } = useEditorController();

  const [opacity, setOpacity] = useDerivedState(() => selectedObjects[0]?.get('opacity') ?? 1, [selectedObjects]);

  const changeOpacity = (opacity: number) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        object.set({ opacity });
      });
      stage.renderAll();
    }
    setOpacity(opacity);
  };

  return (
    <Drawer
      visible={activeTool === 'opacity'}
      title="Opacity"
      description="Change the opacity of the select opacity"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="space-y-4 p-4 border-b">
          <Slider value={[opacity]} min={0} max={1} step={0.01} onValueChange={(value) => changeOpacity(value[0])} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default OpacitySidebar;

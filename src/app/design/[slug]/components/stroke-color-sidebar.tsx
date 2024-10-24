'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store-provider';

const StrokeColorSidebar: React.FC = () => {
  const { activeTool, strokeColor, setActiveTool, setStrokeColor } = useEditorStore((state) => state);

  return (
    <Drawer
      visible={activeTool === 'stroke-color'}
      title="Stroke Color"
      description="Add stroke color to your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4">
          <ColorPicker value={strokeColor} onChange={setStrokeColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default StrokeColorSidebar;

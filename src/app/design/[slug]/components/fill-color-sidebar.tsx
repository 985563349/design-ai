'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import { useEditorStore } from '../providers/editor-store-provider';

const FillColorSidebar: React.FC = () => {
  const { activeTool, fillColor, setActiveTool, setFillColor } = useEditorStore((state) => state);

  return (
    <Drawer
      visible={activeTool === 'fill'}
      title="Fill Color"
      description="Add fill color to your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4">
          <ColorPicker value={fillColor} onChange={setFillColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default FillColorSidebar;

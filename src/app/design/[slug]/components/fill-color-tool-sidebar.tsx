'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';

const FillColorToolSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);

  const onClose = () => {
    setActiveTool('select');
  };

  return (
    <Drawer
      visible={activeTool === 'text'}
      title="Fill Color"
      description="Add fill color to your element"
      onClose={onClose}
    >
      <ScrollArea className="w-80">
        <div className="grid grid-cols-3 gap-4 p-4"></div>
      </ScrollArea>
    </Drawer>
  );
};

export default FillColorToolSidebar;

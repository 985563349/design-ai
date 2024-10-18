'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import ToolSidebar from './tool-sidebar';

import { useEditor } from '../providers/editor';

const FillColorToolSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditor();

  const onClose = () => {
    setActiveTool('select');
  };

  return (
    <ToolSidebar
      visible={activeTool === 'text'}
      title="Fill Color"
      description="Add fill color to your element"
      onClose={onClose}
    >
      <ScrollArea className="w-80">
        <div className="grid grid-cols-3 gap-4 p-4"></div>
      </ScrollArea>
    </ToolSidebar>
  );
};

export default FillColorToolSidebar;

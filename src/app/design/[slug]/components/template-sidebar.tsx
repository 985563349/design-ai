'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';

const TemplateSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage } = useEditorController();

  return (
    <Drawer
      visible={activeTool === 'templates'}
      title="Templates"
      description="Choose from a variety of templates to get started"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="space-y-4 p-4"></div>
      </ScrollArea>
    </Drawer>
  );
};

export default TemplateSidebar;

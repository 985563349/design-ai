'use client';

import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { ScrollArea } from '@/components/ui/scroll-area';

const AiSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  return (
    <Drawer
      visible={activeTool === 'ai'}
      title="AI"
      description="Generate an image using AI"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <form className="p-4 space-y-4">
          <Textarea
            required
            cols={30}
            rows={10}
            minLength={3}
            placeholder="An astronaut riding a horse on mars, hd, dramatic lighting"
          />
          <Button className="w-full" type="submit">
            Generate
          </Button>
        </form>
      </ScrollArea>
    </Drawer>
  );
};

export default AiSidebar;

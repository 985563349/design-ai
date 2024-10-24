'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';

const StrokeWidthSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);

  return (
    <Drawer
      visible={activeTool === 'stroke-width'}
      title="Stroke Options"
      description="Modify the stroke of your element"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="space-y-4 p-4 border-b">
          <Label className="text-sm">Stroke width</Label>
          <Slider />
        </div>

        <div className="space-y-4 p-4 border-b">
          <Label className="text-sm">Stroke type</Label>
          <Button className="!p-4 w-full" variant="secondary" size="lg">
            <div className="rounded-full border-4 border-black w-full"></div>
          </Button>

          <Button className="!p-4 w-full" variant="secondary" size="lg">
            <div className="rounded-full border-4 border-dashed border-black w-full"></div>
          </Button>
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default StrokeWidthSidebar;

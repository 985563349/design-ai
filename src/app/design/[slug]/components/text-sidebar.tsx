'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';
import { createText } from '../helpers/graphics';

const TextSidebar: React.FC = () => {
  const { activeTool, fillColor, setActiveTool } = useEditorStore((state) => state);
  const { add } = useEditorController();

  const addTextbox = () => {
    add(createText('Textbox', { fill: fillColor }));
  };

  const addHeading = () => {
    add(createText('Heading', { fill: fillColor, fontSize: 80, fontWeight: 700 }));
  };

  const addSubheading = () => {
    add(createText('Subheading', { fill: fillColor, fontSize: 44, fontWeight: 600 }));
  };

  const addParagraph = () => {
    add(createText('Paragraph', { fill: fillColor, fontSize: 32 }));
  };

  return (
    <Drawer
      visible={activeTool === 'text'}
      title="Text"
      description="Add text to your canvas"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-4">
          <Button className="w-full" onClick={addTextbox}>
            Add a textbox
          </Button>

          <Button className="w-full h-16" variant="secondary" size="lg" onClick={addHeading}>
            <span className="text-3xl font-bold">Add a heading</span>
          </Button>

          <Button className="w-full h-16" variant="secondary" size="lg" onClick={addSubheading}>
            <span className="text-xl font-semibold">Add a subheading</span>
          </Button>

          <Button className="w-full h-16" variant="secondary" size="lg" onClick={addParagraph}>
            Paragraph
          </Button>
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default TextSidebar;

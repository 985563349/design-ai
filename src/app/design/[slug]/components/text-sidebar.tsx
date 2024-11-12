'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { createTextShapeObject } from '../lib/helpers';

const TextSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const fillColor = useEditorStore((state) => state.fillColor);

  const { addShapeObject } = useEditorController();

  const addTextboxShapeObject = () => {
    addShapeObject(createTextShapeObject('Textbox', { fill: fillColor }));
  };

  const addHeadingShapeObject = () => {
    addShapeObject(createTextShapeObject('Heading', { fill: fillColor, fontSize: 80, fontWeight: 700 }));
  };

  const addSubheadingShapeObject = () => {
    addShapeObject(createTextShapeObject('Subheading', { fill: fillColor, fontSize: 44, fontWeight: 600 }));
  };

  const addParagraphShapeObject = () => {
    addShapeObject(createTextShapeObject('Paragraph', { fill: fillColor, fontSize: 32 }));
  };

  return (
    <Drawer
      open={activeTool === 'text'}
      title="Text"
      description="Add text to your canvas"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-4">
          <Button className="w-full" onClick={addTextboxShapeObject}>
            Add a textbox
          </Button>

          <Button className="w-full h-16" variant="secondary" size="lg" onClick={addHeadingShapeObject}>
            <span className="text-3xl font-bold">Add a heading</span>
          </Button>

          <Button className="w-full h-16" variant="secondary" size="lg" onClick={addSubheadingShapeObject}>
            <span className="text-xl font-semibold">Add a subheading</span>
          </Button>

          <Button className="w-full h-16" variant="secondary" size="lg" onClick={addParagraphShapeObject}>
            Paragraph
          </Button>
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default TextSidebar;

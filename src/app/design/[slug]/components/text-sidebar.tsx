'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';
import { createText } from '../helpers/graphics';

const TextSidebar: React.FC = () => {
  const { activeTool, fillColor, setActiveTool } = useEditorStore((state) => state);
  const { stage } = useEditorController();

  const addTextToStage = (text: fabric.Object) => {
    if (!stage) return;

    const workspace = stage.getObjects().find((object) => object.name === 'workspace');
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    stage._centerObject(text, center);
    stage.setActiveObject(text);
    stage.add(text);
  };

  const addTextbox = () => {
    addTextToStage(createText('Textbox', { fill: fillColor }));
  };

  const addHeading = () => {
    addTextToStage(createText('Heading', { fill: fillColor, fontSize: 80, fontWeight: 700 }));
  };

  const addSubheading = () => {
    addTextToStage(createText('Subheading', { fill: fillColor, fontSize: 44, fontWeight: 600 }));
  };

  const addParagraph = () => {
    addTextToStage(createText('Paragraph', { fill: fillColor, fontSize: 32 }));
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

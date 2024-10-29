'use client';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import useDerivedState from '@/hooks/use-derived-state';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const fonts = [
  'Arial',
  'Arial Black',
  'Verdana',
  'Helvetica',
  'Tahoma',
  'Trebuchet MS',
  'Times New Roman',
  'Georgia',
  'Garamond',
  'Courier New',
  'Brush Script MT',
  'Palatino',
  'Bookman',
  'Comic Sans MS',
  'Impact',
  'Lucida Sans Unicode',
  'Geneva',
  'Lucida Console',
];

const FontSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage, selectedObjects } = useEditorController();

  // @ts-ignore
  const [fontFamily, setFontFamily] = useDerivedState(() => selectedObjects[0]?.get('fontFamily'), [selectedObjects]);

  const changeFontFamily = (font: typeof fontFamily) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          object.set({ fontFamily: font });
        }
      });
      stage.renderAll();
    }
    setFontFamily(font);
  };

  return (
    <Drawer
      visible={activeTool === 'font'}
      title="Font"
      description="Change the text font"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-4">
          {fonts.map((font) => (
            <Button
              key={font}
              className={cn(
                'justify-start border-2 border-transparent p-4  w-full h-16 text-base',
                fontFamily === font && 'border-blue-500'
              )}
              variant="secondary"
              size="lg"
              style={{ fontFamily: font }}
              onClick={() => changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default FontSidebar;

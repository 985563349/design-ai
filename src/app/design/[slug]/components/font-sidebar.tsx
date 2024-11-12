'use client';

import { useState } from 'react';

import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';
import useOnSelectionChange from '../hooks/use-on-selection-change';
import { isTextObject } from '../lib/helpers';

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
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const fontFamily = useEditorStore((state) => state.fontFamily);
  const setFontFamily = useEditorStore((state) => state.setFontFamily);

  const { stage } = useEditorController();
  const { save } = useEditorHistory();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  // @ts-ignore
  const effectiveFontFamily = selectedObject?.get('fontFamily') ?? fontFamily;

  const changeFontFamily = (font: typeof fontFamily) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (isTextObject(object)) {
          // @ts-ignore
          object.set({ fontFamily: font });
        }
      });
      stage.renderAll();
      save();
    }
    setFontFamily(font);
  };

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  return (
    <Drawer
      open={activeTool === 'font'}
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
                effectiveFontFamily === font && 'border-blue-500'
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

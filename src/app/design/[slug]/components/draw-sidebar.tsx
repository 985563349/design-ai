'use client';

import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import useConditionReaction from '@/hooks/use-condition-reaction';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';

const DrawSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage } = useEditorController();

  const [brushWidth, setBrushWidth] = useState(2);
  const [brushColor, setBrushColor] = useState('rgba(0, 0, 0, 1)');

  const changeBrushWidth = (width: typeof brushWidth) => {
    if (!stage) return;

    stage.freeDrawingBrush.width = width;
    stage.renderAll();
    setBrushWidth(width);
  };

  const changeBrushColor = (color: typeof brushColor) => {
    if (!stage) return;

    stage.freeDrawingBrush.color = color;
    stage.renderAll();
    setBrushColor(color);
  };

  const enabledDrawingMode = () => {
    if (!stage) return;

    stage.isDrawingMode = true;
    stage.freeDrawingBrush.width = brushWidth;
    stage.freeDrawingBrush.color = brushColor;
    stage.discardActiveObject();
    stage.renderAll();
  };

  const disabledDrawingMode = () => {
    if (!stage) return;

    stage.isDrawingMode = false;
  };

  useConditionReaction(enabledDrawingMode, disabledDrawingMode, activeTool === 'draw');

  return (
    <Drawer
      visible={activeTool === 'draw'}
      title="Drawing mode"
      description="Modify brush settings"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-8">
          <div className="space-y-4">
            <Label>Brush width</Label>
            <Slider value={[brushWidth]} onValueChange={(value) => changeBrushWidth(value[0])} />
          </div>

          <ColorPicker value={brushColor} onChange={changeBrushColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default DrawSidebar;

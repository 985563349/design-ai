'use client';

import { useMemo } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ColorPicker from '@/components/color-picker';
import useConditionReaction from '@/hooks/use-condition-reaction';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const DrawSidebar: React.FC = () => {
  const { activeTool, strokeColor, strokeWidth, setActiveTool, setStrokeColor, setStrokeWidth } = useEditorStore(
    (state) => state
  );
  const { stage, selectedObjects } = useEditorController();

  const effectiveStrokeWidth = useMemo(
    () => selectedObjects[0]?.get('strokeWidth') ?? strokeWidth,
    [selectedObjects, strokeWidth]
  );

  const effectiveStrokeColor = useMemo(
    () => (selectedObjects[0]?.get('stroke') ?? strokeColor) as string,
    [selectedObjects, strokeColor]
  );

  const changeStrokeWidth = (width: typeof strokeWidth) => {
    if (stage) {
      stage.freeDrawingBrush.width = width;
      stage.renderAll();
    }

    setStrokeWidth(width);
  };

  const changeStrokeColor = (color: typeof strokeColor) => {
    if (stage) {
      stage.freeDrawingBrush.color = color;
      stage.renderAll();
    }

    setStrokeColor(color);
  };

  const enabledDrawingMode = () => {
    if (stage) {
      stage.discardActiveObject();
      stage.isDrawingMode = true;
      stage.freeDrawingBrush.color = strokeColor;
      stage.freeDrawingBrush.width = strokeWidth;
      stage.renderAll();
    }
  };

  const disabledDrawingMode = () => {
    if (stage) {
      stage.isDrawingMode = false;
    }
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
            <Slider value={[effectiveStrokeWidth]} onValueChange={(value) => changeStrokeWidth(value[0])} />
          </div>

          <ColorPicker value={effectiveStrokeColor} onChange={changeStrokeColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default DrawSidebar;

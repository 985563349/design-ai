'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import useConditionReaction from '@/hooks/use-condition-reaction';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const DrawSidebar: React.FC = () => {
  const { activeTool, strokeColor, strokeWidth, setActiveTool, setStrokeColor, setStrokeWidth } = useEditorStore(
    (state) => state
  );
  const { stage, selectedObjects } = useEditorController();

  const effectiveStrokeWidth = selectedObjects[0]?.get('strokeWidth') ?? strokeWidth;
  const effectiveStrokeColor = selectedObjects[0]?.get('stroke') ?? strokeColor;

  const changeStrokeWidth = (width: typeof strokeWidth) => {
    if (!stage) return;

    stage.freeDrawingBrush.width = width;
    stage.renderAll();
    setStrokeWidth(width);
  };

  const changeStrokeColor = (color: typeof strokeColor) => {
    if (!stage) return;

    stage.freeDrawingBrush.color = color;
    stage.renderAll();
    setStrokeColor(color);
  };

  const enabledDrawingMode = () => {
    if (!stage) return;

    stage.isDrawingMode = true;
    stage.freeDrawingBrush.color = strokeColor;
    stage.freeDrawingBrush.width = strokeWidth;
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
            <Slider value={[effectiveStrokeWidth]} onValueChange={(value) => changeStrokeWidth(value[0])} />
          </div>

          <ColorPicker value={effectiveStrokeColor} onChange={changeStrokeColor} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default DrawSidebar;

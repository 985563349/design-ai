'use client';

import { useMemo } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { BsBorderWidth } from 'react-icons/bs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const Toolbar: React.FC = () => {
  const { activeTool, fillColor, strokeColor, setActiveTool } = useEditorStore((state) => state);
  const { stage, selectedObjects } = useEditorController();

  const effectiveFillColor = useMemo(
    () => (selectedObjects[0]?.get('fill') ?? fillColor) as string,
    [selectedObjects, fillColor]
  );

  const effectiveStrokeColor = useMemo(
    () => (selectedObjects[0]?.get('stroke') ?? strokeColor) as string,
    [selectedObjects, strokeColor]
  );

  const bringForward = () => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        stage.bringForward(object);
      });

      const workspace = stage.getObjects().find((object) => object.name === 'workspace');
      workspace?.sendToBack();

      stage.renderAll();
    }
  };

  const sendBackwards = () => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        stage.sendBackwards(object);
      });

      const workspace = stage.getObjects().find((object) => object.name === 'workspace');
      workspace?.sendToBack();

      stage.renderAll();
    }
  };

  return (
    <div className="flex items-center gap-2 border-b px-4 h-14 bg-white">
      <div className={cn(!selectedObjects.length && 'hidden')}>
        <Hint label="Color" side="bottom" sideOffset={5}>
          <Button
            className={cn(activeTool === 'fill' && 'bg-gray-100')}
            variant="ghost"
            size="icon"
            onClick={() => setActiveTool('fill')}
          >
            <div className="border rounded-sm size-4" style={{ backgroundColor: effectiveFillColor }}></div>
          </Button>
        </Hint>

        <Hint label="Stroke color" side="bottom" sideOffset={5}>
          <Button
            className={cn(activeTool === 'stroke-color' && 'bg-gray-100')}
            variant="ghost"
            size="icon"
            onClick={() => setActiveTool('stroke-color')}
          >
            <div className="border rounded-sm size-4 bg-white" style={{ borderColor: effectiveStrokeColor }}></div>
          </Button>
        </Hint>

        <Hint label="Stroke width" side="bottom" sideOffset={5}>
          <Button
            className={cn(activeTool === 'stroke-width' && 'bg-gray-100')}
            variant="ghost"
            size="icon"
            onClick={() => setActiveTool('stroke-width')}
          >
            <BsBorderWidth />
          </Button>
        </Hint>

        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={() => bringForward()}>
            <ArrowUp />
          </Button>
        </Hint>

        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={() => sendBackwards()}>
            <ArrowDown />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default Toolbar;

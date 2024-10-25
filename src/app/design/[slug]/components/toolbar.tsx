'use client';

import { useMemo } from 'react';
import { BsBorderWidth } from 'react-icons/bs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const Toolbar: React.FC = () => {
  const { activeTool, fillColor, strokeColor, setActiveTool } = useEditorStore((state) => state);
  const { selectedObjects } = useEditorController();

  const effectiveFillColor = useMemo(
    () => (selectedObjects[0]?.get('fill') ?? fillColor) as string,
    [selectedObjects, fillColor]
  );

  const effectiveStrokeColor = useMemo(
    () => (selectedObjects[0]?.get('stroke') ?? strokeColor) as string,
    [selectedObjects, strokeColor]
  );

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
      </div>
    </div>
  );
};

export default Toolbar;

'use client';

import { useEffect } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, Copy, Trash } from 'lucide-react';
import { BsBorderWidth } from 'react-icons/bs';
import { RxTransparencyGrid } from 'react-icons/rx';
import { TbColorFilter } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const selectionDependentTools = ['fill', 'stroke-color', 'font', 'stroke-width', 'opacity'];

const Toolbar: React.FC = () => {
  const { activeTool, fillColor, strokeColor, fontFamily, setActiveTool } = useEditorStore((state) => state);
  const { stage, selectedObjects, copy, paste, bringForward, sendBackwards, remove } = useEditorController();

  const selectedObject = selectedObjects[0];
  const isSelectedText = selectedObject?.type === 'text';
  const isSelectedImage = selectedObject?.type === 'image';

  const effectiveFillColor = selectedObject?.get('fill') ?? fillColor;
  const effectiveStrokeColor = selectedObject?.get('stroke') ?? strokeColor;
  // @ts-ignore
  const effectiveFontFamily = selectedObject?.get('fontFamily') ?? fontFamily;

  const duplicate = () => {
    copy();
    paste();
  };

  useEffect(() => {
    if (!stage) return;

    const onSelectionCleared = () => {
      if (selectionDependentTools.includes(activeTool)) {
        setActiveTool('select');
      }
    };

    stage.on('selection:cleared', onSelectionCleared);

    return () => {
      stage.off('selection:cleared', onSelectionCleared);
    };
  }, [stage, activeTool, setActiveTool]);

  return (
    <div className="border-b h-14 bg-white">
      <div className={cn('flex items-center gap-2 px-4 h-full', !selectedObjects.length && 'hidden')}>
        {!isSelectedImage && (
          <Hint label="Color" side="bottom" sideOffset={5}>
            <Button
              className={cn(activeTool === 'fill' && 'bg-gray-100')}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTool('fill')}
            >
              <div className="border rounded-sm size-4" style={{ backgroundColor: effectiveFillColor as string }}></div>
            </Button>
          </Hint>
        )}

        {!isSelectedText && (
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
        )}

        {!isSelectedText && (
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
        )}

        {isSelectedText && (
          <Hint label="Font" side="bottom" sideOffset={5}>
            <Button
              className={cn('px-2 w-auto text-sm', activeTool === 'font' && 'bg-gray-100')}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTool('font')}
            >
              <span className="truncate">{effectiveFontFamily}</span>
              <ChevronDown />
            </Button>
          </Hint>
        )}

        {isSelectedImage && (
          <Hint label="Filters" side="bottom" sideOffset={5}>
            <Button
              className={cn(activeTool === 'filter' && 'bg-gray-100')}
              variant="ghost"
              size="icon"
              onClick={() => setActiveTool('filter')}
            >
              <TbColorFilter />
            </Button>
          </Hint>
        )}

        <Hint label="Bring forward" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={bringForward}>
            <ArrowUp />
          </Button>
        </Hint>

        <Hint label="Send backwards" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={sendBackwards}>
            <ArrowDown />
          </Button>
        </Hint>

        <Hint label="Opacity" side="bottom" sideOffset={5}>
          <Button
            className={cn(activeTool === 'opacity' && 'bg-gray-100')}
            variant="ghost"
            size="icon"
            onClick={() => setActiveTool('opacity')}
          >
            <RxTransparencyGrid />
          </Button>
        </Hint>

        <Hint label="Duplicate" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={duplicate}>
            <Copy />
          </Button>
        </Hint>

        <Hint label="Delete" side="bottom" sideOffset={5}>
          <Button variant="ghost" size="icon" onClick={remove}>
            <Trash />
          </Button>
        </Hint>
      </div>
    </div>
  );
};

export default Toolbar;

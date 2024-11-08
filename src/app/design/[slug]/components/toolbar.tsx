'use client';

import { useEffect, useState } from 'react';
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  ArrowDown,
  ArrowUp,
  Bold,
  ChevronDown,
  Copy,
  Italic,
  SquareSplitHorizontal,
  Strikethrough,
  Trash,
  Underline,
} from 'lucide-react';
import { BsBorderWidth } from 'react-icons/bs';
import { RxTransparencyGrid } from 'react-icons/rx';
import { TbColorFilter } from 'react-icons/tb';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
import InputNumber from '@/components/input-number';
import useDerivedState from '@/hooks/use-derived-state';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import useOnSelectionChange from '../hooks/use-on-selection-change';

const Toolbar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const fillColor = useEditorStore((state) => state.fillColor);
  const strokeColor = useEditorStore((state) => state.strokeColor);
  const fontFamily = useEditorStore((state) => state.fontFamily);

  const { stage, copy, paste, bringForward, sendBackwards, remove } = useEditorController();

  const [selectedObject, setSelectedObject] = useState<fabric.Object>();
  const isSelectedText = selectedObject?.type === 'text';
  const isSelectedImage = selectedObject?.type === 'image';

  const effectiveFillColor = selectedObject?.get('fill') ?? fillColor;
  const effectiveStrokeColor = selectedObject?.get('stroke') ?? strokeColor;
  // @ts-ignore
  const effectiveFontFamily = selectedObject?.get('fontFamily') ?? fontFamily;

  const [textAttributes, setTextAttributes] = useDerivedState(() => {
    const textObject = selectedObject as fabric.Text;

    return {
      fontWeight: textObject?.get('fontWeight') ?? 400,
      fontStyle: textObject?.get('fontStyle'),
      underline: textObject?.get('underline'),
      linethrough: textObject?.get('linethrough'),
      textAlign: textObject?.get('textAlign'),
      fontSize: textObject?.get('fontSize') ?? 0,
    };
  }, [selectedObject]);

  const changeTextAttributes = (attributes: Partial<typeof textAttributes>) => {
    if (!stage) return;

    stage.getActiveObjects().forEach((object) => {
      if (object.type === 'text') {
        // @ts-ignore
        object.set(attributes);
      }
    });
    stage.renderAll();

    setTextAttributes((s) => ({ ...s, ...attributes }));
  };

  const toggleBold = () => {
    changeTextAttributes({
      fontWeight: textAttributes.fontWeight === 'normal' || +textAttributes.fontWeight <= 400 ? 700 : 400,
    });
  };

  const toggleItalic = () => {
    changeTextAttributes({ fontStyle: textAttributes.fontStyle === 'italic' ? 'normal' : 'italic' });
  };

  const toggleUnderline = () => {
    changeTextAttributes({ underline: !textAttributes.underline });
  };

  const toggleStrikethrough = () => {
    changeTextAttributes({ linethrough: !textAttributes.linethrough });
  };

  const changeTextAlign = (align: string) => {
    changeTextAttributes({ textAlign: align });
  };

  const changeFontSize = (size: number) => {
    changeTextAttributes({ fontSize: size });
  };

  const duplicate = () => {
    copy();
    paste();
  };

  useOnSelectionChange((objects) => setSelectedObject(objects[0]));

  useEffect(() => {
    if (!stage) return;

    const selectionDependentTools = ['fill', 'stroke-color', 'font', 'stroke-width', 'opacity'];

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
      <div className={cn('flex items-center gap-2 px-4 h-full', !selectedObject && 'hidden')}>
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
          <>
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

            <Hint label="Bold" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', Number(textAttributes.fontWeight) >= 700 && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleBold}
              >
                <Bold />
              </Button>
            </Hint>

            <Hint label="Italic" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAttributes.fontStyle === 'italic' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleItalic}
              >
                <Italic />
              </Button>
            </Hint>

            <Hint label="Underline" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAttributes.underline && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleUnderline}
              >
                <Underline />
              </Button>
            </Hint>

            <Hint label="Strike" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAttributes.linethrough && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleStrikethrough}
              >
                <Strikethrough />
              </Button>
            </Hint>

            <Hint label="Align Left" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAttributes.textAlign === 'left' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => changeTextAlign('left')}
              >
                <AlignLeft />
              </Button>
            </Hint>

            <Hint label="Align Center" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAttributes.textAlign === 'center' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => changeTextAlign('center')}
              >
                <AlignCenter />
              </Button>
            </Hint>

            <Hint label="Align Right" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAttributes.textAlign === 'right' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => changeTextAlign('right')}
              >
                <AlignRight />
              </Button>
            </Hint>

            <InputNumber value={textAttributes.fontSize} onChange={changeFontSize} />
          </>
        )}

        {isSelectedImage && (
          <>
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

            <Hint label="Remove background" side="bottom" sideOffset={5}>
              <Button
                className={cn(activeTool === 'remove-background' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => setActiveTool('remove-background')}
              >
                <SquareSplitHorizontal />
              </Button>
            </Hint>
          </>
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

'use client';

import { useEffect } from 'react';
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
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const selectionDependentTools = ['fill', 'stroke-color', 'font', 'stroke-width', 'opacity'];

const Toolbar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage, selectedObjects, copy, paste, bringForward, sendBackwards, remove } = useEditorController();

  const selectedObject = selectedObjects[0];
  const isSelectedText = selectedObject?.type === 'text';
  const isSelectedImage = selectedObject?.type === 'image';

  const effectiveFillColor = selectedObject?.get('fill');
  const effectiveStrokeColor = selectedObject?.get('stroke');

  // @ts-ignore
  const effectiveFontFamily = selectedObject?.get('fontFamily');
  // @ts-ignore
  const [fontWeight, setFontWeight] = useDerivedState(() => selectedObject?.get('fontWeight'), [selectedObject]);
  // @ts-ignore
  const [fontStyle, setFontStyle] = useDerivedState(() => selectedObject?.get('fontStyle'), [selectedObject]);
  // @ts-ignore
  const [underline, setUnderline] = useDerivedState(() => selectedObject?.get('underline'), [selectedObject]);
  // @ts-ignore
  const [strikethrough, setStrikethrough] = useDerivedState(() => selectedObject?.get('linethrough'), [selectedObject]);
  // @ts-ignore
  const [textAlign, setTextAlign] = useDerivedState(() => selectedObject?.get('textAlign'), [selectedObject]);
  // @ts-ignore
  const [fontSize, setFontSize] = useDerivedState(() => selectedObject?.get('fontSize') ?? 0, [selectedObject]);

  const toggleBold = () => {
    const newFontWeight = fontWeight === 'normal' || fontWeight <= 400 ? 700 : 400;

    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          // Faulty TS library, fontWeight exists.
          object.set({ fontWeight: newFontWeight });
        }
      });
      stage.renderAll();
    }

    setFontWeight(newFontWeight);
  };

  const toggleItalic = () => {
    const newFontStyle = fontStyle === 'italic' ? 'normal' : 'italic';

    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          // Faulty TS library, fontStyle exists.
          object.set({ fontStyle: newFontStyle });
        }
      });
      stage.renderAll();
    }

    setFontStyle(newFontStyle);
  };

  const toggleUnderline = () => {
    const newUnderline = !underline;

    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          // Faulty TS library, underline exists.
          object.set({ underline: newUnderline });
        }
      });
      stage.renderAll();
    }

    setUnderline(newUnderline);
  };

  const toggleStrikethrough = () => {
    const newStrikethrough = !strikethrough;

    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          // Faulty TS library, linethrough exists.
          object.set({ linethrough: newStrikethrough });
        }
      });
      stage.renderAll();
    }

    setStrikethrough(newStrikethrough);
  };

  const changeTextAlign = (align: string) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          // Faulty TS library, textAlign exists.
          object.set({ textAlign: align });
        }
      });
      stage.renderAll();
    }

    setTextAlign(align);
  };

  const changeFontSize = (size: number) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'text') {
          // @ts-ignore
          // Faulty TS library, fontSize exists.
          object.set({ fontSize: size });
        }
      });
      stage.renderAll();
    }

    setFontSize(size);
  };

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
                className={cn('px-2 w-auto text-sm', fontWeight >= 700 && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleBold}
              >
                <Bold />
              </Button>
            </Hint>

            <Hint label="Italic" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', fontStyle === 'italic' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleItalic}
              >
                <Italic />
              </Button>
            </Hint>

            <Hint label="Underline" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', underline && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleUnderline}
              >
                <Underline />
              </Button>
            </Hint>

            <Hint label="Strike" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', strikethrough && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={toggleStrikethrough}
              >
                <Strikethrough />
              </Button>
            </Hint>

            <Hint label="Align Left" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAlign === 'left' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => changeTextAlign('left')}
              >
                <AlignLeft />
              </Button>
            </Hint>

            <Hint label="Align Center" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAlign === 'center' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => changeTextAlign('center')}
              >
                <AlignCenter />
              </Button>
            </Hint>

            <Hint label="Align Right" side="bottom" sideOffset={5}>
              <Button
                className={cn('px-2 w-auto text-sm', textAlign === 'right' && 'bg-gray-100')}
                variant="ghost"
                size="icon"
                onClick={() => changeTextAlign('right')}
              >
                <AlignRight />
              </Button>
            </Hint>

            <InputNumber value={fontSize} onChange={changeFontSize} />
          </>
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

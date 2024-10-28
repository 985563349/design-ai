'use client';

import { fabric } from 'fabric';
import type { LucideIcon } from 'lucide-react';
import { RiCircleFill, RiSquareFill, RiTriangleFill } from 'react-icons/ri';
import type { IconType } from 'react-icons';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';
import { createCircle, createRectangle, createTriangle } from '../helpers/graphics';

const ShapeTool: React.FC<{
  icon: LucideIcon | IconType;
  onClick?: () => void;
}> = ({ icon: Icon, onClick }) => {
  return (
    <button className="border rounded-md p-5 aspect-square" onClick={onClick}>
      <Icon className="size-full" />
    </button>
  );
};

const ShapeSidebar: React.FC = () => {
  const { activeTool, fillColor, strokeColor, strokeWidth, strokeDashArray, setActiveTool } = useEditorStore((state) => state);
  const { stage } = useEditorController();

  const addShapeToStage = (shape: fabric.Object) => {
    if (!stage) return;

    const workspace = stage.getObjects().find((object) => object.name === 'workspace');
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    stage._centerObject(shape, center);
    stage.setActiveObject(shape);
    stage.add(shape);
  };

  const addCircle = () => {
    addShapeToStage(createCircle({ fill: fillColor, stroke: strokeColor, strokeWidth, strokeDashArray }));
  };

  const addRectangle = () => {
    addShapeToStage(createRectangle({ fill: fillColor, stroke: strokeColor, strokeWidth, strokeDashArray }));
  };

  const addTriangle = () => {
    addShapeToStage(createTriangle({ fill: fillColor, stroke: strokeColor, strokeWidth, strokeDashArray }));
  };

  return (
    <Drawer
      visible={activeTool === 'shapes'}
      title="Shapes"
      description="Add shapes to your canvas"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool icon={RiCircleFill} onClick={addCircle} />

          <ShapeTool icon={RiSquareFill} onClick={addRectangle} />

          <ShapeTool icon={RiTriangleFill} onClick={addTriangle} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default ShapeSidebar;

'use client';

import type { LucideIcon } from 'lucide-react';
import { RiCircleFill, RiSquareFill, RiTriangleFill } from 'react-icons/ri';
import type { IconType } from 'react-icons';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { createCircleShapeObject, createRectangleShapeObject, createTriangleShapeObject } from '../lib/helpers';

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
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);
  const fillColor = useEditorStore((state) => state.fillColor);
  const strokeColor = useEditorStore((state) => state.strokeColor);
  const strokeWidth = useEditorStore((state) => state.strokeWidth);
  const strokeDashArray = useEditorStore((state) => state.strokeDashArray);

  const { addShapeObject } = useEditorController();

  const addCircleShapeObject = () => {
    addShapeObject(createCircleShapeObject({ fill: fillColor, stroke: strokeColor, strokeWidth, strokeDashArray }));
  };

  const addRectangleShapeObject = () => {
    addShapeObject(createRectangleShapeObject({ fill: fillColor, stroke: strokeColor, strokeWidth, strokeDashArray }));
  };

  const addTriangleShapeObject = () => {
    addShapeObject(createTriangleShapeObject({ fill: fillColor, stroke: strokeColor, strokeWidth, strokeDashArray }));
  };

  return (
    <Drawer
      open={activeTool === 'shapes'}
      title="Shapes"
      description="Add shapes to your canvas"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool icon={RiCircleFill} onClick={addCircleShapeObject} />

          <ShapeTool icon={RiSquareFill} onClick={addRectangleShapeObject} />

          <ShapeTool icon={RiTriangleFill} onClick={addTriangleShapeObject} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default ShapeSidebar;

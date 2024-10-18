'use client';

import { fabric } from 'fabric';
import type { LucideIcon } from 'lucide-react';
import { RiCircleFill, RiSquareFill, RiTriangleFill } from 'react-icons/ri';
import type { IconType } from 'react-icons';

import { ScrollArea } from '@/components/ui/scroll-area';
import ToolSidebar from './tool-sidebar';

import { useEditor } from '../providers/editor';

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

const ShapeToolSidebar: React.FC = () => {
  const { stageRef, activeTool, setActiveTool } = useEditor();

  const createShape = (type: 'circle' | 'square' | 'triangle') => {
    const stage = stageRef.current;

    if (!stage) {
      return;
    }

    let shape: fabric.Object;

    switch (type) {
      case 'circle':
        shape = new fabric.Circle({ radius: 100, fill: '#000000', stroke: '#000000' });
        break;

      case 'square':
        shape = new fabric.Rect({ width: 200, height: 200, fill: '#000000', stroke: '#000000', rx: 50, ry: 50 });
        break;

      case 'triangle':
        shape = new fabric.Triangle({ width: 200, height: 200, fill: '#000000', stroke: '#000000' });
        break;
    }

    const workspace = stage.getObjects().find((obj) => obj.name === 'workspace');
    const center = workspace?.getCenterPoint();

    if (center) {
      // @ts-ignore
      stage._centerObject(shape, center);
    }

    stage.setActiveObject(shape);
    stage.add(shape);
  };

  const onClose = () => {
    setActiveTool('select');
  };

  return (
    <ToolSidebar
      visible={activeTool === 'shapes'}
      title="Shapes"
      description="Add shapes to your canvas"
      onClose={onClose}
    >
      <ScrollArea className="w-80">
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool icon={RiCircleFill} onClick={() => createShape('circle')} />

          <ShapeTool icon={RiSquareFill} onClick={() => createShape('square')} />

          <ShapeTool icon={RiTriangleFill} onClick={() => createShape('triangle')} />
        </div>
      </ScrollArea>
    </ToolSidebar>
  );
};

export default ShapeToolSidebar;

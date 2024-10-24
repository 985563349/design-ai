'use client';

import type { LucideIcon } from 'lucide-react';
import { RiCircleFill, RiSquareFill, RiTriangleFill } from 'react-icons/ri';
import type { IconType } from 'react-icons';

import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';

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
  const { activeTool, setActiveTool } = useEditorStore((state) => state);

  const onClose = () => {
    setActiveTool('select');
  };

  return (
    <Drawer visible={activeTool === 'shapes'} title="Shapes" description="Add shapes to your canvas" onClose={onClose}>
      <ScrollArea className="w-80">
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool icon={RiCircleFill} />

          <ShapeTool icon={RiSquareFill} />

          <ShapeTool icon={RiTriangleFill} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default ShapeToolSidebar;

'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';
import { createFilter } from '../helpers/graphics';

const filters = [
  'none',
  'grayscale',
  'polaroid',
  'sepia',
  'kodachrome',
  'contrast',
  'brightness',
  'brownie',
  'vintage',
  'technicolor',
  'pixelate',
  'invert',
  'blur',
  'sharpen',
  'emboss',
  'removecolor',
  'blacknwhite',
  'vibrance',
  'blendcolor',
  'huerotate',
  'resize',
  'gamma',
  'saturation',
];

const FilterSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage } = useEditorController();

  const changeFilter = (filter: string) => {
    if (stage) {
      stage.getActiveObjects().forEach((object) => {
        if (object.type === 'image') {
          const imageObject = object as fabric.Image;
          const effect = createFilter(filter);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
        }
      });
      stage.renderAll();
    }
  };

  return (
    <Drawer
      visible={activeTool === 'filter'}
      title="Filters"
      description="Apply a filter to selected image"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-4">
          {filters.map((filter) => (
            <Button
              key={filter}
              className="justify-start border-2 border-transparent p-4  w-full h-16 text-base"
              variant="secondary"
              size="lg"
              onClick={() => changeFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default FilterSidebar;

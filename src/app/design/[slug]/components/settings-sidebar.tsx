'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ColorPicker from '@/components/color-picker';
import Drawer from '@/components/drawer';
import useDerivedState from '@/hooks/use-derived-state';
import { useEditorStore } from '../providers/editor-store-provider';
import { useEditorController } from '../providers/editor-controller-provider';

const SettingsSidebar: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage } = useEditorController();

  const workspace = stage?.getObjects().find((object) => object.name === 'workspace');

  const [width, setWidth] = useDerivedState(() => workspace?.width ?? 0, [workspace]);
  const [height, setHeight] = useDerivedState(() => workspace?.height ?? 0, [workspace]);
  const [background, setBackground] = useDerivedState(() => (workspace?.fill ?? '#ffffff') as string, [workspace]);

  const changeBackground = (background: string) => {
    if (stage && workspace) {
      workspace.set({ fill: background });
      stage.renderAll();
    }
    setBackground(background);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (stage && workspace) {
      workspace?.set({ width, height });
      stage.fire('resize');
    }
  };

  return (
    <Drawer
      visible={activeTool === 'settings'}
      title="Settings"
      description="Change the look of your workspace"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <div className="p-4 space-y-8">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label>Width</Label>
              <Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} placeholder="Width" />
            </div>

            <div className="space-y-2">
              <Label>Height</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} placeholder="Height" />
            </div>

            <Button className="w-full" type="submit">
              Resize
            </Button>
          </form>

          <ColorPicker value={background} onChange={changeBackground} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default SettingsSidebar;

'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Drawer from '@/components/drawer';
import ColorPicker from '@/components/color-picker';
import useDerivedState from '@/hooks/use-derived-state';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';

const SettingsSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { getWorkspace, setWorkspaceBackground, setWorkspaceSize } = useEditorController();
  const { save } = useEditorHistory();

  const workspace = getWorkspace();

  const [width, setWidth] = useDerivedState(() => workspace?.width ?? 0, [workspace]);
  const [height, setHeight] = useDerivedState(() => workspace?.height ?? 0, [workspace]);
  const [background, setBackground] = useDerivedState(() => (workspace?.fill ?? '#ffffff') as string, [workspace]);

  const onColorChange = (color: string) => {
    setWorkspaceBackground(color);
    setBackground(color);
  };

  const onChangeComplete = () => {
    save();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setWorkspaceSize({ width, height });
    save();
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
            <div className="space-y-4">
              <Label>Width</Label>
              <Input type="number" value={width} onChange={(e) => setWidth(+e.target.value)} placeholder="Width" />
            </div>

            <div className="space-y-4">
              <Label>Height</Label>
              <Input type="number" value={height} onChange={(e) => setHeight(+e.target.value)} placeholder="Height" />
            </div>

            <Button className="w-full" type="submit">
              Resize
            </Button>
          </form>

          <ColorPicker value={background} onChange={onColorChange} onChangeComplete={onChangeComplete} />
        </div>
      </ScrollArea>
    </Drawer>
  );
};

export default SettingsSidebar;

'use client';

import { Image as ImageIcon, LayoutTemplate, Pencil, Settings, Shapes, Sparkles, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEditorStore } from '../providers/editor-store';

const SidebarItem: React.FC<{
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <Button
      variant="ghost"
      className={cn('flex flex-col rounded-none py-4 h-auto aspect-square', active && 'bg-muted text-primary')}
      onClick={onClick}
    >
      <Icon className="!size-5" />
      <span className="text-xs">{label}</span>
    </Button>
  );
};

const Sidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const changeActiveTool = (tool: typeof activeTool) => {
    if (tool === activeTool) {
      setActiveTool('select');
    } else {
      setActiveTool(tool);
    }
  };

  return (
    <aside className="flex flex-col w-18 h-full border-r bg-white overflow-y-auto">
      <SidebarItem
        label="Design"
        icon={LayoutTemplate}
        active={activeTool === 'templates'}
        onClick={() => changeActiveTool('templates')}
      />

      <SidebarItem label="Image" icon={ImageIcon} active={activeTool === 'images'} onClick={() => changeActiveTool('images')} />

      <SidebarItem label="Text" icon={Type} active={activeTool === 'text'} onClick={() => changeActiveTool('text')} />

      <SidebarItem label="Shapes" icon={Shapes} active={activeTool === 'shapes'} onClick={() => changeActiveTool('shapes')} />

      <SidebarItem label="Draw" icon={Pencil} active={activeTool === 'draw'} onClick={() => changeActiveTool('draw')} />

      <SidebarItem label="AI" icon={Sparkles} active={activeTool === 'ai'} onClick={() => changeActiveTool('ai')} />

      <SidebarItem
        label="Settings"
        icon={Settings}
        active={activeTool === 'settings'}
        onClick={() => changeActiveTool('settings')}
      />
    </aside>
  );
};

export default Sidebar;

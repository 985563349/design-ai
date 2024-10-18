'use client';

import { Image as ImageIcon, LayoutTemplate, Settings, Shapes, Sparkles, Type } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useEditor } from '../providers/editor';

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
  const { activeTool, setActiveTool } = useEditor();

  return (
    <aside className="flex flex-col w-20 h-full border-r bg-white overflow-y-auto">
      <SidebarItem
        label="Design"
        icon={LayoutTemplate}
        active={activeTool === 'templates'}
        onClick={() => setActiveTool('templates')}
      />

      <SidebarItem
        label="Image"
        icon={ImageIcon}
        active={activeTool === 'images'}
        onClick={() => setActiveTool('images')}
      />

      <SidebarItem label="Text" icon={Type} active={activeTool === 'text'} onClick={() => setActiveTool('text')} />

      <SidebarItem
        label="Shapes"
        icon={Shapes}
        active={activeTool === 'shapes'}
        onClick={() => setActiveTool('shapes')}
      />

      <SidebarItem label="AI" icon={Sparkles} active={activeTool === 'ai'} onClick={() => setActiveTool('ai')} />

      <SidebarItem
        label="Settings"
        icon={Settings}
        active={activeTool === 'settings'}
        onClick={() => setActiveTool('settings')}
      />
    </aside>
  );
};

export default Sidebar;

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MessageCircleQuestion } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const SidebarItem: React.FC<{
  label: string;
  href: string;
  icon: LucideIcon;
  isActive?: boolean;
}> = ({ label, href, icon: Icon, isActive }) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          'flex items-center gap-x-2 rounded-xl p-3 bg-transparent hover:bg-white transition',
          isActive && 'bg-white'
        )}
      >
        <Icon className="!size-4" />
        <span className="text-sm font-medium">{label}</span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="px-3 w-60 h-full">
      <SidebarItem label="首页" icon={Home} href="/" isActive={pathname === '/'} />

      <Separator className="my-2" />

      <SidebarItem label="帮助" icon={MessageCircleQuestion} href="mailto:jie985563349@outlook.com" />
    </aside>
  );
};

export default Sidebar;

import { ChevronsLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DrawerProps {
  visible?: boolean;
  className?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onClose?: () => void;
}

const Drawer: React.FC<DrawerProps> = ({ visible, className, title, description, children, onClose }) => {
  return (
    <aside className={cn('relative z-10 flex flex-col h-full border-r bg-white', className, !visible && 'hidden')}>
      <div className="p-4 border-b space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>

      {children}

      <button
        className="absolute top-1/2 left-full transform -translate-y-1/2 group border border-l-0 rounded-r-lg px-1 pr-2 h-16 bg-white"
        onClick={onClose}
      >
        <ChevronsLeft className="size-4 text-black group-hover:opacity-70 transition" />
      </button>
    </aside>
  );
};

export default Drawer;

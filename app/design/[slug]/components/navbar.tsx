import Link from 'next/link';
import { ChevronDown, MousePointerClick, Undo2, Redo2, Download } from 'lucide-react';
import { CiFileOn } from 'react-icons/ci';
import { BsCloudCheck } from 'react-icons/bs';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import Hint from './hint';

const Navbar: React.FC = () => {
  return (
    <nav className="flex items-center border-b px-4 h-12 bg-white">
      <div className="mr-4">
        <Link href="/">Logo</Link>
      </div>

      <div className="flex items-center py-4 h-full">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              File
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="!size-8" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">Open a JSON file</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-2" />

        <Hint label="Select" sideOffset={10}>
          <Button variant="ghost" size="icon">
            <MousePointerClick />
          </Button>
        </Hint>

        <Hint label="Undo" sideOffset={10}>
          <Button variant="ghost" size="icon">
            <Undo2 />
          </Button>
        </Hint>

        <Hint label="Redo" sideOffset={10}>
          <Button variant="ghost" size="icon">
            <Redo2 />
          </Button>
        </Hint>

        <Separator orientation="vertical" className="mx-2" />

        <div className="flex items-center gap-x-2 text-muted-foreground">
          <BsCloudCheck className="size-5" />
          <p className="text-xs">Saved</p>
        </div>
      </div>

      <div className="ml-auto flex items-center">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Export
              <Download />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="!size-8" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">Save for later editing</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="!size-8" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">Best for sharing on the web</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="!size-8" />
              <div>
                <p>JPG</p>
                <p className="text-xs text-muted-foreground">Best for printing</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-x-2">
              <CiFileOn className="!size-8" />
              <div>
                <p>SVG</p>
                <p className="text-xs text-muted-foreground">Best for editing in vector software</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;

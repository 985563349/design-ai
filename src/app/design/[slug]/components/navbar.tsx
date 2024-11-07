import Link from 'next/link';
import { useMutationState } from '@tanstack/react-query';
import { useFilePicker } from 'use-file-picker';
import { ChevronDown, MousePointerClick, Undo2, Redo2, Download, Loader } from 'lucide-react';
import { BsCloudCheck, BsCloudSlash, BsFiletypeJpg, BsFiletypeJson, BsFiletypePng, BsFiletypeSvg } from 'react-icons/bs';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import Hint from '@/components/hint';
import UserDropdown from '@/components/user-dropdown';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';
import { downloadFile } from '../lib/helpers';

const Navbar: React.FC = () => {
  const id = useEditorStore((state) => state.id);
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { loadFromJSON, exportImage, exportJSON } = useEditorController();
  const { canUndo, canRedo, save, undo, redo, clear, pause, resume } = useEditorHistory();

  const mutationState = useMutationState({
    filters: {
      mutationKey: ['projects', id],
      exact: true,
    },
    select: (mutation) => mutation.state.status,
  });

  const status = mutationState.at(-1);

  const { openFilePicker } = useFilePicker({
    accept: '.json',
    onFilesSuccessfullySelected: (data: any) => {
      const { plainFiles } = data;
      const file = plainFiles?.[0];

      if (!file) return;

      const reader = new FileReader();

      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        pause();
        clear();
        loadFromJSON(reader.result as string, () => {
          resume();
          save();
        });
      };
    },
  });

  const exportFile = (type: string) => () => {
    const content = type === 'json' ? exportJSON() : exportImage();

    if (!content) return;

    downloadFile(content, type);
  };

  return (
    <nav className="flex items-center border-b px-4 h-14 bg-white">
      <div className="mr-4">
        <Link href="/">Design AI</Link>
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
            <DropdownMenuItem className="flex items-center gap-x-2" onClick={openFilePicker}>
              <BsFiletypeJson className="!size-7" />
              <div>
                <p>Open</p>
                <p className="text-xs text-muted-foreground">Open a JSON file</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="mx-2" />

        <Hint label="Select" sideOffset={10}>
          <Button
            variant="ghost"
            size="icon"
            className={cn(activeTool === 'select' && 'bg-gray-100')}
            onClick={() => setActiveTool('select')}
          >
            <MousePointerClick />
          </Button>
        </Hint>

        <Hint label="Undo" sideOffset={10}>
          <Button variant="ghost" size="icon" disabled={!canUndo} onClick={undo}>
            <Undo2 />
          </Button>
        </Hint>

        <Hint label="Redo" sideOffset={10}>
          <Button variant="ghost" size="icon" disabled={!canRedo} onClick={redo}>
            <Redo2 />
          </Button>
        </Hint>

        <Separator orientation="vertical" className="mx-2" />

        <div className="flex items-center gap-x-2 text-muted-foreground">
          {status === 'pending' && (
            <>
              <Loader className="size-5 animate-spin" />
              <p className="text-xs">Saving...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <BsCloudSlash className="size-5" />
              <p className="text-xs">Failed to save</p>
            </>
          )}

          {(status === 'success' || !status) && (
            <>
              <BsCloudCheck className="size-5" />
              <p className="text-xs">Saved</p>
            </>
          )}
        </div>
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost">
              Export
              <Download />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="min-w-60">
            <DropdownMenuItem className="flex items-center gap-x-2" onClick={exportFile('json')}>
              <BsFiletypeJson className="!size-7" />
              <div>
                <p>JSON</p>
                <p className="text-xs text-muted-foreground">Save for later editing</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-x-2" onClick={exportFile('png')}>
              <BsFiletypePng className="!size-7" />
              <div>
                <p>PNG</p>
                <p className="text-xs text-muted-foreground">Best for sharing on the web</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-x-2" onClick={exportFile('jpg')}>
              <BsFiletypeJpg className="!size-7" />
              <div>
                <p>JPG</p>
                <p className="text-xs text-muted-foreground">Best for printing</p>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-x-2" onClick={exportFile('svg')}>
              <BsFiletypeSvg className="!size-7" />
              <div>
                <p>SVG</p>
                <p className="text-xs text-muted-foreground">Best for editing in vector software</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <UserDropdown />
      </div>
    </nav>
  );
};

export default Navbar;

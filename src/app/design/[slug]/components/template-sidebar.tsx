'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Loader } from 'lucide-react';

import { client } from '@/lib/hono';
import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useDialog } from '@/providers/dialog';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';
import { useEditorHistory } from '../providers/editor-history';

const TemplateSidebar: React.FC = () => {
  const { confirm } = useDialog();

  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage, loadFromJSON } = useEditorController();
  const { clear, pause, resume, save } = useEditorHistory();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await client.api.templates.$get();

      if (!response.ok) {
        throw new Error('Failed to fetch templates');
      }

      return response.json();
    },
  });

  const addTemplate = async (template: string) => {
    try {
      if (!stage || !template) return;

      await confirm({
        title: 'Are you sure?',
        body: 'You are about to replace the current project with this template.',
        actionText: 'Confirm',
      });

      pause();
      clear();

      await loadFromJSON(template);

      resume();
      save();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Drawer
      open={activeTool === 'templates'}
      title="Templates"
      description="Choose from a variety of templates to get started"
      onClose={() => setActiveTool('select')}
    >
      <div className="flex-1 flex flex-col w-80 overflow-hidden">
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <Loader className="text-muted-foreground animate-spin" />
          </div>
        )}

        {isError && (
          <div className="flex-1 flex items-center justify-center flex-col gap-y-4">
            <AlertTriangle className="text-muted-foreground" />
            <p className="text-muted-foreground">Failed to fetch templates</p>
          </div>
        )}

        {data && (
          <ScrollArea>
            <div className="grid grid-cols-2 gap-4 p-4">
              {data.map((template) => (
                <div
                  key={template.id}
                  style={{ aspectRatio: `${template.width}/${template.height}` }}
                  className="relative border rounded-sm w-full group hover:opacity-75 transition bg-muted overflow-hidden cursor-pointer"
                  onClick={() => addTemplate(template.json)}
                >
                  <Image className="object-cover" fill src={template.thumbnailUrl!} alt={template.name ?? 'template'} />
                  <p className="absolute left-0 bottom-0 p-1 w-full text-xs text-left truncate text-white bg-black/50 opacity-0 group-hover:opacity-100 hover:underline">
                    {template.name}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </Drawer>
  );
};

export default TemplateSidebar;

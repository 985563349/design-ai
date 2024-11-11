'use client';

import { useMutation } from '@tanstack/react-query';
import { fabric } from 'fabric';
import { Loader2 } from 'lucide-react';

import { client } from '@/lib/hono';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import Drawer from '@/components/drawer';
import { useEditorStore } from '../providers/editor-store';
import { useEditorController } from '../providers/editor-controller';

const AiSidebar: React.FC = () => {
  const activeTool = useEditorStore((state) => state.activeTool);
  const setActiveTool = useEditorStore((state) => state.setActiveTool);

  const { stage, getWorkspace, add } = useEditorController();

  const addImage = (url: string) => {
    if (!stage) return;

    const callback = (image: fabric.Image) => {
      const workspace = getWorkspace();

      image.scaleToWidth(workspace?.width ?? 0);
      image.scaleToHeight(workspace?.height ?? 0);

      add(image);
    };

    fabric.Image.fromURL(url, callback, { crossOrigin: 'anonymous' });
  };

  const mutation = useMutation({
    mutationFn: async (prompt: string) => {
      const response = await client.api.ai['generate-image'].$post({ json: { prompt } });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return response.json();
    },

    onSuccess({ url }) {
      addImage(url);
    },
  });

  return (
    <Drawer
      visible={activeTool === 'ai'}
      title="AI"
      description="Generate an image using AI"
      onClose={() => setActiveTool('select')}
    >
      <ScrollArea className="w-80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(e.currentTarget.prompt.value);
          }}
          className="p-4 space-y-4"
        >
          <Textarea
            name="prompt"
            required
            cols={30}
            rows={10}
            minLength={3}
            placeholder="Please describe the image you want to generate"
          />
          <Button className="w-full" type="submit" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />}
            Generate
          </Button>
        </form>
      </ScrollArea>
    </Drawer>
  );
};

export default AiSidebar;

'use client';

import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import type { InferRequestType, InferResponseType } from 'hono';
import { debounce } from 'lodash';

import { client } from '@/lib/hono';

import Navbar from './navbar';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import Stage from './stage';
import type { StageProps } from './stage';
import Footer from './footer';
import TemplateSidebar from './template-sidebar';
import ImageSidebar from './image-sidebar';
import TextSidebar from './text-sidebar';
import ShapeSidebar from './shape-sidebar';
import DrawSidebar from './draw-sidebar';
import SettingsSidebar from './settings-sidebar';
import FillColorSidebar from './fill-color-sidebar';
import StrokeColorSidebar from './stroke-color-sidebar';
import FontSidebar from './font-sidebar';
import StrokeWidthSidebar from './stroke-width-sidebar';
import FilterSidebar from './filter-sidebar';
import OpacitySidebar from './opacity-sidebar';
import HotKeysListener from './hot-keys-listener';

import { EditorStoreProvider } from '../providers/editor-store';
import { EditorControllerProvider } from '../providers/editor-controller';
import { EditorHistoryProvider } from '../providers/editor-history';

export interface EditorProps extends Omit<StageProps, 'onInit'> {
  id: string;
}

const $patch = client.api.projects[':id'].$patch;

const Editor: React.FC<EditorProps> = ({ id, width, height, initialState }) => {
  const [stage, setStage] = useState<fabric.Canvas>();

  const { mutate } = useMutation<InferResponseType<typeof $patch, 200>, Error, InferRequestType<typeof $patch>['json']>({
    mutationKey: ['projects', id],
    mutationFn: async (data) => {
      const response = await $patch({ param: { id }, json: data });

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return response.json();
    },
  });

  useEffect(() => {
    if (!stage) return;

    // Synchronize to the cloud
    const onSaved = debounce((event: any) => mutate(event), 500);
    stage.on('saved', onSaved);

    return () => {
      stage.off('saved', onSaved);
    };
  }, [stage, mutate]);

  return (
    <EditorStoreProvider initState={{ id }}>
      <EditorControllerProvider stage={stage}>
        <EditorHistoryProvider stage={stage}>
          <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex-1 flex overflow-hidden">
              <Sidebar />
              <TemplateSidebar />
              <ImageSidebar />
              <TextSidebar />
              <ShapeSidebar />
              <DrawSidebar />
              <SettingsSidebar />
              <FillColorSidebar />
              <StrokeColorSidebar />
              <FontSidebar />
              <StrokeWidthSidebar />
              <FilterSidebar />
              <OpacitySidebar />
              <HotKeysListener />
              <main className="flex-1 flex flex-col overflow-hidden">
                <Toolbar />
                <div className="flex-1 overflow-hidden bg-slate-100">
                  <Stage width={width} height={height} initialState={initialState} onInit={setStage} />
                </div>
                <Footer />
              </main>
            </div>
          </div>
        </EditorHistoryProvider>
      </EditorControllerProvider>
    </EditorStoreProvider>
  );
};

export default Editor;

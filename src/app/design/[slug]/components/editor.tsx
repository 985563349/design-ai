'use client';

import { useState } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import Stage from './stage';
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

const Editor: React.FC = () => {
  const [stage, setStage] = useState<fabric.Canvas>();

  return (
    <EditorStoreProvider>
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
                  <Stage onInit={setStage} />
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

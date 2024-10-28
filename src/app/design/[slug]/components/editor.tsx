'use client';

import { useState } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';
import Toolbar from './toolbar';
import Stage from './stage';
import Footer from './footer';
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

import { EditorStoreProvider } from '../providers/editor-store-provider';
import { EditorControllerProvider } from '../providers/editor-controller-provider';

const Editor: React.FC = () => {
  const [stage, setStage] = useState<fabric.Canvas>();

  return (
    <EditorStoreProvider>
      <EditorControllerProvider stage={stage}>
        <div className="flex flex-col h-full">
          <Navbar />
          <div className="flex-1 flex overflow-hidden">
            <Sidebar />
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
            <main className="flex-1 flex flex-col overflow-hidden">
              <Toolbar />
              <div className="flex-1 overflow-hidden bg-slate-100">
                <Stage onInit={setStage} />
              </div>
              <Footer />
            </main>
          </div>
        </div>
      </EditorControllerProvider>
    </EditorStoreProvider>
  );
};

export default Editor;

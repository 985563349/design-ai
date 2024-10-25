'use client';

import { useState } from 'react';

import Navbar from './navbar';
import Sidebar from './sidebar';
import ShapeSidebar from './shape-sidebar';
import FillColorSidebar from './fill-color-sidebar';
import StrokeColorSidebar from './stroke-color-sidebar';
import StrokeWidthSidebar from './stroke-width-sidebar';
import OpacitySidebar from './opacity-sidebar';
import TextSidebar from './text-sidebar';
import Toolbar from './toolbar';
import Footer from './footer';
import Stage from './stage';
import EditorEventListener from './editor-event-listener';

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
            <ShapeSidebar />
            <FillColorSidebar />
            <StrokeColorSidebar />
            <StrokeWidthSidebar />
            <OpacitySidebar />
            <TextSidebar />
            <main className="flex-1 flex flex-col overflow-hidden">
              <Toolbar />
              <div className="flex-1 overflow-hidden bg-slate-100">
                <Stage onInit={setStage} />
              </div>
              <Footer />
            </main>
          </div>
        </div>
        <EditorEventListener />
      </EditorControllerProvider>
    </EditorStoreProvider>
  );
};

export default Editor;

'use client';

import Navbar from './navbar';
import Sidebar from './sidebar';
import ShapeSidebar from './shape-sidebar';
import FillColorSidebar from './fill-color-sidebar';
import StrokeColorSidebar from './stroke-color-sidebar';
import Toolbar from './toolbar';
import Footer from './footer';
import Stage from './stage';

import { EditorStoreProvider } from '../providers/editor-store-provider';
import StrokeWidthSidebar from './stroke-width-sidebar';

const Editor: React.FC = () => {
  return (
    <EditorStoreProvider>
      <div className="flex flex-col h-full">
        <Navbar />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <ShapeSidebar />
          <FillColorSidebar />
          <StrokeColorSidebar />
          <StrokeWidthSidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Toolbar />
            <div className="flex-1 overflow-hidden bg-slate-100">
              <Stage onInit={(instance) => console.log(instance)} />
            </div>
            <Footer />
          </main>
        </div>
      </div>
    </EditorStoreProvider>
  );
};

export default Editor;

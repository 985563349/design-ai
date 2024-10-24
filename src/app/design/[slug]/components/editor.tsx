'use client';

import Navbar from './navbar';
import Sidebar from './sidebar';
import ShapeToolSidebar from './shape-tool-sidebar';
import FillColorToolSidebar from './fill-color-tool-sidebar';
import Toolbar from './toolbar';
import Footer from './footer';
import Stage from './stage';

const Editor: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <ShapeToolSidebar />
        <FillColorToolSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <Toolbar />
          <div className="flex-1 overflow-hidden bg-slate-100">
            <Stage onInit={(instance) => console.log(instance)} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Editor;

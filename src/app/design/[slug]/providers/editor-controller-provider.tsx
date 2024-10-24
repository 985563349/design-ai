import { createContext, useContext, useEffect, useState } from 'react';

export type EditorControllerApi = {
  stage?: fabric.Canvas;
  selectedObjects: fabric.Object[];
};

export const EditorControllerContext = createContext<EditorControllerApi | null>(null);

export interface EditorControllerProps {
  stage?: fabric.Canvas;
  children: React.ReactNode;
}

export const EditorControllerProvider: React.FC<EditorControllerProps> = ({ stage, children }) => {
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  useEffect(() => {
    if (!stage) return;

    stage.on('selection:created', (e) => setSelectedObjects(e.selected ?? []));
    stage.on('selection:updated', (e) => setSelectedObjects(e.selected ?? []));
    stage.on('selection:cleared', () => setSelectedObjects([]));

    return () => {
      stage.off('selection:created');
      stage.off('selection:updated');
      stage.off('selection:cleared');
    };
  }, [stage]);

  return <EditorControllerContext.Provider value={{ stage, selectedObjects }}>{children}</EditorControllerContext.Provider>;
};

export function useEditorController() {
  const context = useContext(EditorControllerContext);

  if (!context) {
    throw new Error('useEditorController must be used within EditorControllerProvider');
  }

  return context;
}

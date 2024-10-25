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

    const onSelectionCreated = (e: fabric.IEvent) => setSelectedObjects(e.selected ?? []);
    const onSelectionUpdated = (e: fabric.IEvent) => setSelectedObjects(e.selected ?? []);
    const onSelectionCleared = () => setSelectedObjects([]);

    stage.on('selection:created', onSelectionCreated);
    stage.on('selection:updated', onSelectionUpdated);
    stage.on('selection:cleared', onSelectionCleared);

    return () => {
      stage.off('selection:created', onSelectionCreated);
      stage.off('selection:updated', onSelectionUpdated);
      stage.off('selection:cleared', onSelectionUpdated);
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

import { createContext, useContext, useEffect, useRef, useState } from 'react';

export type EditorControllerApi = {
  stage?: fabric.Canvas;
  selectedObjects: fabric.Object[];
  getWorkspace: () => fabric.Object | void;
  add: (object: fabric.Object) => void;
  remove: () => void;
  copy: () => void;
  paste: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
  setWorkspaceBackground: (background: string) => void;
  setWorkspaceSize: (size: Record<'width' | 'height', number>) => void;
};

export const EditorControllerContext = createContext<EditorControllerApi | null>(null);

export interface EditorControllerProps {
  stage?: fabric.Canvas;
  children: React.ReactNode;
}

export const EditorControllerProvider: React.FC<EditorControllerProps> = ({ stage, children }) => {
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const clipboard = useRef<any>(null);

  const getWorkspace = () => {
    if (!stage) return;

    return stage.getObjects().find((object) => object.name === 'workspace');
  };

  const add = (object: fabric.Object) => {
    if (!stage) return;

    const workspace = getWorkspace();
    const center = workspace?.getCenterPoint();

    if (!center) return;

    // @ts-ignore
    stage._centerObject(object, center);
    stage.setActiveObject(object);
    stage.add(object);
  };

  const remove = () => {
    if (!stage) return;

    stage.getActiveObjects().forEach((object) => stage.remove(object));
    stage.discardActiveObject();
    stage.renderAll();
  };

  const copy = () => {
    if (!stage) return;

    stage.getActiveObject()?.clone((cloned: fabric.Object) => {
      clipboard.current = cloned;
    });
  };

  const paste = () => {
    if (!stage || !clipboard.current) return;

    clipboard.current.clone((cloned: any) => {
      cloned.set({ top: cloned.top + 10, left: cloned.left + 10, evented: true });

      if (cloned.type === 'activeSelection') {
        cloned.canvas = stage;
        cloned.forEachObject((object: any) => stage.add(object));
        cloned.setCoords();
      } else {
        stage.add(cloned);
      }

      clipboard.current.top += 10;
      clipboard.current.left += 10;

      stage.setActiveObject(cloned);
      stage.requestRenderAll();
    });
  };

  const bringForward = () => {
    if (!stage) return;

    const workspace = getWorkspace();

    stage.getActiveObjects().forEach((object) => stage.bringForward(object));
    workspace?.sendToBack();
    stage.renderAll();
  };

  const sendBackwards = () => {
    if (!stage) return;

    const workspace = getWorkspace();

    stage.getActiveObjects().forEach((object) => stage.sendBackwards(object));
    workspace?.sendToBack();
    stage.renderAll();
  };

  const setWorkspaceBackground = (background: string) => {
    const workspace = getWorkspace();

    if (!stage || !workspace) return;

    workspace.set({ fill: background });
    stage.renderAll();
  };

  const setWorkspaceSize = (size: Record<'width' | 'height', number>) => {
    const workspace = getWorkspace();

    if (!stage || !workspace) return;

    workspace.set(size);
    stage.fire('resize');
  };

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

  return (
    <EditorControllerContext.Provider
      value={{
        stage,
        selectedObjects,
        getWorkspace,
        add,
        remove,
        copy,
        paste,
        bringForward,
        sendBackwards,
        setWorkspaceBackground,
        setWorkspaceSize,
      }}
    >
      {children}
    </EditorControllerContext.Provider>
  );
};

export function useEditorController() {
  const context = useContext(EditorControllerContext);

  if (!context) {
    throw new Error('useEditorController must be used within EditorControllerProvider');
  }

  return context;
}

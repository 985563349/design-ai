import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';

export type EditorControllerApi = {
  stage?: fabric.Canvas;
  selectedObjects: fabric.Object[];
  canUndo: boolean;
  canRedo: boolean;
  save: (skip?: boolean) => void;
  undo: () => void;
  redo: () => void;
  getWorkspace: () => fabric.Object | void;
  add: (object: fabric.Object) => void;
  remove: () => void;
  copy: () => void;
  paste: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  setWorkspaceBackground: (background: string) => void;
  setWorkspaceSize: (size: Record<'width' | 'height', number>) => void;
};

export const EditorControllerContext = createContext<EditorControllerApi | null>(null);

export interface EditorControllerProps {
  stage?: fabric.Canvas;
  children: React.ReactNode;
}

export const EditorControllerProvider: React.FC<EditorControllerProps> = ({ stage, children }) => {
  const history = useRef<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const skipRef = useRef(false);

  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);
  const clipboard = useRef<any>(null);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.current.length - 1;

  const save = (skip?: boolean) => {
    if (!stage) return;

    const currentState = stage.toJSON([
      'name',
      'gradientAngle',
      'selectable',
      'hasControls',
      'linkData',
      'editable',
      'extensionType',
      'extension',
    ]);
    const json = JSON.stringify(currentState);

    if (!skip && !skipRef.current) {
      setHistoryIndex(history.current.push(json) - 1);
    }
  };

  const undo = () => {
    if (!stage || !canUndo) return;

    skipRef.current = true;
    stage.clear().renderAll();

    const previousIndex = historyIndex - 1;
    const previousState = JSON.parse(history.current[previousIndex]);

    stage.loadFromJSON(previousState, () => {
      stage.renderAll();
      setHistoryIndex(previousIndex);
      skipRef.current = false;
    });
  };

  const redo = () => {
    if (!stage || !canRedo) return;

    skipRef.current = true;
    stage.clear().renderAll();

    const nextIndex = historyIndex + 1;
    const nextState = JSON.parse(history.current[nextIndex]);

    stage.loadFromJSON(nextState, () => {
      stage.renderAll();
      setHistoryIndex(nextIndex);
      skipRef.current = false;
    });
  };

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

  const zoomIn = () => {
    if (!stage) return;

    let zoom = stage.getZoom();
    zoom += 0.05;

    const center = stage.getCenter();
    stage.zoomToPoint(new fabric.Point(center.left, center.top), Math.min(zoom, 1));
  };

  const zoomOut = () => {
    if (!stage) return;

    let zoom = stage.getZoom();
    zoom -= 0.05;

    const center = stage.getCenter();
    stage.zoomToPoint(new fabric.Point(center.left, center.top), Math.max(zoom, 0.2));
  };

  const zoomReset = () => {
    if (!stage) return;

    stage.fire('resize');
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

  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    if (!stage) return;

    // initialize history store
    history.current = [];
    saveRef.current();

    const onChanged = () => saveRef.current();

    stage.on('object:added', onChanged);
    stage.on('object:removed', onChanged);
    stage.on('object:modified', onChanged);

    return () => {
      stage.off('object:added', onChanged);
      stage.off('object:removed', onChanged);
      stage.off('object:modified', onChanged);
    };
  }, [stage]);

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
        canUndo,
        canRedo,
        save,
        undo,
        redo,
        getWorkspace,
        add,
        remove,
        copy,
        paste,
        bringForward,
        sendBackwards,
        zoomIn,
        zoomOut,
        zoomReset,
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

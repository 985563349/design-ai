'use client';

import { createContext, useContext, useRef } from 'react';
import { fabric } from 'fabric';

export type EditorControllerApi = {
  stage?: fabric.Canvas;
  getWorkspace: () => fabric.Object | void;
  add: (object: fabric.Object) => void;
  remove: () => void;
  copy: () => void;
  paste: () => void;
  selectAll: () => void;
  bringForward: () => void;
  sendBackwards: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  setWorkspaceBackground: (background: string) => void;
  setWorkspaceSize: (size: Record<'width' | 'height', number>) => void;
  exportImage: () => string | void;
  exportJSON: () => string | void;
  loadFromJSON: (json: string, callback?: VoidFunction) => void;
};

export const EditorControllerContext = createContext<EditorControllerApi | null>(null);

export interface EditorControllerProviderProps {
  stage?: fabric.Canvas;
  children: React.ReactNode;
}

export const EditorControllerProvider: React.FC<EditorControllerProviderProps> = ({ stage, children }) => {
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

  const selectAll = () => {
    if (!stage) return;

    const objects = stage.getObjects().filter((object) => object.selectable);

    if (!objects.length) return;

    stage.discardActiveObject();
    stage.setActiveObject(new fabric.ActiveSelection(objects, { canvas: stage }));
    stage.renderAll();
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

  const exportImage = () => {
    if (!stage) return;

    const workspace = getWorkspace();

    if (!workspace) return;

    const { width, height, left, top } = workspace as fabric.Rect;
    stage.setViewportTransform([1, 0, 0, 1, 0, 0]);

    const url = stage.toDataURL({ width, height, left, top, format: 'png', quality: 1 });
    stage.fire('resize');

    return url;
  };

  const exportJSON = () => {
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

    return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(currentState, null, '\t'))}`;
  };

  const loadFromJSON = (json: string, callback?: VoidFunction) => {
    if (!stage) return;

    stage.clear();

    stage.loadFromJSON(JSON.parse(json), () => {
      stage.renderAll();
      callback?.();
    });
  };

  return (
    <EditorControllerContext.Provider
      value={{
        stage,
        getWorkspace,
        add,
        remove,
        copy,
        paste,
        selectAll,
        bringForward,
        sendBackwards,
        zoomIn,
        zoomOut,
        zoomReset,
        setWorkspaceBackground,
        setWorkspaceSize,
        exportImage,
        exportJSON,
        loadFromJSON,
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

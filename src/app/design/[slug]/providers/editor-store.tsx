'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';

type ActiveTool =
  | 'select'
  | 'templates'
  | 'images'
  | 'text'
  | 'shapes'
  | 'draw'
  | 'ai'
  | 'settings'
  | 'fill'
  | 'stroke-color'
  | 'stroke-width'
  | 'opacity'
  | 'font'
  | 'filter';

type EditorState = {
  id?: string;
  activeTool: ActiveTool;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  fontFamily: string;
};

type EditorActions = {
  setActiveTool: (activeTool: ActiveTool) => void;
  setFillColor: (fillColor: string) => void;
  setStrokeColor: (strokeColor: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setStrokeDashArray: (strokeDashArray: number[]) => void;
  setFontFamily: (fontFamily: string) => void;
};

type EditorStore = EditorState & EditorActions;

const defaultInitState: EditorState = {
  activeTool: 'select',
  fillColor: 'rgba(0, 0, 0, 1)',
  strokeColor: 'rgba(0, 0, 0, 1)',
  strokeWidth: 2,
  strokeDashArray: [],
  fontFamily: 'Arial',
};

const createEditorStore = (initState: EditorState) => {
  return createStore<EditorStore>()((set) => ({
    ...initState,
    setActiveTool: (activeTool) => set({ activeTool }),
    setFillColor: (fillColor) => set({ fillColor }),
    setStrokeColor: (strokeColor) => set({ strokeColor }),
    setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
    setStrokeDashArray: (strokeDashArray) => set({ strokeDashArray }),
    setFontFamily: (fontFamily) => set({ fontFamily }),
  }));
};

export type EditorStoreApi = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStoreApi | null>(null);

export interface EditorStoreProviderProps {
  initState?: Partial<EditorState>;
  children: React.ReactNode;
}

export const EditorStoreProvider: React.FC<EditorStoreProviderProps> = ({ initState, children }) => {
  const storeRef = useRef<EditorStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createEditorStore({ ...defaultInitState, ...initState });
  }

  return <EditorStoreContext.Provider value={storeRef.current}>{children}</EditorStoreContext.Provider>;
};

export function useEditorStore<T>(selector: (state: EditorStore) => T) {
  const context = useContext(EditorStoreContext);

  if (!context) {
    throw new Error('useEditorStore must be used within EditorStoreProvider');
  }

  return useStore(context, selector);
}

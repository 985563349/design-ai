import { createStore } from 'zustand/vanilla';

type ActiveTool =
  | 'select'
  | 'templates'
  | 'images'
  | 'text'
  | 'shapes'
  | 'ai'
  | 'settings'
  | 'fill'
  | 'stroke-color'
  | 'stroke-width';

export type EditorState = {
  activeTool: ActiveTool;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
};

export type EditorActions = {
  setActiveTool: (activeTool: ActiveTool) => void;
  setFillColor: (fillColor: string) => void;
  setStrokeColor: (strokeColor: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
};

export type EditorStore = EditorState & EditorActions;

export const defaultInitState: EditorState = {
  activeTool: 'select',
  fillColor: '#000000',
  strokeColor: '#000000',
  strokeWidth: 2,
};

export const createEditorStore = (initState: EditorState = defaultInitState) => {
  return createStore<EditorStore>()((set) => ({
    ...initState,
    setActiveTool: (activeTool) => set({ activeTool }),
    setFillColor: (fillColor) => set({ fillColor }),
    setStrokeColor: (strokeColor) => set({ strokeColor }),
    setStrokeWidth: (strokeWidth) => set({ strokeWidth }),
  }));
};

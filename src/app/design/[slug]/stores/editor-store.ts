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

export type EditorState = {
  activeTool: ActiveTool;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  strokeDashArray: number[];
  fontFamily: string;
};

export type EditorActions = {
  setActiveTool: (activeTool: ActiveTool) => void;
  setFillColor: (fillColor: string) => void;
  setStrokeColor: (strokeColor: string) => void;
  setStrokeWidth: (strokeWidth: number) => void;
  setStrokeDashArray: (strokeDashArray: number[]) => void;
  setFontFamily: (fontFamily: string) => void;
};

export type EditorStore = EditorState & EditorActions;

export const defaultInitState: EditorState = {
  activeTool: 'select',
  fillColor: 'rgba(0, 0, 0, 1)',
  strokeColor: 'rgba(0, 0, 0, 1)',
  strokeWidth: 2,
  strokeDashArray: [],
  fontFamily: 'Arial',
};

export const createEditorStore = (initState: EditorState = defaultInitState) => {
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

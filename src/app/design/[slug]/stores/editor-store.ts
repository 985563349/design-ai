import { createStore } from 'zustand/vanilla';

type ActiveTool = 'select' | 'templates' | 'images' | 'text' | 'shapes' | 'ai' | 'settings';

export type EditorState = {
  activeTool: ActiveTool;
};

export type EditorActions = {
  setActiveTool: (activeTool: ActiveTool) => void;
};

export type EditorStore = EditorState & EditorActions;

export const defaultInitState: EditorState = {
  activeTool: 'select',
};

export const createEditorStore = (initState: EditorState = defaultInitState) => {
  return createStore<EditorStore>()((set) => ({
    ...initState,
    setActiveTool: (activeTool) => set({ activeTool }),
  }));
};

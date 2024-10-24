'use client';

import { useState, createContext, useContext, useRef, useCallback } from 'react';
import { fabric } from 'fabric';

type ActiveTool = 'select' | 'templates' | 'images' | 'text' | 'shapes' | 'ai' | 'settings';

export interface EditorProviderProps {
  children: React.ReactNode;
}

export interface EditorProviderState {
  stageRef: React.MutableRefObject<fabric.Canvas | null>;
  register: (stage: fabric.Canvas) => () => void;
  activeTool: ActiveTool;
  setActiveTool: (activeTool: ActiveTool) => void;
}

const editorProviderContext = createContext<EditorProviderState | null>(null);

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
  const stageRef = useRef<fabric.Canvas | null>(null);
  const [activeTool, setActiveTool] = useState<ActiveTool>('select');

  const register = useCallback((stage: fabric.Canvas) => {
    stageRef.current = stage;

    return () => {
      stageRef.current = null;
    };
  }, []);

  return (
    <editorProviderContext.Provider value={{ stageRef, register, activeTool, setActiveTool }}>
      {children}
    </editorProviderContext.Provider>
  );
};

export function useEditor() {
  const context = useContext(editorProviderContext);

  if (!context) {
    throw new Error('useEditor must be used within a EditorProvider');
  }

  return context;
}

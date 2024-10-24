'use client';

import { createContext, useContext, useRef } from 'react';
import { useStore } from 'zustand';

import { type EditorStore, createEditorStore } from '../stores/editor-store';

export type EditorStoreApi = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStoreApi | null>(null);

export interface EditorStoreProviderProps {
  children: React.ReactNode;
}

export const EditorStoreProvider: React.FC<EditorStoreProviderProps> = ({ children }) => {
  const storeRef = useRef<EditorStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createEditorStore();
  }

  return <EditorStoreContext.Provider value={storeRef.current}>{children}</EditorStoreContext.Provider>;
};

export function useEditorStore<T>(selector: (state: EditorStore) => T) {
  const context = useContext(EditorStoreContext);

  if (!context) {
    throw new Error('useEditorStore  must be used within EditorStoreProvider');
  }

  return useStore(context, selector);
}

import { createContext, useContext, useEffect, useRef, useState } from 'react';

export type EditorHistoryApi = {
  canUndo: boolean;
  canRedo: boolean;
  save: (skip?: boolean) => void;
  undo: () => void;
  redo: () => void;
};

export const EditorHistoryContext = createContext<EditorHistoryApi | null>(null);

export interface EditorHistoryProviderProps {
  stage?: fabric.Canvas;
  children: React.ReactNode;
}

export const EditorHistoryProvider: React.FC<EditorHistoryProviderProps> = ({ stage, children }) => {
  const history = useRef<string[]>([]);
  const [index, setIndex] = useState(-1);
  const skipRef = useRef(false);

  const canUndo = index > 0;
  const canRedo = index < history.current.length - 1;

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
      setIndex(history.current.push(json) - 1);
    }
  };

  const undo = () => {
    if (!stage || !canUndo) return;

    skipRef.current = true;
    stage.clear().renderAll();

    const previousIndex = index - 1;
    const previousState = JSON.parse(history.current[previousIndex]);

    stage.loadFromJSON(previousState, () => {
      stage.renderAll();
      setIndex(previousIndex);
      skipRef.current = false;
    });
  };

  const redo = () => {
    if (!stage || !canRedo) return;

    skipRef.current = true;
    stage.clear().renderAll();

    const nextIndex = index + 1;
    const nextState = JSON.parse(history.current[nextIndex]);

    stage.loadFromJSON(nextState, () => {
      stage.renderAll();
      setIndex(nextIndex);
      skipRef.current = false;
    });
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

  return (
    <EditorHistoryContext.Provider
      value={{
        save,
        canUndo,
        canRedo,
        undo,
        redo,
      }}
    >
      {children}
    </EditorHistoryContext.Provider>
  );
};

export function useEditorHistory() {
  const context = useContext(EditorHistoryContext);

  if (!context) {
    throw new Error('useEditorHistory must be used within EditorHistoryProvider');
  }

  return context;
}

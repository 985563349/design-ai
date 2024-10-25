import { useEffect } from 'react';
import { useEditorController } from '../providers/editor-controller-provider';
import { useEditorStore } from '../providers/editor-store-provider';

const selectionDependentTools = ['fill', 'stroke-color', 'stroke-width'];

const EditorEventListener: React.FC = () => {
  const { activeTool, setActiveTool } = useEditorStore((state) => state);
  const { stage } = useEditorController();

  useEffect(() => {
    if (!stage) return;

    const onSelectionCleared = () => {
      if (selectionDependentTools.includes(activeTool)) {
        setActiveTool('select');
      }
    };

    stage.on('selection:cleared', onSelectionCleared);

    return () => {
      stage.off('selection:cleared', onSelectionCleared);
    };
  }, [stage, activeTool, setActiveTool]);

  return null;
};

export default EditorEventListener;

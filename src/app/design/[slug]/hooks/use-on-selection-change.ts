import { useEffect, useRef } from 'react';

import { useEditorController } from '../providers/editor-controller';

export default function useOnSelectionChange(onChange: (objects: fabric.Object[]) => void) {
  const { stage } = useEditorController();

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (!stage) return;

    const onSelectionCreated = (e: fabric.IEvent) => onChangeRef.current(e.selected ?? []);
    const onSelectionUpdated = (e: fabric.IEvent) => onChangeRef.current(e.selected ?? []);
    const onSelectionCleared = () => onChangeRef.current([]);

    stage.on('selection:created', onSelectionCreated);
    stage.on('selection:updated', onSelectionUpdated);
    stage.on('selection:cleared', onSelectionCleared);

    return () => {
      stage.off('selection:created', onSelectionCreated);
      stage.off('selection:updated', onSelectionUpdated);
      stage.off('selection:cleared', onSelectionUpdated);
    };
  }, [stage]);
}

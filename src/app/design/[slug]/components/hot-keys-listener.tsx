import { useHotkeys } from 'react-hotkeys-hook';

import { useEditorHistory } from '../providers/editor-history';
import { useEditorController } from '../providers/editor-controller';

const HotKeysListener: React.FC = () => {
  const { copy, paste, remove, selectAll } = useEditorController();
  const { undo, redo, save } = useEditorHistory();

  useHotkeys('ctrl+c', copy, [copy]);
  useHotkeys('ctrl+v', paste, [paste]);
  useHotkeys('Backspace', remove, [remove]);
  useHotkeys('ctrl+a', selectAll, [selectAll]);
  useHotkeys('ctrl+z', undo, [undo]);
  useHotkeys('ctrl+y', redo, [redo]);
  useHotkeys('ctrl+s', () => save(true), [save]);

  return null;
};

export default HotKeysListener;

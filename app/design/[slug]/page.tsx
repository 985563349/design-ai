import Editor from './components/editor';
import { EditorProvider } from './providers/editor';

export default function Design() {
  return (
    <div className="h-full">
      <EditorProvider>
        <Editor />
      </EditorProvider>
    </div>
  );
}

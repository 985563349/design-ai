import { Minimize, ZoomIn, ZoomOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import Hint from '@/components/hint';
import { useEditorController } from '../providers/editor-controller';

const Footer: React.FC = () => {
  const { zoomIn, zoomOut, zoomReset } = useEditorController();

  return (
    <div className="flex items-center justify-end gap-x-1 border-t h-14 bg-white">
      <Hint label="Zoom out" side="top" sideOffset={10}>
        <Button variant="ghost" size="icon" onClick={zoomOut}>
          <ZoomOut />
        </Button>
      </Hint>

      <Hint label="Zoom in" side="top" sideOffset={10}>
        <Button variant="ghost" size="icon" onClick={zoomIn}>
          <ZoomIn />
        </Button>
      </Hint>

      <Hint label="Reset" side="top" sideOffset={10}>
        <Button variant="ghost" size="icon" onClick={zoomReset}>
          <Minimize />
        </Button>
      </Hint>
    </div>
  );
};

export default Footer;

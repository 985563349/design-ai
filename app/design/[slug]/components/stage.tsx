'use client';

import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export interface StageProps {
  onInit?: (stage: fabric.Canvas) => void;
}

const Stage: React.FC<StageProps> = ({ onInit }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onInitRef = useRef(onInit);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) {
      return;
    }

    const stage = new fabric.Canvas(canvasRef.current, { controlsAboveOverlay: true, preserveObjectStacking: true });

    fabric.Object.prototype.set({
      cornerColor: '#fff',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      borderScaleFactor: 1.5,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: '#3b82f6',
    });

    const { width, height } = containerRef.current.getBoundingClientRect();

    stage.setWidth(width);
    stage.setHeight(height);

    const workspace = new fabric.Rect({
      width: 900,
      height: 1200,
      name: 'workspace',
      fill: 'white',
      selectable: false,
      hasControls: false,
      shadow: new fabric.Shadow({
        color: 'rgba(0, 0, 0, 0.8)',
        blur: 5,
      }),
    });

    stage.add(workspace);
    stage.centerObject(workspace);
    stage.clipPath = workspace;

    const resizeObserverCallback = (entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect;

      stage.setWidth(width);
      stage.setHeight(height);

      const zoomRatio = 0.85;
      const center = stage.getCenter();
      const workspace = stage.getObjects().find((obj) => obj.name === 'workspace');

      // @ts-ignore
      const scale = fabric.util.findScaleToFit(workspace, { width, height });
      const zoom = zoomRatio * scale;

      stage.setViewportTransform(fabric.iMatrix.concat());
      stage.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

      if (!workspace) return;

      const workspaceCenter = workspace.getCenterPoint();
      const viewportTransform = stage.viewportTransform;

      if (stage.width === undefined || stage.height === undefined || !viewportTransform) return;

      viewportTransform[4] = stage.width / 2 - workspaceCenter.x * viewportTransform[0];
      viewportTransform[5] = stage.height / 2 - workspaceCenter.y * viewportTransform[3];
      stage.setViewportTransform(viewportTransform);

      workspace.clone((cloned: fabric.Object) => {
        stage.clipPath = cloned;
        stage.requestRenderAll();
      });
    };

    const resizeObserver = new ResizeObserver(resizeObserverCallback);
    resizeObserver.observe(containerRef.current);

    onInitRef.current?.(stage);

    return () => {
      stage.dispose();
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="w-full h-full" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Stage;

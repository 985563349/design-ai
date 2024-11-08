'use client';

import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

export interface StageProps {
  width?: number;
  height?: number;
  initialState?: string;
  onInit?: (stage: fabric.Canvas) => void;
}

const Stage: React.FC<StageProps> = (props) => {
  const propsRef = useRef(props);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const createStage = (container: HTMLElement, canvas: HTMLCanvasElement) => {
    const stage = new fabric.Canvas(canvas, { controlsAboveOverlay: true, preserveObjectStacking: true });

    fabric.Object.prototype.set({
      cornerColor: '#fff',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      borderScaleFactor: 1.5,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: '#3b82f6',
    });

    const { width, height } = container.getBoundingClientRect();

    stage.setWidth(width);
    stage.setHeight(height);

    const workspace = new fabric.Rect({
      width: propsRef.current.width,
      height: propsRef.current.height,
      name: 'workspace',
      fill: '#ffffff',
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

    return stage;
  };

  const resizeStageToContainerSize = (container: HTMLElement, stage: fabric.Canvas) => {
    const { width, height } = container.getBoundingClientRect();

    stage.setWidth(width);
    stage.setHeight(height);

    const zoomRatio = 0.85;
    const center = stage.getCenter();
    const workspace = stage.getObjects().find((obj) => obj.name === 'workspace');

    if (!workspace) return;

    // @ts-ignore
    const scale = fabric.util.findScaleToFit(workspace, { width, height });
    const zoom = zoomRatio * scale;

    stage.setViewportTransform(fabric.iMatrix.concat());
    stage.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

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

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) {
      return;
    }

    const stage = createStage(container, canvas);
    const initialState = propsRef.current.initialState;

    // Initial rendering
    if (initialState) {
      stage.loadFromJSON(JSON.parse(initialState), () => {
        resizeStageToContainerSize(container, stage);
        propsRef.current?.onInit?.(stage);
      });
    } else {
      propsRef.current?.onInit?.(stage);
    }

    const resizeObserver = new ResizeObserver(() => resizeStageToContainerSize(container, stage));
    resizeObserver.observe(container);

    stage.on('resize', () => resizeStageToContainerSize(container, stage));

    return () => {
      stage.dispose();
      stage.off('resize');
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

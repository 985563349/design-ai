'use client';

import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { throttle } from 'lodash';

export default function Editor() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas>();

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) {
      return;
    }

    const { width, height } = containerRef.current.getBoundingClientRect();

    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    fabric.Object.prototype.set({
      cornerColor: '#fff',
      cornerStyle: 'circle',
      borderColor: '#3b82f6',
      borderScaleFactor: 1.5,
      transparentCorners: false,
      borderOpacityWhenMoving: 1,
      cornerStrokeColor: '#3b82f6',
    });

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

    canvas.setWidth(width);
    canvas.setHeight(height);

    canvas.add(workspace);
    canvas.centerObject(workspace);
    canvas.clipPath = workspace;

    const rect = new fabric.Rect({
      width: 100,
      height: 100,
      fill: 'black',
    });

    canvas.add(rect);
    canvas.centerObject(rect);

    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current || !canvas) {
      return;
    }

    const resizeObserver = new ResizeObserver(
      throttle((entries) => {
        const { width, height } = entries[0].contentRect;

        canvas.setWidth(width);
        canvas.setHeight(height);

        const zoomRatio = 0.85;
        const center = canvas.getCenter();
        const workspace = canvas.getObjects().find((obj) => obj.name === 'workspace');

        // @ts-ignore
        const scale = fabric.util.findScaleToFit(workspace, { width, height });
        console.log(scale);
        const zoom = zoomRatio * scale;

        canvas.setViewportTransform(fabric.iMatrix.concat());
        canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

        if (!workspace) return;

        const workspaceCenter = workspace.getCenterPoint();
        const viewportTransform = canvas.viewportTransform;

        if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;

        viewportTransform[4] = canvas.width / 2 - workspaceCenter.x * viewportTransform[0];
        viewportTransform[5] = canvas.height / 2 - workspaceCenter.y * viewportTransform[3];
        canvas.setViewportTransform(viewportTransform);

        workspace.clone((cloned: fabric.Object) => {
          canvas.clipPath = cloned;
          canvas.requestRenderAll();
        });
      }, 50)
    );

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvas]);

  return (
    <div className="w-full h-full bg-gray-50" ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
}

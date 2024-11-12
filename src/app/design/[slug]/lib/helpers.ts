import { fabric } from 'fabric';

export const createCircleShapeObject = (options?: fabric.ICircleOptions) => {
  return new fabric.Circle({ radius: 100, ...options });
};

export const createRectangleShapeObject = (options?: fabric.IRectOptions) => {
  return new fabric.Rect({ width: 200, height: 200, ...options });
};

export const createTriangleShapeObject = (options?: fabric.ITriangleOptions) => {
  return new fabric.Triangle({ width: 200, height: 200, ...options });
};

export const createTextShapeObject = (value: string, options?: fabric.ITextboxOptions) => {
  return new fabric.Textbox(value, { type: 'text', fontSize: 32, fontWeight: 400, fontFamily: 'Arial', ...options });
};

export const createImageFilter = (value: string) => {
  switch (value) {
    case 'grayscale':
      return new fabric.Image.filters.Grayscale();

    case 'polaroid':
      // @ts-ignore
      return new fabric.Image.filters.Polaroid();

    case 'sepia':
      return new fabric.Image.filters.Sepia();

    case 'kodachrome':
      // @ts-ignore
      return new fabric.Image.filters.Kodachrome();

    case 'contrast':
      return new fabric.Image.filters.Contrast({ contrast: 0.3 });

    case 'brightness':
      return new fabric.Image.filters.Brightness({ brightness: 0.8 });

    case 'brownie':
      // @ts-ignore
      return new fabric.Image.filters.Brownie();

    case 'vintage':
      // @ts-ignore
      return new fabric.Image.filters.Vintage();

    case 'technicolor':
      // @ts-ignore
      return new fabric.Image.filters.Technicolor();

    case 'pixelate':
      return new fabric.Image.filters.Pixelate();

    case 'invert':
      return new fabric.Image.filters.Invert();

    case 'blur':
      return new fabric.Image.filters.Blur();

    case 'sharpen':
      return new fabric.Image.filters.Convolute({
        matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
      });

    case 'emboss':
      return new fabric.Image.filters.Convolute({
        matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1],
      });

    case 'removecolor':
      // @ts-ignore
      return new fabric.Image.filters.RemoveColor({
        threshold: 0.2,
        distance: 0.5,
      });

    case 'blacknwhite':
      // @ts-ignore
      return new fabric.Image.filters.BlackWhite();

    case 'vibrance':
      // @ts-ignore
      return new fabric.Image.filters.Vibrance({
        vibrance: 1,
      });

    case 'blendcolor':
      return new fabric.Image.filters.BlendColor({
        color: '#00ff00',
        mode: 'multiply',
      });

    case 'huerotate':
      return new fabric.Image.filters.HueRotation({
        rotation: 0.5,
      });

    case 'resize':
      return new fabric.Image.filters.Resize();

    case 'gamma':
      // @ts-ignore
      return new fabric.Image.filters.Gamma({
        gamma: [1, 0.5, 2.1],
      });

    case 'saturation':
      return new fabric.Image.filters.Saturation({
        saturation: 0.7,
      });

    default:
      return null;
  }
};

export function isTextObject(object?: fabric.Object) {
  if (!object?.type) return false;

  return ['text', 'textbox', 'i-text'].includes(object.type);
}

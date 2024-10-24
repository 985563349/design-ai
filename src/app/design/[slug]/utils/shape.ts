import { fabric } from 'fabric';

export const createCircle = (options?: fabric.ICircleOptions) => {
  return new fabric.Circle({ radius: 100, ...options });
};

export const createRectangle = (options?: fabric.IRectOptions) => {
  return new fabric.Rect({ width: 200, height: 200, ...options });
};

export const createTriangle = (options?: fabric.ITriangleOptions) => {
  return new fabric.Triangle({ width: 200, height: 200, ...options });
};

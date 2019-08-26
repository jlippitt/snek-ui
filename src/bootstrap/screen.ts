import { Screen, Size } from 'snek-client';

const createCanvas = (
  width: number,
  height: number,
): [HTMLCanvasElement, CanvasRenderingContext2D] => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.display = 'block';
  canvas.style.margin = 'auto';

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('2D rendering context unavailable');
  }

  // We want our sharp pixels!
  context.imageSmoothingEnabled = false;

  return [canvas, context];
};

interface CreateScreenResult {
  screen: Screen;
  canvas: HTMLCanvasElement;
}

export const createScreen = ({ width, height }: Size): CreateScreenResult => {
  const [innerCanvas, innerContext] = createCanvas(width, height);
  const [outerCanvas, outerContext] = createCanvas(width, height);

  const image = innerContext.createImageData(width, height);

  const update = (): void => {
    innerContext.putImageData(image, 0, 0);

    outerContext.drawImage(
      innerCanvas,
      0,
      0,
      outerCanvas.width,
      outerCanvas.height,
    );
  };

  return {
    screen: { image, update },
    canvas: outerCanvas,
  };
};

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

export default (file: File) => {
  // Hard-coded temporarily
  const width = 256;
  const height = 240;

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

  // TODO
  /*
  launchEmulator({
    image,
    update,
  });
  */

  return {
    screenSize: { width, height },
    canvas: outerCanvas,
  };
};


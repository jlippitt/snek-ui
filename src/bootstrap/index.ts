import { Size } from '../actions';
import { EmulatorOptions } from '../Api';
import AudioController from './AudioController';

const getFileExtension = (file: File): string => {
  const match = /\.(\w+)$/.exec(file.name);
  return (match && match[1]) ? match[1] : '';
};

const getRomData = (file: File): Promise<Uint8Array> => {
  const reader = new FileReader();

  return new Promise((resolve) => {
    reader.addEventListener('loadend', () => {
      resolve(new Uint8Array(reader.result as ArrayBuffer));
    });

    reader.readAsArrayBuffer(file);
  });
};

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

export interface BootstrapResult {
  screenSize: Size;
  canvas: HTMLCanvasElement;
}

export default async (availableEmulators: EmulatorOptions[], file: File): Promise<BootstrapResult> => {
  const extension = getFileExtension(file);

  const emulator = availableEmulators.find(({ fileExtensions }) =>
    fileExtensions.includes(extension)
  );

  if (!emulator) {
    // TODO: A better way to surface this error
    throw new Error(`File type ".${extension}" not supported`);
  }

  const romData = await getRomData(file);

  const { width, height } = emulator.screen;

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

  const audio = new AudioController(emulator.audio.sampleRate);

  const screen = { image, update };

  const game = emulator.bootstrap({
    audio,
    screen,
    romData,
  });

  // TODO: How do we tear this down when state changes?
  let frameRequest: number;

  function renderFrame(now: number): void {
    game.update(now);

    if (!document.hidden) {
      frameRequest = window.requestAnimationFrame(renderFrame);
    }
  }

  window.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      audio.suspend();
      window.cancelAnimationFrame(frameRequest);
      game.suspend();
    } else {
      audio.resume();
      frameRequest = window.requestAnimationFrame(renderFrame);
      game.resume();
    }
  });

  frameRequest = window.requestAnimationFrame(renderFrame);

  return {
    screenSize: { width, height },
    canvas: outerCanvas,
  };
};


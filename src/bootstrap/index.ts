import { EmulatorOptions, Size } from 'snek-client';

import AudioController from './AudioController';
import { createScreen } from './screen';

const getFileExtension = (file: File): string => {
  const match = /\.(\w+)$/.exec(file.name);
  return match && match[1] ? match[1] : '';
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

export interface BootstrapResult {
  screenSize: Size;
  canvas: HTMLCanvasElement;
}

export default async (
  availableEmulators: EmulatorOptions[],
  file: File,
): Promise<BootstrapResult> => {
  const extension = getFileExtension(file);

  const emulator = availableEmulators.find(({ fileExtensions }) =>
    fileExtensions.includes(extension),
  );

  if (!emulator) {
    // TODO: A better way to surface this error
    throw new Error(`File type ".${extension}" not supported`);
  }

  const romData = await getRomData(file);

  const { screen, canvas } = createScreen(emulator.screen);

  const audio = new AudioController(emulator.audio.sampleRate);

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
    screenSize: emulator.screen,
    canvas,
  };
};

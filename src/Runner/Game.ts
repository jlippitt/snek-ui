import { EmulatorOptions, Size } from 'snek-client';

import AudioController from './AudioController';
import Joypad from './Joypad';
import { createScreen } from './screen';

export interface GameInfo {
  screenSize: Size;
  canvas: HTMLCanvasElement;
}

export default class Game {
  public static clone(game: Game): Game {
    return new Game(game.emulator, game.romData);
  }

  private emulator: EmulatorOptions;
  private romData: Uint8Array;
  private canvas: HTMLCanvasElement;
  private audio: AudioController;
  private joypad: Joypad;
  private frameRequest: number;
  private visibilityListener: () => void;

  constructor(emulator: EmulatorOptions, romData: Uint8Array) {
    this.emulator = emulator;
    this.romData = romData;

    const { screen, canvas } = createScreen(emulator.screen);

    this.canvas = canvas;

    this.audio = new AudioController(emulator.audio.sampleRate);

    this.joypad = new Joypad();

    const game = emulator.bootstrap({
      screen,
      audio: this.audio,
      joypad: this.joypad,
      romData: this.romData,
    });

    const renderFrame = (now: number): void => {
      try {
        game.update(now);
      } catch (err) {
        alert(err.stack);
        return;
      }

      if (!document.hidden) {
        this.frameRequest = window.requestAnimationFrame(renderFrame);
      }
    };

    this.visibilityListener = () => {
      if (document.hidden) {
        this.audio.suspend();
        window.cancelAnimationFrame(this.frameRequest);
        game.suspend();
      } else {
        this.audio.resume();
        this.frameRequest = window.requestAnimationFrame(renderFrame);
        game.resume();
      }
    };

    window.addEventListener('visibilitychange', this.visibilityListener);

    this.frameRequest = window.requestAnimationFrame(renderFrame);
  }

  public stop(): void {
    window.cancelAnimationFrame(this.frameRequest);
    window.removeEventListener('visibilitychange', this.visibilityListener);
    this.audio.close();
    this.joypad.close();
  }

  public getInfo = (): GameInfo => ({
    screenSize: this.emulator.screen,
    canvas: this.canvas,
  })
}

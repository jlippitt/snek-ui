import { AnyAction, Store } from 'redux';

import AudioController from './bootstrap/AudioController';
import { registerEmulator, Size } from './actions';
import { State } from './reducer';

interface AudioOptions {
  sampleRate: number;
}

interface Screen {
  image: ImageData;
  update(): void;
}

interface BootstrapOptions {
  audio: AudioController;
  screen: Screen;
  romData: Uint8Array;
}

interface GuiInterface {
  update(now: number): void;
  suspend(): void;
  resume(): void;
}

export interface EmulatorOptions {
  name: string;
  system: string;
  fileExtensions: string[];
  screen: Size;
  audio: AudioOptions;
  bootstrap(options: BootstrapOptions): GuiInterface;
}

export default class Api {
  constructor(private store: Store<State, AnyAction>) {}

  register(options: EmulatorOptions): void {
    this.store.dispatch(registerEmulator(options));
  }
}


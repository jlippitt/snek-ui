import { AnyAction, Store } from 'redux';
import { Api as ApiInterface, EmulatorOptions } from 'snek-client';

import AudioController from './bootstrap/AudioController';
import { registerEmulator } from './actions';
import { State } from './reducer';

export default class Api implements ApiInterface {
  constructor(private store: Store<State, AnyAction>) {}

  register(options: EmulatorOptions): void {
    this.store.dispatch(registerEmulator(options));
  }
}


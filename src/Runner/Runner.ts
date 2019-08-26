import { EmulatorOptions } from 'snek-client';

import Game, { GameInfo } from './Game';

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

export default class Runner {
  private game?: Game = undefined;

  public async launch(
    availableEmulators: EmulatorOptions[],
    file: File,
  ): Promise<GameInfo> {
    if (this.game) {
      this.game.stop();
    }

    const extension = getFileExtension(file);

    const emulator = availableEmulators.find(({ fileExtensions }) =>
      fileExtensions.includes(extension),
    );

    if (!emulator) {
      // TODO: A better way to surface this error
      throw new Error(`File type ".${extension}" not supported`);
    }

    const romData = await getRomData(file);

    this.game = new Game(emulator, romData);

    return this.game.getInfo();
  }

  public reset(): GameInfo {
    if (!this.game) {
      throw new Error("Cannot reset when a game isn't running");
    }

    this.game.stop();

    this.game = Game.clone(this.game);

    return this.game.getInfo();
  }
}

import { JoypadState } from 'snek-client';

enum ControllerType {
  Keyboard,
  Gamepad,
}

// prettier-ignore
const KEYBOARD_MAP: { [key: string]: keyof JoypadState } = {
  'z': 'b',
  'x': 'a',
  'a': 'x',
  's': 'y',
  'q': 'l',
  'w': 'r',
  ' ': 'select',
  'Enter': 'start',
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'Up': 'up',
  'Down': 'down',
  'Left': 'left',
  'Right': 'right',
};

export default class Joypad {
  private controllerType: ControllerType;
  private state: JoypadState;

  constructor() {
    this.controllerType = navigator.getGamepads()[0]
      ? ControllerType.Gamepad
      : ControllerType.Keyboard;

    this.state = {
      a: false,
      b: false,
      x: false,
      y: false,
      l: false,
      r: false,
      select: false,
      start: false,
      up: false,
      down: false,
      left: false,
      right: false,
    };

    window.addEventListener('gamepadconnected', this.onGamepadConnected);
    window.addEventListener('gamepaddisconnected', this.onGamepadDisconnected);
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  public close(): void {
    window.removeEventListener('gamepadconnected', this.onGamepadConnected);
    window.removeEventListener(
      'gamepaddisconnected',
      this.onGamepadDisconnected,
    );
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
  }

  public poll(): JoypadState {
    if (this.controllerType === ControllerType.Gamepad) {
      const gamepad = navigator.getGamepads()[0];

      if (gamepad) {
        const { buttons } = gamepad;

        this.state.a = buttons[1].pressed;
        this.state.b = buttons[0].pressed;
        this.state.x = buttons[3].pressed;
        this.state.y = buttons[2].pressed;
        this.state.l = buttons[4].pressed;
        this.state.r = buttons[5].pressed;
        this.state.select = buttons[8].pressed;
        this.state.start = buttons[9].pressed;
        this.state.up = buttons[12].pressed;
        this.state.down = buttons[13].pressed;
        this.state.left = buttons[14].pressed;
        this.state.right = buttons[15].pressed;
      }
    }

    return this.state;
  }

  private onGamepadConnected = () => {
    if (navigator.getGamepads()[0]) {
      this.controllerType = ControllerType.Gamepad;
    }
  }

  private onGamepadDisconnected = () => {
    if (!navigator.getGamepads()[0]) {
      this.controllerType = ControllerType.Keyboard;
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
    event.preventDefault();

    if (
      this.controllerType === ControllerType.Keyboard &&
      KEYBOARD_MAP.hasOwnProperty(event.key)
    ) {
      this.state[KEYBOARD_MAP[event.key]] = true;
    }
  }

  private onKeyUp = (event: KeyboardEvent) => {
    event.preventDefault();

    if (
      this.controllerType === ControllerType.Keyboard &&
      KEYBOARD_MAP.hasOwnProperty(event.key)
    ) {
      this.state[KEYBOARD_MAP[event.key]] = false;
    }
  }
}

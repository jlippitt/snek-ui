import { Action, ActionType, Size } from './actions';
import { EmulatorOptions } from './Api';

const DEFAULT_SCREEN_SIZE = {
  width: 256,
  height: 240,
};

export interface State {
  availableEmulators: EmulatorOptions[];
  screenSize: Size;
  viewportSize: Size;
  canvas?: HTMLCanvasElement;
}

const initialState: State = {
  availableEmulators: [],
  screenSize: DEFAULT_SCREEN_SIZE,
  viewportSize: DEFAULT_SCREEN_SIZE,
  canvas: undefined,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.LaunchGameStart:
      return state;

    case ActionType.LaunchGameSuccess:
      return {
        ...state,
        screenSize: action.payload.screenSize,
        canvas: action.payload.canvas,
      };

    case ActionType.LaunchGameError:
      return state;

    case ActionType.RegisterEmulator:
      return {
        ...state,
        availableEmulators: state.availableEmulators.concat([action.payload]),
      };

    case ActionType.SetViewportSize:
      return {
        ...state,
        viewportSize: action.payload,
      };

    default:
      return state;
  }
};

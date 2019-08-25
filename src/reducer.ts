import { Action, ActionType, Size } from './actions';
import bootstrap from './bootstrap';

const DEFAULT_SCREEN_SIZE = {
  width: 256,
  height: 240,
};

export interface State {
  screenSize: Size;
  viewportSize: Size;
  canvas?: HTMLCanvasElement;
}

const initialState: State = {
  screenSize: DEFAULT_SCREEN_SIZE,
  viewportSize: DEFAULT_SCREEN_SIZE,
  canvas: undefined,
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.LaunchGame:
      const { screenSize, canvas } = bootstrap(action.payload);

      return {
        ...state,
        screenSize,
        canvas,
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

import { Action, ActionType, Size } from './actions';

export interface State {
  viewportSize: Size;
}

const initialState: State = {
  viewportSize: {
    width: 256,
    height: 240,
  },
};

export default (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionType.SetViewportSize:
      return {
        ...state,
        viewportSize: action.payload,
      };

    default:
      return state;
  }
};

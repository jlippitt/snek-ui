import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { EmulatorOptions, Size } from 'snek-client';

import { State } from './reducer';
import Runner, { GameInfo } from './Runner';

export type Dispatch = ThunkDispatch<State, {}, AnyAction>;

export enum ActionType {
  LaunchGameStart,
  LaunchGameSuccess,
  LaunchGameError,
  RegisterEmulator,
  SetViewportSize,
}

interface LaunchGameStart {
  type: ActionType.LaunchGameStart;
}

interface LaunchGameSuccess {
  type: ActionType.LaunchGameSuccess;
  payload: GameInfo;
}

interface LaunchGameError {
  type: ActionType.LaunchGameError;
  payload: Error;
}

interface RegisterEmulator {
  type: ActionType.RegisterEmulator;
  payload: EmulatorOptions;
}

interface SetViewportSize {
  type: ActionType.SetViewportSize;
  payload: Size;
}

export type Action =
  | LaunchGameStart
  | LaunchGameSuccess
  | LaunchGameError
  | RegisterEmulator
  | SetViewportSize;

export const launchGame = (runner: Runner, file: File) => async (
  dispatch: Dispatch,
  getState: () => State,
) => {
  dispatch(launchGameStart());

  try {
    const { availableEmulators } = getState();
    const result = await runner.launch(availableEmulators, file);
    dispatch(launchGameSuccess(result));
  } catch (err) {
    // tslint:disable no-console
    console.log(err.stack);
    dispatch(launchGameError(err));
  }
};

export const resetGame = (runner: Runner) => (
  dispatch: Dispatch,
  getState: () => State,
) => {
  dispatch(launchGameStart());

  try {
    const result = runner.reset();
    dispatch(launchGameSuccess(result));
  } catch (err) {
    // tslint:disable no-console
    console.log(err.stack);
    dispatch(launchGameError(err));
  }
};

export const launchGameStart = () => ({
  type: ActionType.LaunchGameStart,
});

export const launchGameSuccess = (payload: GameInfo) => ({
  type: ActionType.LaunchGameSuccess,
  payload,
});

export const launchGameError = (payload: Error) => ({
  type: ActionType.LaunchGameError,
  payload,
});

export const registerEmulator = (payload: EmulatorOptions) => ({
  type: ActionType.RegisterEmulator,
  payload,
});

export const setViewportSize = (payload: Size) => ({
  type: ActionType.SetViewportSize,
  payload,
});

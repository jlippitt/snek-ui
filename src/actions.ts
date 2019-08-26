import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { EmulatorOptions, Size } from 'snek-client';

import bootstrap, { BootstrapResult } from './bootstrap';
import { State } from './reducer';

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
  payload: BootstrapResult;
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

export const launchGame = (file: File) => async (
  dispatch: Dispatch,
  getState: () => State,
) => {
  dispatch(launchGameStart());

  try {
    const { availableEmulators } = getState();
    const result = await bootstrap(availableEmulators, file);
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

export const launchGameSuccess = (payload: BootstrapResult) => ({
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

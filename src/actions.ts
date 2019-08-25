export interface Size {
  width: number;
  height: number;
}

export enum ActionType {
  LaunchGame,
  SetViewportSize
}

interface LaunchGame {
  type: ActionType.LaunchGame;
  payload: File;
}

interface SetViewportSize {
  type: ActionType.SetViewportSize;
  payload: Size;
}

export type Action = LaunchGame | SetViewportSize;

export const launchGame = (payload: File) => ({
  type: ActionType.LaunchGame,
  payload,
});

export const setViewportSize = (payload: Size) => ({
  type: ActionType.SetViewportSize,
  payload,
});

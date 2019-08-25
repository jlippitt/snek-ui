export enum ActionType {
  SetViewportSize
}

export interface Size {
  width: number;
  height: number;
}

interface SetViewportSize {
  type: ActionType.SetViewportSize,
  payload: Size,
}

export type Action = SetViewportSize;

export const setViewportSize = (payload: Size) => ({
  type: ActionType.SetViewportSize,
  payload,
});

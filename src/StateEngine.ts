import { Point } from './Point';

export type State = {
  points: Map<string, Point>;
  frame: number;
};

export interface StateEngine {
  readonly state: State;
  update(): void;
}

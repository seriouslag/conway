import { Cells } from './Cells';
import { RenderArea } from './RenderArea';

export type GameState = {
  frame: number;
  cells: Cells;
  size: RenderArea;
};

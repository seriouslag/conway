import { GameState } from './GameState';
import { Cell } from './Cells';
import { RenderArea } from './RenderArea';


export function getInitialGameState(startSize: RenderArea): GameState {
  const cells = Array.from({ length: startSize.x }, () => Array.from({ length: startSize.y }, () => 0 as Cell));

  for (let x = 0; x < startSize.x; x++) {
    for (let y = 0; y < startSize.y; y++) {
      const a = Math.random() > 0.95 ? 1 : 0;
      cells[x][y] = a
    }
  }

  return {
    frame: 0,
    cells,
    size: startSize,
  };
}

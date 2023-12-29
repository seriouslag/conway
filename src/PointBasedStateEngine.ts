import { GameState } from './GameState';
import { State, StateEngine } from './StateEngine';
import { Point } from './Point';

export class PointBasedStateEngine implements StateEngine {

  #points: Map<string, Point>;

  #frame: number = 0;

  get state(): State {
    return {
      points: this.#points,
      frame: this.#frame,
    }
  }

  constructor(initialGameState: GameState) {
    this.#points = this.#buildPoints(initialGameState);
  }

  #buildPoints(gameState: GameState) {
    const points = new Map<string, Point>();
    const { x: width, y: height } = gameState.size;
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (gameState.cells[x][y]) {
          points.set(`${x},${y}`, { x, y });
        }
      }
    }
    return points;
  }

  #getNeighbors(point: Point) {
    let neighbors = 0;
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        if (xOffset === 0 && yOffset === 0) {
          continue;
        }
        const neighborX = point.x + xOffset;
        const neighborY = point.y + yOffset;
        if (this.#points.has(`${neighborX},${neighborY}`)) {
          neighbors++;
        }
      }
    }
    return neighbors;
  }

  #pointsToCheck() {
    const pointsToCheck = new Set<string>();
    for (const point of this.#points.values()) {
      pointsToCheck.add(`${point.x},${point.y}`);
      for (let xOffset = -1; xOffset <= 1; xOffset++) {
        for (let yOffset = -1; yOffset <= 1; yOffset++) {
          if (xOffset === 0 && yOffset === 0) {
            continue;
          }
          const neighborX = point.x + xOffset;
          const neighborY = point.y + yOffset;
          pointsToCheck.add(`${neighborX},${neighborY}`);
        }
      }
    }
    return pointsToCheck;
  }

  update() {
    const newPoints = new Map<string, Point>();
    const pointsToCheck = this.#pointsToCheck();

    for (const cord of pointsToCheck.values()) {
      const [x, y] = cord.split(",");
      const point = { x: Number(x), y: Number(y) };
      const neighbors = this.#getNeighbors(point);
      if (this.#points.has(cord)) {
        if (neighbors === 2 || neighbors === 3) {
          newPoints.set(cord, point);
        }
      } else if (neighbors === 3) {
        newPoints.set(cord, point);
      }
    }

    this.#points = newPoints;
    this.#frame++;
  }
}

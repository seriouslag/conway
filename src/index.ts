const gameHeight = 600;
const gameWidth = 600;

const resolution = {
  x: gameWidth,
  y: gameHeight
} as const;

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
if (!canvas) {
  throw new Error("Canvas not found");
}

canvas.width = gameWidth;
canvas.height = gameHeight;

console.log("Hello World");

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Context not found");
}

interface VisualRenderer {
  drawText({
    x,
    y,
    text,
    color,
  }: {
    x: number;
    y: number;
    text: string;
    color?: string;
  }): void;
  drawRect({
    x,
    y,
    width,
    height,
    color
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
  }): void;
  clear(): void;
  readonly width: number;
  readonly height: number;
}

class CanvasRenderer implements VisualRenderer {
  constructor(private ctx: CanvasRenderingContext2D) {
  }

  drawRect({
    x,
    y,
    width,
    height,
    color,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
  }) {
    if (x < 0 || y < 0 || x + width > this.width || y + height > this.height) {
      throw new Error("Out of bounds");
  }
    if (color) {
      this.ctx.fillStyle = color;
    }
    this.ctx.fillRect(x, y, width, height);
  }

  drawText({ x, y, text, color, }: { x: number; y: number; text: string; color?: string; }): void {
    if (color) {
      this.ctx.fillStyle = color;
    }
    this.ctx.fillText(text, x, y);
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  get width() {
    return this.ctx.canvas.width;
  }

  get height() {
    return this.ctx.canvas.height;
  }
}

const renderer = new CanvasRenderer(ctx);

type Cell = 0|1;

type Cells = Cell[][];

type GameState = {
  frame: number;
  cells: Cells;
}

function getInitialGameState(): GameState {
  const cells = Array.from({ length: resolution.x }, () => Array.from({ length: resolution.y }, () => 0 as Cell));

  for (let x = 0; x < resolution.x; x++) {
    for (let y = 0; y < resolution.y; y++) {
      cells[x][y] = Math.random() > 0.2 ? 1 : 0;
    }
  }

  return {
    frame: 0,
    cells,
  };
}

class StateEngine {

  constructor(private gameState: GameState) {
  }

  get state() {
    return this.gameState;
  }

  update() {
    const cells = Array.from({ length: resolution.x }, () => Array.from({ length: resolution.y }, () => 0 as Cell));

    for (let x = 0; x < resolution.x; x++) {
      for (let y = 0; y < resolution.y; y++) {
        const neighbors = this.getNeighbors(x, y);
        if (this.gameState.cells[x][y]) {
          if (neighbors === 2 || neighbors === 3) {
            cells[x][y] = 1;
          }
        } else if (neighbors === 3) {
          cells[x][y] = 1;
        }
      }
    }
    const nextFrame = this.gameState.frame + 1;

    const newGameState: GameState = {
      frame: nextFrame,
      cells,
    };
    
    this.gameState = newGameState;
  }

  getNeighbors(x: number, y: number) {
    let neighbors = 0;
    for (let xOffset = -1; xOffset <= 1; xOffset++) {
      for (let yOffset = -1; yOffset <= 1; yOffset++) {
        if (xOffset === 0 && yOffset === 0) {
          continue;
        }
        const neighborX = x + xOffset;
        const neighborY = y + yOffset;
        if (neighborX >= 0 && neighborX < resolution.x && neighborY >= 0 && neighborY < resolution.y) {
          if (this.gameState.cells[neighborX][neighborY]) {
            neighbors++;
          }
        }
      }
    }
    return neighbors;
  }
}

class GameEngine {
  constructor(private stateEngine: StateEngine, private renderer: VisualRenderer) {
  }

  update() {
    this.stateEngine.update();
    this.render();
  }

  render() {
    this.renderer.clear();
    for (let x = 0; x < resolution.x; x++) {
      for (let y = 0; y < resolution.y; y++) {
        if (this.stateEngine.state.cells[x][y]) {
          this.renderer.drawRect({
            x,
            y,
            width: 1,
            height: 1,
            color: "red",
          });
        }
      }
    }
    this.renderer.drawText({
      x: 10,
      y: 10,
      text: `Frame: ${this.stateEngine.state.frame}`,
      color: "white",
    });
  }
}

function loop(engine: GameEngine) {
  engine.update()
  requestAnimationFrame(() => loop(engine));
}

const stateEngine = new StateEngine(getInitialGameState());
const gameEngine = new GameEngine(stateEngine, renderer);
// render the initial state
gameEngine.render();
// start the game loop
loop(gameEngine);

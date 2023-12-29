import { CanvasRenderer, DragDirection } from './CanvasRenderer';
import { GameEngine } from './GameEngine';
import { PointBasedStateEngine } from './PointBasedStateEngine';
import { Settings } from './Settings';
import { getInitialGameState } from './getInitialGameState';
import { sleep } from './utils';

const gameHeight = 600;
const gameWidth = 600;

const canvas = document.getElementById("canvas") as HTMLCanvasElement|null;
if (!canvas) {
  throw new Error("Canvas not found");
}

const ctx = canvas.getContext("2d");
if (!ctx) {
  throw new Error("Context not found");
}

const wrapper = document.getElementById("wrapper") as HTMLDivElement|null;
if (!wrapper) {
  throw new Error("Wrapper not found");
}

const getClientSize = () => {
  // height and width of the wrapper
  const wrapperHeight = wrapper.clientHeight - 10;
  const wrapperWidth = wrapper.clientWidth - 10;

  // round the height and width of the canvas to the lower multiple of 10
  const calcHeight = Math.floor(wrapperHeight / 10) * 10;
  const calcWidth = Math.floor(wrapperWidth / 10) * 10;

  return { x: calcWidth, y: calcHeight };
}

const dragDirection: DragDirection = 'reverse';
const zoomDirection: DragDirection = 'reverse';
const settings = new Settings(getClientSize(), dragDirection, zoomDirection);
const renderer = new CanvasRenderer(canvas, settings);

// set the canvas size to the size of the wrapper when the window is resized
const setCanvasSize = () => renderer.setCanvasSize(getClientSize());

// resize the canvas when the window is resized
window.addEventListener('resize', setCanvasSize);
// set the canvas size on load
setCanvasSize();

/** Main loop */
async function loop(then: number, engine: GameEngine) {
  engine.update()
  const now = performance.now();
  // how much time has passed since last loop
  const delta = now - then;
  // how much time should pass before next update
  const interval = 1000 / settings.targetFrameRate;
  // how much time is left before next update
  const remaining = interval - delta;
  // wait until next update
  await sleep(remaining);

  requestAnimationFrame(() => { loop(now, engine) });
}

const initialGameState = getInitialGameState({ x: gameWidth, y: gameHeight });
const stateEngine = new PointBasedStateEngine(initialGameState);
const gameEngine = new GameEngine(stateEngine, renderer, settings);
// render the initial state
gameEngine.render();

// start the game loop
loop(performance.now(), gameEngine);

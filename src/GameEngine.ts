import { Point } from './Point';
import { Settings } from './Settings';
import { StateEngine } from './StateEngine';
import { VisualRenderer } from './VisualRenderer';
import { roundToHundredth } from './utils';

export class GameEngine {

  #lastFrameTime: number = 0;
  #lastTimeToUpdate: number = 0;

  get fps() {
    return Math.ceil(1 / ((performance.now() - this.#lastFrameTime) / 1000));
  }

  constructor(private stateEngine: StateEngine, private renderer: VisualRenderer, private settings: Settings) {
  }

  update() {
    const before = performance.now();
    this.stateEngine.update();
    this.render();
    const now = performance.now();
    this.#lastFrameTime = now;
    this.#lastTimeToUpdate = now - before;
  }

  #isPointOnScreen(point: Point) {
    const { x, y } = this.settings.getRenderArea();
    const canvasSize = this.settings.getCanvasSize();
    const zoom = this.settings.getZoomLevel();
    const sizeOfPixel = 1 * zoom;
    // if any part of the point is on the screen, return true, take size of pixel into account
    // if the top of the point is above the bottom of the screen
    if (((point.x + x) * sizeOfPixel < canvasSize.x) &&
      // if the left of the point is to the right of the left of the screen
      ((point.y + y) * sizeOfPixel < canvasSize.y) &&
      // if the bottom of the point is below the top of the screen
      ((point.x + x) * sizeOfPixel + sizeOfPixel > 0) &&
      // if the right of the point is to the left of the right of the screen
      ((point.y + y) * sizeOfPixel + sizeOfPixel > 0)) {
      return true;
    }

    return false;
  }

  #pointsToCells() {
    return Array.from(this.stateEngine.state.points.values())
    .filter((point) => this.#isPointOnScreen(point));
  }

  render() {
    this.renderer.clear();

    const zoom = this.settings.getZoomLevel();

    const cells = this.#pointsToCells();

    cells.forEach((cell) => {
      this.renderer.drawRect({
        x: (cell.x + this.settings.getRenderArea().x) * zoom,
        y: (cell.y + this.settings.getRenderArea().y) * zoom,
        width: zoom,
        height: zoom,
        color: "red",
      });
    });
    this.renderer.drawText({
      x: 10,
      y: 10,
      text: `Frame: ${this.stateEngine.state.frame}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 20,
      text: `Zoom: ${this.settings.getZoomLevel()}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 30,
      text: `Drag direction: ${this.settings.getDragDirection()}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 40,
      text: `Render area: ${JSON.stringify(this.settings.getRenderArea())}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 50,
      text: `FPS: ${roundToHundredth(this.fps)}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 60,
      text: `Time to update: ${roundToHundredth(this.#lastTimeToUpdate)}ms`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 70,
      text: `Total points: ${this.stateEngine.state.points.size}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 80,
      text: `Points on screen: ${cells.length}`,
      color: "white",
    });

    this.renderer.drawText({
      x: 10,
      y: 90,
      text: `Canvas size: ${JSON.stringify(this.settings.getCanvasSize())}`,
      color: "white",
    });
  }
}

import { DragDirection } from './CanvasRenderer';
import { RenderArea } from './RenderArea';

export class Settings {
  #renderArea: RenderArea;
  #dragDirection: DragDirection;
  #zoomDirection: DragDirection = 'reverse';
  #zoomLevel: number = 1;
  #canvasSize: RenderArea;

  #maxZoomLevel = 100;
  #minZoomLevel = 1;
  #targetFrameRate = 60;

  constructor(canvasSize: RenderArea, dragDirection: DragDirection, zoomDirection: DragDirection) {
    this.#renderArea = {
      x: 0,
      y: 0,
    };
    this.#dragDirection = dragDirection;
    this.#canvasSize = canvasSize;
    this.#zoomDirection = zoomDirection;
  }

  get targetFrameRate(): Readonly<number> {
    return this.#targetFrameRate;
  }

  get maxZoomLevel(): Readonly<number> {
    return this.#maxZoomLevel;
  }

  get minZoomLevel(): Readonly<number> {
    return this.#minZoomLevel;
  }

  get zoomDirection(): Readonly<DragDirection> {
    return this.#zoomDirection;
  }

  setZoomDirection(zoomDirection: DragDirection) {
    this.#zoomDirection = zoomDirection;
  }

  setCanvasSize(canvasSize: RenderArea) {
    this.#canvasSize = canvasSize;
  }

  getCanvasSize(): Readonly<RenderArea> {
    return {
      x: this.#canvasSize.x,
      y: this.#canvasSize.y,
    }
  }

  setRenderArea(newRenderArea: RenderArea) {
    this.#renderArea = newRenderArea;
  }

  getRenderArea(): Readonly<RenderArea> {
    return {
      x: this.#renderArea.x,
      y: this.#renderArea.y,
    }
  }

  setZoomLevel(zoomLevel: number) {
    this.#zoomLevel = zoomLevel;
  }

  getZoomLevel(): Readonly<number> {
    return this.#zoomLevel;
  }

  setDragDirection(dragDirection: DragDirection) {
    this.#dragDirection = dragDirection;
  }

  getDragDirection(): Readonly<DragDirection> {
    return this.#dragDirection;
  }
}

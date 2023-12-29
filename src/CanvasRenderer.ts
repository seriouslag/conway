import { Settings } from './Settings';
import { RenderArea } from './RenderArea';
import { VisualRenderer } from './VisualRenderer';
import { roundToNearest } from './utils';

export type DragDirection = 'normal'|'reverse';

export class CanvasRenderer implements VisualRenderer {
  #ctx: CanvasRenderingContext2D;
  /**
   * The offset of the canvas from the top left of the screen.
   */
  #offsetX: number;
  /**
   * The offset of the canvas from the top left of the screen.
   */
  #offsetY: number;
  /**
   * Whether the mouse is currently pressed down.
   */
  #isMouseDown = false;
  /**
   * Whether the mouse is currently over the canvas.
   */
  #isMouseOver = false;
  /**
   * The starting mouse position when the mouse is pressed down.
   */
  #startX = 0;
  /**
   * The starting mouse position when the mouse is pressed down.
   */
  #startY = 0;

  constructor(private canvas: HTMLCanvasElement, private settings: Settings) {
    canvas.onpointerdown = (e) => this.#onMouseDown(e);
    canvas.onpointerup = (e) => this.#onMouseUp(e);
    canvas.onpointermove = (e) => this.#onMouseMove(e);
    canvas.onpointerenter = (e) => this.#onMouseEnter(e);
    canvas.onpointerleave = (e) => this.#onMouseLeave(e);
    canvas.onwheel = (e) => this.#onScroll(e);

    const canvasSize = settings.getCanvasSize();

    canvas.width = canvasSize.x;
    canvas.height = canvasSize.y;
    this.setCanvasSize(settings.getCanvasSize())

    const boundingRect = canvas.getBoundingClientRect();
    this.#offsetX = boundingRect.left;
    this.#offsetY = boundingRect.top;
    this.#ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  }

  setCanvasSize(canvasSize: RenderArea) {
    this.canvas.width = canvasSize.x;
    this.canvas.height = canvasSize.y;
    this.settings.setCanvasSize(canvasSize);
  }

  drawRect({
    x, y, width, height, color,
  }: {
    x: number;
    y: number;
    width: number;
    height: number;
    color?: string;
  }) {
    // if all of the rectangle is off the screen, don't draw it
    if (x + width < 0 || y + height < 0 || x > this.width || y > this.height) {
      console.warn('Not drawing rectangle because it is completely off the screen.');
      return;
    }
    if (color) {
      this.#ctx.fillStyle = color;
    }
    this.#ctx.fillRect(x, y, width, height);
  }

  drawText({ x, y, text, color, }: { x: number; y: number; text: string; color?: string; }): void {
    if (x < 0 || y < 0 || x > this.width || y > this.height) {
      console.warn('Not drawing text because it is completely off the screen.');
      return;
    }
    if (color) {
      this.#ctx.fillStyle = color;
    }
    this.#ctx.fillText(text, x, y);
  }

  clear() {
    this.#ctx.clearRect(0, 0, this.width, this.height);
  }

  get width() {
    return this.#ctx.canvas.width;
  }

  get height() {
    return this.#ctx.canvas.height;
  }

  #onMouseDown(e: PointerEvent) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    // get the current mouse position
    const mx= Number(e.clientX - this.#offsetX);
    const my= Number(e.clientY - this.#offsetY);

    this.#isMouseDown = true;

    // save the current mouse position
    this.#startX = mx;
    this.#startY = my;
    this.#calculateMouseStyle();
  }

  #onMouseUp(e: PointerEvent) {
    // tell the browser we're handling this mouse event
    e.preventDefault();
    e.stopPropagation();

    this.#isMouseDown = false;
    this.#calculateMouseStyle();
  }

  #onMouseMove(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    // return if we're not dragging
    if (!this.#isMouseDown) {
      return;
    }

    // handle dragging
    const dragDir = this.settings.getDragDirection() === 'normal' ? -1 : 1;
    const renderArea = this.settings.getRenderArea();

    // get the current mouse position
    const mx = Number(e.clientX - this.#offsetX);
    const my = Number(e.clientY - this.#offsetY);

    // calculate the distance the mouse has moved since the last mousemove
    const dx = roundToNearest(((mx - this.#startX) * dragDir));
    const dy = roundToNearest(((my - this.#startY) * dragDir));

    const newRenderArea: RenderArea = {
      x: renderArea.x + dx,
      y: renderArea.y + dy,
    };

    this.settings.setRenderArea(newRenderArea);

    // reset the starting mouse position for the next mousemove
    this.#startX = mx;
    this.#startY = my;
  }

  #onMouseEnter(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.#isMouseOver = true;
    this.#calculateMouseStyle();
  }

  #onMouseLeave(e: PointerEvent) {
    e.preventDefault();
    e.stopPropagation();

    this.#isMouseOver = false;
    this.#isMouseDown = false;
    this.#calculateMouseStyle();
  }

  #calculateMouseStyle() {
    if (!this.#isMouseOver) {
      this.canvas.style.cursor = "default";
      return;
    }
    if (this.#isMouseDown) {
      this.canvas.style.cursor = "grabbing";
    } else {
      this.canvas.style.cursor = "grab";
    }
  }

  #onScroll(e: WheelEvent) {
    e.preventDefault();
    e.stopPropagation();

    const zoomLevel = this.settings.getZoomLevel();
    const zoomDir = this.settings.zoomDirection === 'normal' ? 1 : -1;
    const zoomSpeed = e.deltaY / 100 * zoomDir;
    const newZoomLevel = zoomLevel + zoomSpeed
    console.log('newZoomLevel', newZoomLevel);
    if (newZoomLevel < this.settings.minZoomLevel) {
      this.settings.setZoomLevel(this.settings.minZoomLevel);
      return;
    } else if (newZoomLevel > this.settings.maxZoomLevel) {
      this.settings.setZoomLevel(this.settings.maxZoomLevel);
      return;
    }
    this.settings.setZoomLevel(newZoomLevel);
    // TODO: zoom in on the mouse position
  }
}

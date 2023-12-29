export interface VisualRenderer {
  drawText({
    x, y, text, color,
  }: {
    x: number;
    y: number;
    text: string;
    color?: string;
  }): void;
  drawRect({
    x, y, width, height, color
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

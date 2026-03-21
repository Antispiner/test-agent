/**
 * Base scene interface. Every game screen implements this.
 */
export interface Scene {
  enter(): void | Promise<void>;
  render(ctx: CanvasRenderingContext2D, width: number, height: number): void;
  onClick(x: number, y: number): void | Promise<void>;
  onMouseMove?(x: number, y: number): void;
}

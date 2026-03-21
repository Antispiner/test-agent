import { Scene } from './Scene';

/**
 * Manages scene transitions and delegates input/render to the active scene.
 */
export class SceneManager {
  private current: Scene | null = null;

  async switchTo(scene: Scene) {
    this.current = scene;
    await scene.enter();
  }

  render(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.current?.render(ctx, width, height);
  }

  onClick(x: number, y: number) {
    this.current?.onClick(x, y);
  }

  onMouseMove(x: number, y: number) {
    this.current?.onMouseMove?.(x, y);
  }

  onKeyDown(key: string) {
    this.current?.onKeyDown?.(key);
  }
}

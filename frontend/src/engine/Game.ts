/**
 * Main game class — manages game loop, scene transitions, and input.
 */

import { ApiClient, GameProgress } from '../api/client';
import { SceneManager } from './SceneManager';
import { MenuScene } from '../scenes/MenuScene';

export class Game {
  private sceneManager = new SceneManager();
  private running = false;
  private progress: GameProgress | null = null;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private api: ApiClient
  ) {
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      this.sceneManager.onClick(x, y);
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const x = (e.clientX - rect.left) * scaleX;
      const y = (e.clientY - rect.top) * scaleY;
      this.sceneManager.onMouseMove(x, y);
    });

    this.canvas.setAttribute('tabindex', '0');
    this.canvas.addEventListener('keydown', (e) => {
      if (['Tab', 'Enter', 'Escape', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', ' '].includes(e.key)) {
        e.preventDefault();
      }
      this.sceneManager.onKeyDown(e.key);
    });
    this.canvas.focus();
  }

  async start() {
    const setProgress = (p: GameProgress) => { this.progress = p; };
    await this.sceneManager.switchTo(new MenuScene(this.sceneManager, this.api, setProgress));
    this.running = true;
    this.gameLoop();
  }

  private gameLoop() {
    if (!this.running) return;
    this.render();
    requestAnimationFrame(() => this.gameLoop());
  }

  private render() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.sceneManager.render(ctx, canvas.width, canvas.height);
  }
}

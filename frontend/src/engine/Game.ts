/**
 * Main game class — manages game loop, scene transitions, and state.
 * Placeholder skeleton for MVP implementation.
 */

import { ApiClient, GameProgress } from '../api/client';

export class Game {
  private playerId: string | null = null;
  private progress: GameProgress | null = null;
  private running = false;

  constructor(
    private canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private api: ApiClient
  ) {
    this.canvas.addEventListener('click', (e) => this.onClick(e));
  }

  async start() {
    // Check for existing session
    const savedId = localStorage.getItem('neighbor_player_id');
    if (savedId) {
      try {
        this.progress = await this.api.getProgress(savedId);
        this.playerId = savedId;
      } catch {
        localStorage.removeItem('neighbor_player_id');
      }
    }

    if (!this.playerId) {
      this.progress = await this.api.startGame();
      this.playerId = this.progress.playerId;
      localStorage.setItem('neighbor_player_id', this.playerId);
    }

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
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // TODO: Render current scene (menu, level select, or game level)
    ctx.fillStyle = '#e94560';
    ctx.font = '32px Segoe UI';
    ctx.textAlign = 'center';
    ctx.fillText('How to Annoy Your Neighbor', canvas.width / 2, 80);

    ctx.fillStyle = '#eee';
    ctx.font = '18px Segoe UI';
    ctx.fillText(`Player: ${this.playerId}  |  Score: ${this.progress?.totalScore ?? 0}`, canvas.width / 2, 120);
    ctx.fillText('Click anywhere to start playing!', canvas.width / 2, canvas.height / 2);
  }

  private onClick(_e: MouseEvent) {
    // TODO: Delegate to current scene's click handler
    console.log('Click registered — scene handling TBD');
  }
}

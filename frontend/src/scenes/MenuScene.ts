import { Scene } from '../engine/Scene';
import { SceneManager } from '../engine/SceneManager';
import { ApiClient, GameProgress } from '../api/client';
import { COLORS } from '../engine/colors';
import { drawButton, hitTest } from '../engine/draw';
import { LevelSelectScene } from './LevelSelectScene';

export class MenuScene implements Scene {
  private hoverStart = false;
  private hoverContinue = false;
  private savedGame = false;
  private loading = false;
  private focusIndex = 0;

  constructor(
    private sceneManager: SceneManager,
    private api: ApiClient,
    private setProgress: (p: GameProgress) => void
  ) {}

  enter() {
    this.savedGame = !!localStorage.getItem('neighbor_player_id');
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f3460');
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = COLORS.primary;
    ctx.font = 'bold 42px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('How to Annoy', w / 2, 140);
    ctx.fillText('Your Neighbor', w / 2, 195);

    // Subtitle
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '18px "Segoe UI", sans-serif';
    ctx.fillText('\u041A\u0430\u043A \u0434\u043E\u0441\u0442\u0430\u0442\u044C \u0441\u043E\u0441\u0435\u0434\u0430', w / 2, 240);

    // Decorative line
    ctx.strokeStyle = COLORS.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 100, 265);
    ctx.lineTo(w / 2 + 100, 265);
    ctx.stroke();

    // Description
    ctx.fillStyle = COLORS.text;
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText('Click objects to prank your neighbor!', w / 2, 300);
    ctx.fillText('Fill the anger meter to complete each level.', w / 2, 325);

    // Buttons
    const btnW = 220;
    const btnH = 48;
    const btnX = (w - btnW) / 2;

    drawButton(ctx, btnX, 380, btnW, btnH, 'New Game', this.hoverStart);
    if (this.focusIndex === 0) this.drawFocusRing(ctx, btnX, 380, btnW, btnH);

    if (this.savedGame) {
      drawButton(ctx, btnX, 445, btnW, btnH, 'Continue', this.hoverContinue);
      if (this.focusIndex === 1) this.drawFocusRing(ctx, btnX, 445, btnW, btnH);
    }

    if (this.loading) {
      ctx.fillStyle = COLORS.textDim;
      ctx.font = '14px "Segoe UI", sans-serif';
      ctx.fillText('Loading...', w / 2, 520);
    }

    // Footer
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '12px "Segoe UI", sans-serif';
    ctx.fillText('3 levels \u2022 15 pranks \u2022 Fill the anger meter!', w / 2, h - 30);
  }

  onMouseMove(x: number, y: number) {
    const btnW = 220;
    const btnH = 48;
    const btnX = (800 - btnW) / 2;
    this.hoverStart = hitTest(x, y, btnX, 380, btnW, btnH);
    this.hoverContinue = this.savedGame && hitTest(x, y, btnX, 445, btnW, btnH);
  }

  async onClick(x: number, y: number) {
    const btnW = 220;
    const btnH = 48;
    const btnX = (800 - btnW) / 2;

    if (hitTest(x, y, btnX, 380, btnW, btnH)) {
      await this.startNew();
    } else if (this.savedGame && hitTest(x, y, btnX, 445, btnW, btnH)) {
      await this.continueGame();
    }
  }

  private drawFocusRing(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
    ctx.save();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.rect(x - 4, y - 4, w + 8, h + 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  async onKeyDown(key: string) {
    const buttonCount = this.savedGame ? 2 : 1;
    if (key === 'Tab' || key === 'ArrowDown') {
      this.focusIndex = (this.focusIndex + 1) % buttonCount;
    } else if (key === 'ArrowUp') {
      this.focusIndex = (this.focusIndex - 1 + buttonCount) % buttonCount;
    } else if (key === 'Enter' || key === ' ') {
      if (this.focusIndex === 0) {
        await this.startNew();
      } else if (this.focusIndex === 1 && this.savedGame) {
        await this.continueGame();
      }
    }
    this.hoverStart = this.focusIndex === 0;
    this.hoverContinue = this.focusIndex === 1 && this.savedGame;
  }

  private async startNew() {
    this.loading = true;
    try {
      const progress = await this.api.startGame();
      this.setProgress(progress);
      localStorage.setItem('neighbor_player_id', progress.playerId);
      await this.sceneManager.switchTo(
        new LevelSelectScene(this.sceneManager, this.api, progress, this.setProgress)
      );
    } catch (e) {
      console.error('Failed to start game:', e);
      this.loading = false;
    }
  }

  private async continueGame() {
    this.loading = true;
    const pid = localStorage.getItem('neighbor_player_id')!;
    try {
      const progress = await this.api.getProgress(pid);
      this.setProgress(progress);
      await this.sceneManager.switchTo(
        new LevelSelectScene(this.sceneManager, this.api, progress, this.setProgress)
      );
    } catch {
      localStorage.removeItem('neighbor_player_id');
      this.savedGame = false;
      this.loading = false;
    }
  }
}

import { Scene } from '../engine/Scene';
import { SceneManager } from '../engine/SceneManager';
import { ApiClient, GameProgress, LevelState } from '../api/client';
import { COLORS } from '../engine/colors';
import { drawButton, hitTest, roundRect } from '../engine/draw';
import { announce } from '../engine/a11y';
import { LevelSelectScene } from './LevelSelectScene';

export class LevelCompleteScene implements Scene {
  private hoverNext = false;
  private hoverLevels = false;
  private focusIndex = 0;
  private confetti: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number }> = [];

  constructor(
    private sceneManager: SceneManager,
    private api: ApiClient,
    private progress: GameProgress,
    private level: LevelState,
    private setProgress: (p: GameProgress) => void
  ) {}

  enter() {
    // Generate confetti particles
    const colors = ['#e94560', '#4ade80', '#fbbf24', '#60a5fa', '#f472b6', '#a78bfa'];
    for (let i = 0; i < 80; i++) {
      this.confetti.push({
        x: 400 + (Math.random() - 0.5) * 200,
        y: 200,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 8 - 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 6 + 3,
      });
    }
    const executed = this.level.pranks.filter(p => p.executed).length;
    announce(`Level complete! ${this.level.name}. ${executed} pranks executed. Total score ${this.progress.totalScore}. Press Enter to continue.`);
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0a2040');
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Confetti
    for (const p of this.confetti) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.15; // gravity
      p.vx *= 0.99;

      if (p.y < h + 20) {
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
    }

    // Panel
    roundRect(ctx, 150, 120, 500, 340, 16, 'rgba(15,52,96,0.9)', COLORS.primary);

    // Title
    ctx.fillStyle = COLORS.success;
    ctx.font = 'bold 36px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Level Complete!', w / 2, 175);

    // Level name
    ctx.fillStyle = COLORS.text;
    ctx.font = '22px "Segoe UI", sans-serif';
    ctx.fillText(this.level.name, w / 2, 225);

    // Stats
    const executed = this.level.pranks.filter(p => p.executed).length;
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText(`Pranks executed: ${executed}/${this.level.pranks.length}`, w / 2, 270);
    ctx.fillText(`Anger meter: ${this.level.angerMeter}/${this.level.maxAnger}`, w / 2, 295);

    ctx.fillStyle = COLORS.warning;
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.fillText(`Total Score: ${this.progress.totalScore}`, w / 2, 340);

    // Buttons
    const btnW = 180;
    const btnH = 44;
    const levelsX = w / 2 - btnW - 10;
    const nextX = w / 2 + 10;
    drawButton(ctx, levelsX, 380, btnW, btnH, '\u2190 Level Select', this.hoverLevels);
    drawButton(ctx, nextX, 380, btnW, btnH, 'Next Level \u2192', this.hoverNext);

    // Keyboard focus ring
    const focusX = this.focusIndex === 0 ? levelsX : nextX;
    ctx.save();
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.setLineDash([6, 3]);
    ctx.beginPath();
    ctx.rect(focusX - 4, 376, btnW + 8, btnH + 8);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  onMouseMove(x: number, y: number) {
    const btnW = 180;
    const btnH = 44;
    const w = 800;
    this.hoverLevels = hitTest(x, y, w / 2 - btnW - 10, 380, btnW, btnH);
    this.hoverNext = hitTest(x, y, w / 2 + 10, 380, btnW, btnH);
  }

  async onKeyDown(key: string) {
    if (key === 'Tab' || key === 'ArrowRight') {
      this.focusIndex = this.focusIndex === 0 ? 1 : 0;
    } else if (key === 'ArrowLeft') {
      this.focusIndex = this.focusIndex === 1 ? 0 : 1;
    } else if (key === 'Enter' || key === ' ') {
      const freshProgress = await this.api.getProgress(this.progress.playerId);
      this.setProgress(freshProgress);
      await this.sceneManager.switchTo(
        new LevelSelectScene(this.sceneManager, this.api, freshProgress, this.setProgress)
      );
      return;
    }
    this.hoverLevels = this.focusIndex === 0;
    this.hoverNext = this.focusIndex === 1;
  }

  async onClick(x: number, y: number) {
    const btnW = 180;
    const btnH = 44;
    const w = 800;

    if (hitTest(x, y, w / 2 - btnW - 10, 380, btnW, btnH) ||
        hitTest(x, y, w / 2 + 10, 380, btnW, btnH)) {
      const freshProgress = await this.api.getProgress(this.progress.playerId);
      this.setProgress(freshProgress);
      await this.sceneManager.switchTo(
        new LevelSelectScene(this.sceneManager, this.api, freshProgress, this.setProgress)
      );
    }
  }
}

import { Scene } from '../engine/Scene';
import { SceneManager } from '../engine/SceneManager';
import { ApiClient, GameProgress, LevelState } from '../api/client';
import { COLORS } from '../engine/colors';
import { drawButton, hitTest, roundRect } from '../engine/draw';
import { GameLevelScene } from './GameLevelScene';

interface LevelCard {
  level: LevelState;
  x: number;
  y: number;
  w: number;
  h: number;
}

export class LevelSelectScene implements Scene {
  private levels: LevelState[] = [];
  private cards: LevelCard[] = [];
  private hoverIdx = -1;
  private focusIdx = -1;
  private loading = true;

  constructor(
    private sceneManager: SceneManager,
    private api: ApiClient,
    private progress: GameProgress,
    private setProgress: (p: GameProgress) => void
  ) {}

  async enter() {
    this.loading = true;
    this.levels = await this.api.getLevels(this.progress.playerId);
    this.buildCards();
    this.loading = false;
  }

  private buildCards() {
    const cardW = 200;
    const cardH = 240;
    const gap = 30;
    const totalW = this.levels.length * cardW + (this.levels.length - 1) * gap;
    const startX = (800 - totalW) / 2;

    this.cards = this.levels.map((level, i) => ({
      level,
      x: startX + i * (cardW + gap),
      y: 180,
      w: cardW,
      h: cardH,
    }));
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#0f3460');
    grad.addColorStop(1, COLORS.bg);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Title
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 32px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Select Level', w / 2, 60);

    // Score
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '16px "Segoe UI", sans-serif';
    ctx.fillText(`Total Score: ${this.progress.totalScore}`, w / 2, 100);

    if (this.loading) {
      ctx.fillStyle = COLORS.textDim;
      ctx.font = '18px "Segoe UI", sans-serif';
      ctx.fillText('Loading levels...', w / 2, h / 2);
      return;
    }

    // Level cards
    for (let i = 0; i < this.cards.length; i++) {
      this.renderCard(ctx, this.cards[i], i === this.hoverIdx || i === this.focusIdx);
    }

    // Footer hint
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText('Click a level to play. Complete levels to unlock the next one.', w / 2, h - 40);
  }

  private renderCard(ctx: CanvasRenderingContext2D, card: LevelCard, hover: boolean) {
    const { level, x, y, w, h } = card;
    const locked = !level.unlocked;
    const completed = level.completed;

    // Card background
    const bgColor = locked ? '#1a1a2e' : hover ? COLORS.panelLight : COLORS.panel;
    roundRect(ctx, x, y, w, h, 12, bgColor, locked ? COLORS.locked : COLORS.primary);

    // Room icon area
    const iconColors: Record<string, string> = {
      Kitchen: '#e8d5b7',
      Bathroom: '#c4dfe6',
      'Living Room': '#f0e6d3',
    };
    roundRect(ctx, x + 15, y + 15, w - 30, 80, 8, locked ? '#2a2a3e' : (iconColors[level.name] || '#444'));

    // Room icon label
    const icons: Record<string, string> = {
      Kitchen: '\uD83C\uDF73',
      Bathroom: '\uD83D\uDEC1',
      'Living Room': '\uD83D\uDECB\uFE0F',
    };
    ctx.font = '36px "Segoe UI Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(locked ? '\uD83D\uDD12' : (icons[level.name] || '\uD83C\uDFE0'), x + w / 2, y + 55);

    // Level name
    ctx.fillStyle = locked ? COLORS.locked : COLORS.text;
    ctx.font = 'bold 18px "Segoe UI", sans-serif';
    ctx.fillText(level.name, x + w / 2, y + 120);

    // Description
    ctx.fillStyle = locked ? COLORS.locked : COLORS.textDim;
    ctx.font = '12px "Segoe UI", sans-serif';
    const desc = level.description.length > 30
      ? level.description.substring(0, 27) + '...'
      : level.description;
    ctx.fillText(desc, x + w / 2, y + 145);

    // Status
    if (completed) {
      ctx.fillStyle = COLORS.success;
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.fillText('\u2713 Completed', x + w / 2, y + 175);
    } else if (!locked) {
      // Mini anger meter
      const meterW = w - 40;
      const meterH = 14;
      const meterX = x + 20;
      const meterY = y + 168;
      roundRect(ctx, meterX, meterY, meterW, meterH, 4, COLORS.angerBg);
      const pct = Math.min(level.angerMeter / level.maxAnger, 1);
      if (pct > 0) {
        roundRect(ctx, meterX + 1, meterY + 1, Math.max((meterW - 2) * pct, 6), meterH - 2, 3, COLORS.anger);
      }
      ctx.fillStyle = COLORS.white;
      ctx.font = '10px "Segoe UI", sans-serif';
      ctx.fillText(`${level.angerMeter}/${level.maxAnger}`, x + w / 2, meterY + meterH / 2);
    } else {
      ctx.fillStyle = COLORS.locked;
      ctx.font = '14px "Segoe UI", sans-serif';
      ctx.fillText('Locked', x + w / 2, y + 175);
    }

    // Pranks count
    if (!locked) {
      const executed = level.pranks.filter(p => p.executed).length;
      ctx.fillStyle = COLORS.textDim;
      ctx.font = '12px "Segoe UI", sans-serif';
      ctx.fillText(`Pranks: ${executed}/${level.pranks.length}`, x + w / 2, y + 210);
    }
  }

  onMouseMove(x: number, y: number) {
    this.hoverIdx = -1;
    for (let i = 0; i < this.cards.length; i++) {
      const c = this.cards[i];
      if (c.level.unlocked && hitTest(x, y, c.x, c.y, c.w, c.h)) {
        this.hoverIdx = i;
        break;
      }
    }
  }

  async onKeyDown(key: string) {
    if (this.loading || this.cards.length === 0) return;

    if (key === 'Tab' || key === 'ArrowRight') {
      this.focusIdx = this.focusIdx < this.cards.length - 1 ? this.focusIdx + 1 : 0;
    } else if (key === 'ArrowLeft') {
      this.focusIdx = this.focusIdx > 0 ? this.focusIdx - 1 : this.cards.length - 1;
    } else if (key === 'Enter' || key === ' ') {
      if (this.focusIdx >= 0 && this.focusIdx < this.cards.length) {
        const card = this.cards[this.focusIdx];
        if (card.level.unlocked) {
          const levelState = await this.api.getLevel(this.progress.playerId, card.level.id);
          await this.sceneManager.switchTo(
            new GameLevelScene(
              this.sceneManager, this.api,
              this.progress, levelState, this.setProgress
            )
          );
        }
      }
    } else if (key === 'Escape') {
      const { MenuScene } = await import('./MenuScene');
      await this.sceneManager.switchTo(
        new MenuScene(this.sceneManager, this.api, this.setProgress)
      );
    }
  }

  async onClick(x: number, y: number) {
    for (const card of this.cards) {
      if (card.level.unlocked && hitTest(x, y, card.x, card.y, card.w, card.h)) {
        const levelState = await this.api.getLevel(this.progress.playerId, card.level.id);
        await this.sceneManager.switchTo(
          new GameLevelScene(
            this.sceneManager, this.api,
            this.progress, levelState, this.setProgress
          )
        );
        break;
      }
    }
  }
}

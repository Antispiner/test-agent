import { Scene } from '../engine/Scene';
import { SceneManager } from '../engine/SceneManager';
import { ApiClient, GameProgress, LevelState, PrankInfo, PrankResult } from '../api/client';
import { COLORS } from '../engine/colors';
import { drawAngerMeter, drawButton, hitTest, roundRect } from '../engine/draw';
import { ROOMS, RoomObject } from '../engine/rooms';
import { LevelCompleteScene } from './LevelCompleteScene';
import { LevelSelectScene } from './LevelSelectScene';

interface PrankHitbox {
  prank: PrankInfo;
  roomObj: RoomObject | null;
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Toast {
  message: string;
  success: boolean;
  time: number;
  y: number;
}

const TOAST_DURATION = 2500;

export class GameLevelScene implements Scene {
  private prankHitboxes: PrankHitbox[] = [];
  private hoverPrank: PrankInfo | null = null;
  private hoverBack = false;
  private toasts: Toast[] = [];
  private executing = false;
  private animAnger = 0;
  private tooltip: { x: number; y: number; prank: PrankInfo } | null = null;
  private focusPrankIdx = -1;

  constructor(
    private sceneManager: SceneManager,
    private api: ApiClient,
    private progress: GameProgress,
    private level: LevelState,
    private setProgress: (p: GameProgress) => void
  ) {}

  enter() {
    this.animAnger = this.level.angerMeter;
    this.buildHitboxes();
  }

  private buildHitboxes() {
    const room = ROOMS[this.level.name];
    this.prankHitboxes = this.level.pranks.map(p => {
      const obj = room?.objectMap[p.objectName];
      return {
        prank: p,
        roomObj: obj || null,
        x: obj ? obj.x : p.posX - 25,
        y: obj ? obj.y : p.posY - 25,
        w: obj ? obj.w : 50,
        h: obj ? obj.h : 50,
      };
    });
  }

  render(ctx: CanvasRenderingContext2D, w: number, h: number) {
    // Remove expired toasts
    const now = Date.now();
    this.toasts = this.toasts.filter(t => now - t.time < TOAST_DURATION);

    // Animate anger meter
    if (this.animAnger < this.level.angerMeter) {
      this.animAnger = Math.min(this.animAnger + 1, this.level.angerMeter);
    }

    // Draw room
    this.renderRoom(ctx, w, h);

    // Draw HUD
    this.renderHUD(ctx, w);

    // Draw prank highlights
    this.renderPrankObjects(ctx);

    // Draw tooltip
    this.renderTooltip(ctx);

    // Draw toasts
    this.renderToasts(ctx, w);
  }

  private renderRoom(ctx: CanvasRenderingContext2D, w: number, h: number) {
    const room = ROOMS[this.level.name];
    if (!room) {
      ctx.fillStyle = COLORS.bg;
      ctx.fillRect(0, 0, w, h);
      return;
    }

    // Wall
    ctx.fillStyle = room.wallColor;
    ctx.fillRect(0, 70, w, room.floorY - 70);

    // Floor
    ctx.fillStyle = room.floorColor;
    ctx.fillRect(0, room.floorY, w, h - room.floorY);

    // Floor line
    ctx.strokeStyle = '#0003';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, room.floorY);
    ctx.lineTo(w, room.floorY);
    ctx.stroke();

    // Furniture (non-interactive items first)
    for (const obj of room.furniture) {
      if (obj.name.startsWith('_')) {
        this.drawObject(ctx, obj, false, false);
      }
    }
  }

  private renderPrankObjects(ctx: CanvasRenderingContext2D) {
    for (const hb of this.prankHitboxes) {
      const isHover = this.hoverPrank === hb.prank;
      const executed = hb.prank.executed;
      const available = hb.prank.available;

      if (hb.roomObj) {
        this.drawObject(ctx, hb.roomObj, isHover, executed);
      } else {
        // Fallback: simple rect for objects without room definition
        const color = executed ? '#4a4a4a' : available ? '#e94560' : '#666';
        roundRect(ctx, hb.x, hb.y, hb.w, hb.h, 6, color,
          isHover && available && !executed ? COLORS.warning : undefined);
      }

      // Interaction indicators
      if (!executed && available) {
        // Pulsing glow for available pranks
        const pulse = Math.sin(Date.now() / 400) * 0.3 + 0.7;
        ctx.save();
        ctx.globalAlpha = pulse * 0.4;
        ctx.strokeStyle = COLORS.warning;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.rect(hb.x - 3, hb.y - 3, hb.w + 6, hb.h + 6);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();

        // Small indicator dot
        ctx.fillStyle = COLORS.warning;
        ctx.beginPath();
        ctx.arc(hb.x + hb.w - 4, hb.y + 4, 5, 0, Math.PI * 2);
        ctx.fill();
      } else if (executed) {
        // Checkmark overlay
        ctx.save();
        ctx.globalAlpha = 0.7;
        ctx.fillStyle = COLORS.success;
        ctx.font = 'bold 20px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\u2713', hb.x + hb.w / 2, hb.y + hb.h / 2);
        ctx.globalAlpha = 1;
        ctx.restore();
      } else if (!available) {
        // Lock for unavailable
        ctx.save();
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = COLORS.locked;
        ctx.font = '14px "Segoe UI", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('\uD83D\uDD12', hb.x + hb.w / 2, hb.y + hb.h / 2);
        ctx.globalAlpha = 1;
        ctx.restore();
      }
    }
  }

  private drawObject(ctx: CanvasRenderingContext2D, obj: RoomObject, hover: boolean, dim: boolean) {
    ctx.save();
    if (dim) ctx.globalAlpha = 0.5;

    const stroke = hover ? COLORS.warning : undefined;

    if (obj.shape === 'circle') {
      ctx.fillStyle = obj.color;
      ctx.beginPath();
      ctx.ellipse(obj.x + obj.w / 2, obj.y + obj.h / 2, obj.w / 2, obj.h / 2, 0, 0, Math.PI * 2);
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    } else if (obj.shape === 'roundRect') {
      roundRect(ctx, obj.x, obj.y, obj.w, obj.h, 4, obj.color, stroke);
    } else {
      ctx.fillStyle = obj.color;
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
      }
    }

    // Label for interactive objects
    if (obj.label && !dim) {
      ctx.fillStyle = '#0008';
      ctx.font = '10px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(obj.label, obj.x + obj.w / 2, obj.y + obj.h + 2);
    }

    ctx.restore();
  }

  private renderHUD(ctx: CanvasRenderingContext2D, w: number) {
    // HUD background
    roundRect(ctx, 0, 0, w, 68, 0, 'rgba(15,52,96,0.92)');

    // Level name
    ctx.fillStyle = COLORS.text;
    ctx.font = 'bold 20px "Segoe UI", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(this.level.name, 16, 22);

    // Score
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText(`Score: ${this.progress.totalScore}`, 16, 50);

    // Pranks counter
    const executed = this.level.pranks.filter(p => p.executed).length;
    ctx.textAlign = 'right';
    ctx.fillStyle = COLORS.textDim;
    ctx.font = '13px "Segoe UI", sans-serif';
    ctx.fillText(`Pranks: ${executed}/${this.level.pranks.length}`, w - 16, 50);

    // Anger meter
    drawAngerMeter(ctx, w / 2 - 120, 8, 240, 24, this.animAnger, this.level.maxAnger);

    // Back button
    drawButton(ctx, w - 80, 38, 65, 24, '\u2190 Back', this.hoverBack);
  }

  private renderTooltip(ctx: CanvasRenderingContext2D) {
    if (!this.tooltip) return;
    const { x, y, prank } = this.tooltip;

    const lines = [
      prank.name,
      prank.description,
      prank.executed
        ? 'Already done!'
        : prank.available
          ? `Anger: +${prank.angerPoints}  \u2022  Click to prank!`
          : 'Requires another prank first',
    ];

    const padding = 10;
    ctx.font = '13px "Segoe UI", sans-serif';
    const maxW = Math.max(...lines.map(l => ctx.measureText(l).width)) + padding * 2;
    const tipH = lines.length * 18 + padding * 2;

    // Position tooltip to stay in canvas
    let tx = x + 15;
    let ty = y - tipH - 5;
    if (tx + maxW > 800) tx = x - maxW - 5;
    if (ty < 70) ty = y + 20;

    roundRect(ctx, tx, ty, maxW, tipH, 6, 'rgba(15,30,60,0.95)', COLORS.primary);

    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillStyle = i === 0 ? COLORS.primary : COLORS.text;
      ctx.font = i === 0 ? 'bold 13px "Segoe UI", sans-serif' : '12px "Segoe UI", sans-serif';
      ctx.fillText(lines[i], tx + padding, ty + padding + i * 18);
    }
  }

  private renderToasts(ctx: CanvasRenderingContext2D, w: number) {
    const now = Date.now();
    for (const toast of this.toasts) {
      const elapsed = now - toast.time;
      const alpha = elapsed < 300 ? elapsed / 300
        : elapsed > TOAST_DURATION - 500 ? (TOAST_DURATION - elapsed) / 500
        : 1;

      ctx.save();
      ctx.globalAlpha = Math.max(0, alpha);

      const tw = ctx.measureText(toast.message).width + 40;
      const tx = (w - tw) / 2;
      const ty = toast.y - (1 - alpha) * 10;

      roundRect(ctx, tx, ty, tw, 36, 8,
        toast.success ? 'rgba(74,222,128,0.9)' : 'rgba(239,68,68,0.9)');

      ctx.fillStyle = COLORS.white;
      ctx.font = 'bold 14px "Segoe UI", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(toast.message, w / 2, ty + 18);

      ctx.restore();
    }
  }

  onMouseMove(x: number, y: number) {
    // Back button hover
    this.hoverBack = hitTest(x, y, 800 - 80, 38, 65, 24);

    // Prank hover
    this.hoverPrank = null;
    this.tooltip = null;
    for (const hb of this.prankHitboxes) {
      if (hitTest(x, y, hb.x, hb.y, hb.w, hb.h)) {
        this.hoverPrank = hb.prank;
        this.tooltip = { x, y, prank: hb.prank };
        break;
      }
    }
  }

  async onKeyDown(key: string) {
    if (key === 'Escape') {
      this.progress = await this.api.getProgress(this.progress.playerId);
      this.setProgress(this.progress);
      await this.sceneManager.switchTo(
        new LevelSelectScene(this.sceneManager, this.api, this.progress, this.setProgress)
      );
      return;
    }

    if (key === 'Tab' || key === 'ArrowRight' || key === 'ArrowDown') {
      this.focusPrankIdx = this.focusPrankIdx < this.prankHitboxes.length - 1
        ? this.focusPrankIdx + 1 : 0;
    } else if (key === 'ArrowLeft' || key === 'ArrowUp') {
      this.focusPrankIdx = this.focusPrankIdx > 0
        ? this.focusPrankIdx - 1 : this.prankHitboxes.length - 1;
    } else if (key === 'Enter' || key === ' ') {
      if (this.focusPrankIdx >= 0 && this.focusPrankIdx < this.prankHitboxes.length) {
        const hb = this.prankHitboxes[this.focusPrankIdx];
        if (hb.prank.available && !hb.prank.executed) {
          await this.executePrank(hb.prank);
        } else if (hb.prank.executed) {
          this.addToast('Already pranked!', false);
        } else {
          this.addToast('Need to complete another prank first!', false);
        }
      }
    }

    // Update hover state to match keyboard focus
    if (this.focusPrankIdx >= 0 && this.focusPrankIdx < this.prankHitboxes.length) {
      const hb = this.prankHitboxes[this.focusPrankIdx];
      this.hoverPrank = hb.prank;
      this.tooltip = { x: hb.x + hb.w / 2, y: hb.y, prank: hb.prank };
    }
  }

  async onClick(x: number, y: number) {
    // Back button
    if (hitTest(x, y, 800 - 80, 38, 65, 24)) {
      this.progress = await this.api.getProgress(this.progress.playerId);
      this.setProgress(this.progress);
      await this.sceneManager.switchTo(
        new LevelSelectScene(this.sceneManager, this.api, this.progress, this.setProgress)
      );
      return;
    }

    if (this.executing) return;

    // Check prank clicks
    for (const hb of this.prankHitboxes) {
      if (hitTest(x, y, hb.x, hb.y, hb.w, hb.h)) {
        if (hb.prank.available && !hb.prank.executed) {
          await this.executePrank(hb.prank);
        } else if (hb.prank.executed) {
          this.addToast('Already pranked!', false);
        } else {
          this.addToast('Need to complete another prank first!', false);
        }
        break;
      }
    }
  }

  private async executePrank(prank: PrankInfo) {
    this.executing = true;
    try {
      const result: PrankResult = await this.api.executePrank(
        this.progress.playerId, this.level.id, prank.id
      );

      if (result.success) {
        this.addToast(`\u2713 ${prank.name} \u2014 +${result.angerGained} anger!`, true);
        prank.executed = true;
        this.level.angerMeter = result.totalAnger;

        // Refresh level to update available flags (dependencies)
        const refreshed = await this.api.getLevel(this.progress.playerId, this.level.id);
        this.level.pranks = refreshed.pranks;
        this.buildHitboxes();

        if (result.levelCompleted) {
          this.progress = await this.api.getProgress(this.progress.playerId);
          this.setProgress(this.progress);
          // Short delay to show the toast before transitioning
          setTimeout(() => {
            this.sceneManager.switchTo(
              new LevelCompleteScene(
                this.sceneManager, this.api,
                this.progress, this.level, this.setProgress
              )
            );
          }, 1000);
        }
      } else {
        this.addToast(`\u2717 ${result.message}`, false);
      }
    } catch (e) {
      this.addToast('Network error \u2014 try again', false);
      console.error('Prank execution failed:', e);
    } finally {
      this.executing = false;
    }
  }

  private addToast(message: string, success: boolean) {
    const baseY = 500 - this.toasts.length * 45;
    this.toasts.push({ message, success, time: Date.now(), y: baseY });
  }
}

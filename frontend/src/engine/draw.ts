import { COLORS } from './colors';

/** Draw a rounded rectangle */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  r: number, fill: string, stroke?: string
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

/** Draw a button-like rounded rect with text */
export function drawButton(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  label: string, hover: boolean, disabled = false
) {
  const fill = disabled ? COLORS.locked : hover ? COLORS.primaryDark : COLORS.primary;
  roundRect(ctx, x, y, w, h, 8, fill);
  ctx.fillStyle = disabled ? COLORS.textDim : COLORS.white;
  ctx.font = 'bold 16px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, x + w / 2, y + h / 2);
}

/** Draw the anger meter bar */
export function drawAngerMeter(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  current: number, max: number
) {
  const pct = Math.min(current / max, 1);

  // Background
  roundRect(ctx, x, y, w, h, 6, COLORS.angerBg);

  // Fill
  if (pct > 0) {
    const fillW = Math.max((w - 4) * pct, 8);
    roundRect(ctx, x + 2, y + 2, fillW, h - 4, 4, COLORS.anger);
  }

  // Label
  ctx.fillStyle = COLORS.white;
  ctx.font = 'bold 13px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`Anger: ${current}/${max}`, x + w / 2, y + h / 2);
}

/** Check if point is inside a rectangle */
export function hitTest(
  px: number, py: number,
  rx: number, ry: number, rw: number, rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

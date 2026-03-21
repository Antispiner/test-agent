/**
 * Entry point for "How to Annoy Your Neighbor" game.
 * Initializes canvas, starts game loop, manages scenes.
 */

import { ApiClient } from './api/client';
import { Game } from './engine/Game';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d')!;
const api = new ApiClient('/api');

const game = new Game(canvas, ctx, api);
game.start();

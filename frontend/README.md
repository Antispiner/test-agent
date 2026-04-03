# How to Annoy Your Neighbor — Frontend

Browser-based game built with TypeScript, Vite, and HTML5 Canvas. Prank your neighbor across multiple rooms and fill the anger meter to complete each level.

## Prerequisites

- Node.js 18+
- npm

## Installation

```bash
cd frontend
npm install
```

## Development

Start the local dev server with hot reload:

```bash
npm run dev
```

The game opens at `http://localhost:3000` by default. In dev mode, Vite proxies `/api` requests to the backend server.

## Build

Compile TypeScript and produce a production bundle:

```bash
npm run build
```

Output is written to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Docker

A Dockerfile is included for containerized deployment behind nginx:

```bash
docker build -t neighbor-game-frontend .
docker run -p 8080:80 neighbor-game-frontend
```

## Controls

The game is entirely mouse-driven:

| Action | Input |
|--------|-------|
| Navigate menus | Click buttons (New Game, Continue, Level Select) |
| Select a level | Click a level card on the level select screen |
| Execute a prank | Click a highlighted interactive object in a room |
| View prank details | Hover over an interactive object to see its tooltip |
| Go back to level select | Click the "Back" button in the top-right HUD |

### Visual indicators

- **Pulsing orange glow** — available prank, ready to click
- **Checkmark overlay** — prank already executed
- **Lock icon** — prank locked until a prerequisite prank is completed
- **Anger meter** (top HUD) — fills as you execute pranks; fill it to complete the level

## Game Mechanics

### Objective

Annoy your neighbor by executing pranks in each room. Every prank adds anger points to the room's anger meter. Fill the meter to its maximum to complete the level and unlock the next one.

### Levels

The game has 3 levels with 15 total pranks, each set in a different room:

1. **Kitchen** — fridge, sugar bowl, oil bottle, faucet, toaster
2. **Bathroom** — shampoo, drain, soap, toilet paper holder, mirror
3. **Living Room** — remote, armchair, couch, bookshelf, book

Levels are unlocked sequentially: complete one to access the next.

### Prank system

- Each prank targets an interactive object in the room.
- Pranks have **anger point values** — higher-risk pranks contribute more to the anger meter.
- Some pranks have **dependencies**: they remain locked until a prerequisite prank is executed first.
- Once a prank is executed it cannot be repeated.

### Scoring and progress

- Your **total score** accumulates across all levels.
- Progress is saved via the backend API; a player ID is stored in `localStorage` so you can continue a previous game from the main menu.
- A **confetti animation** plays on level completion, showing your final stats.

### Scenes

The frontend uses a scene-based architecture:

- **MenuScene** — title screen with New Game / Continue options
- **LevelSelectScene** — shows level cards with status (locked, in-progress, completed)
- **GameLevelScene** — the main gameplay scene with interactive room objects and HUD
- **LevelCompleteScene** — results screen with score summary and navigation

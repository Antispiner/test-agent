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

The game opens at `http://localhost:5173` by default. In dev mode, Vite proxies `/api` requests to the backend server.

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

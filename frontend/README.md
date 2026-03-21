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

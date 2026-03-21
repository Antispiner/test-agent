# How to Annoy Your Neighbor (Как достать соседа)

A browser-based point-and-click puzzle game where you pick pranks to annoy your neighbor across multiple levels.

## Quick Start

```bash
docker compose up --build
```

Open http://localhost:3000 in your browser.

## Architecture

- **Backend**: Java 21 + Spring Boot 3 (REST API, H2 in-memory DB)
- **Frontend**: TypeScript + Vite (HTML5 Canvas game engine)
- **Infrastructure**: Docker Compose (backend + nginx reverse proxy)

See [docs/ADR-001](docs/ADR-001-neighbor-game-architecture.md) for full architecture decision record.

## Development

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

API available at http://localhost:8080/api

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Dev server at http://localhost:5173

## Game Mechanics

- **3 levels**: Kitchen, Bathroom, Living Room
- **Point-and-click**: Click objects to trigger pranks
- **Anger meter**: Fill it to 100% to complete each level
- **Dependencies**: Some pranks unlock after completing others
- **Success chance**: Each prank has a probability of success

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/game/start` | Start new game |
| GET | `/api/game/{playerId}` | Get game progress |
| DELETE | `/api/game/{playerId}` | Reset game |
| GET | `/api/levels?playerId=X` | List levels |
| GET | `/api/levels/{id}?playerId=X` | Get level details |
| POST | `/api/game/{playerId}/levels/{levelId}/pranks/{prankId}/execute` | Execute prank |

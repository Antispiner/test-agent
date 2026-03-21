# ADR-001: Architecture for "How to Annoy Your Neighbor" Game

## Status

Accepted

## Date

2026-03-21

## Context

We need to build an MVP browser game "How to Annoy Your Neighbor" (Как достать соседа). The game is a point-and-click puzzle where the player selects pranks to annoy a neighbor across multiple levels. Each level represents a room/scenario with interactive objects that trigger prank sequences.

Requirements:
- Backend in Java
- Frontend in browser
- Docker Compose for one-command launch
- MVP with minimum playable prototype

## Decision

### Tech Stack

**Backend: Spring Boot 3 + Java 21**
- Spring Boot 3.x with Spring Web (REST API)
- H2 in-memory database (no external DB dependency for MVP)
- Spring Data JPA for persistence
- Maven for build management
- Reasoning: Spring Boot is the de-facto standard for Java web applications. H2 eliminates external dependencies while still providing SQL capabilities. Java 21 gives us modern language features (records, pattern matching).

**Frontend: Vanilla TypeScript + Vite**
- Vite for build/dev server
- Vanilla TypeScript (no framework) — the game UI is a single interactive canvas/scene, not a form-heavy SPA
- HTML5 Canvas for game rendering
- CSS3 for UI chrome (menus, HUD)
- Reasoning: A point-and-click game doesn't benefit from React/Vue component model. Canvas gives us full control over rendering interactive scenes. Vite provides fast dev experience with HMR. Keeping it framework-free reduces bundle size and complexity for MVP.

**Infrastructure: Docker Compose**
- Multi-stage Dockerfile for backend (Maven build → JRE runtime)
- Nginx container serving frontend static files + reverse proxy to backend API
- Docker Compose orchestrating both services
- Reasoning: Two-container setup keeps concerns separated. Nginx handles static files efficiently and proxies `/api/*` to the backend, giving the frontend a single origin (no CORS issues).

### Game Design (MVP Scope)

**Core Mechanics:**
- 3 levels (rooms): Kitchen, Bathroom, Living Room
- Each level has 4-6 interactive objects (clickable hotspots)
- Clicking an object triggers a prank with an animation state and score
- Some pranks unlock after others (simple dependency chain)
- "Anger meter" tracks neighbor's annoyance level — fill it to complete the level
- Each prank has a success/fail chance adding replayability

**Level Progression:**
- Levels unlock sequentially
- Player progress saved server-side (by session or simple player ID)
- Level completion when anger meter reaches 100%

### Project Structure

```
test-agent/
├── docker-compose.yml
├── docs/
│   └── ADR-001-neighbor-game-architecture.md
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/neighbor/game/
│       │   ├── Application.java
│       │   ├── config/
│       │   │   └── WebConfig.java
│       │   ├── controller/
│       │   │   ├── GameController.java
│       │   │   └── LevelController.java
│       │   ├── dto/
│       │   │   ├── PrankResult.java
│       │   │   ├── LevelState.java
│       │   │   └── GameProgress.java
│       │   ├── model/
│       │   │   ├── Level.java
│       │   │   ├── Prank.java
│       │   │   ├── PrankDependency.java
│       │   │   └── PlayerProgress.java
│       │   └── service/
│       │       ├── GameService.java
│       │       └── LevelService.java
│       └── resources/
│           ├── application.yml
│           └── data.sql          # seed data for levels/pranks
├── frontend/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.html
│   └── src/
│       ├── main.ts              # entry point
│       ├── engine/
│       │   ├── Game.ts          # game loop, scene management
│       │   ├── Scene.ts         # base scene class
│       │   └── Hotspot.ts       # clickable area on canvas
│       ├── scenes/
│       │   ├── MenuScene.ts
│       │   ├── KitchenScene.ts
│       │   ├── BathroomScene.ts
│       │   └── LivingRoomScene.ts
│       ├── api/
│       │   └── client.ts        # REST API client
│       ├── ui/
│       │   ├── HUD.ts           # anger meter, score
│       │   └── Dialog.ts        # prank result popups
│       └── assets/
│           └── (sprites, backgrounds)
└── README.md
```

### REST API Design

#### Game Session

```
POST   /api/game/start          → Start new game, returns playerId + initial state
GET    /api/game/{playerId}     → Get current game progress
DELETE /api/game/{playerId}     → Reset game progress
```

#### Levels

```
GET    /api/levels                          → List all levels with lock status
GET    /api/levels/{levelId}                → Get level details (objects, pranks, state)
POST   /api/levels/{levelId}/start          → Start/enter a level
```

#### Pranks

```
GET    /api/levels/{levelId}/pranks                → List available pranks for level
POST   /api/levels/{levelId}/pranks/{prankId}/execute  → Execute a prank, returns result
```

#### Key Data Models

**Level:**
```json
{
  "id": 1,
  "name": "Kitchen",
  "description": "The neighbor's kitchen — full of opportunities",
  "unlocked": true,
  "completed": false,
  "angerMeter": 45,
  "maxAnger": 100
}
```

**Prank:**
```json
{
  "id": 1,
  "levelId": 1,
  "name": "Swap Salt and Sugar",
  "description": "Switch the salt and sugar containers",
  "objectName": "sugar_bowl",
  "position": {"x": 320, "y": 240},
  "angerPoints": 15,
  "successChance": 0.8,
  "available": true,
  "executed": false,
  "requiredPrankIds": []
}
```

**PrankResult:**
```json
{
  "prankId": 1,
  "success": true,
  "message": "The neighbor pours salt into his coffee! +15 anger",
  "angerGained": 15,
  "totalAnger": 60,
  "levelCompleted": false
}
```

## Consequences

### Positive
- **Simple deployment**: `docker compose up` starts everything
- **No external dependencies**: H2 in-memory DB, no Redis/Postgres needed for MVP
- **Fast iteration**: Vite HMR for frontend, Spring DevTools for backend
- **Clean separation**: Backend serves only API, frontend is fully static
- **Extensible**: New levels = new seed data + new scene class

### Negative
- **H2 is ephemeral**: Game progress lost on restart (acceptable for MVP; migrate to PostgreSQL later)
- **No auth**: Player identified by generated ID stored in localStorage (acceptable for MVP)
- **No WebSocket**: Polling or request-per-action only (sufficient for single-player turn-based game)

### Risks
- Canvas rendering requires sprite assets — MVP can use colored rectangles/simple shapes as placeholders
- Game balance (anger points, success chances) will need tuning through playtesting

## Future Considerations (Post-MVP)
- PostgreSQL for persistent storage
- WebSocket for real-time animations
- Sound effects and music
- More levels and prank types
- Achievement system
- Leaderboard

# ADR-001: Architecture for "How to Annoy Your Neighbor" Game

## Status

Accepted

## Date

2026-03-21

## Context

We need to build an MVP browser game "How to Annoy Your Neighbor" (Как достать соседа). The game is a point-and-click puzzle where the player selects pranks to annoy a neighbor across multiple levels. Each level represents a room with interactive objects that trigger prank sequences.

Requirements:
- Backend in Java
- Frontend in browser
- Docker Compose for one-command launch
- MVP with minimum playable prototype

## Decision

### Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Backend | Java 21 + Spring Boot 3 | Industry standard, strong ecosystem |
| Database | H2 in-memory | Zero external deps for MVP |
| Frontend | Vanilla TS + Vite + Canvas | Point-and-click game doesn't need React |
| Infra | Docker Compose | One-command launch |

### Game Design (MVP)

- 3 levels: Kitchen, Bathroom, Living Room
- 15 pranks with dependency chains and success probabilities
- Anger meter mechanic — fill to 100% to complete each level
- Levels unlock sequentially
- Player progress saved server-side by player ID

### REST API

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/game/start` | Start new game |
| GET | `/api/game/{playerId}` | Get progress |
| DELETE | `/api/game/{playerId}` | Reset game |
| GET | `/api/levels?playerId=X` | List levels |
| GET | `/api/levels/{id}?playerId=X` | Level details |
| POST | `/api/game/{pid}/levels/{lid}/pranks/{pid}/execute` | Execute prank |

### Trade-offs

- **H2 ephemeral DB**: Acceptable for MVP — no external dependencies, data resets on restart
- **No auth**: localStorage player ID sufficient for single-player MVP
- **No WebSocket**: Polling/request-response sufficient for turn-based game
- **No framework frontend**: Canvas game doesn't benefit from React component model

## Consequences

- Simple deployment (single `docker compose up`)
- Data lost on restart (acceptable for MVP)
- Easy to migrate to PostgreSQL later by changing datasource config

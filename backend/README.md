# Neighbor Game Backend

Spring Boot 3.4 REST API for the "How to Annoy Your Neighbor" browser game.

## Prerequisites

- Java 21+
- Maven 3.9+ (or use the included Maven wrapper)

## Build

```bash
./mvnw package
```

To skip tests during build:

```bash
./mvnw package -DskipTests
```

The output JAR is created at `target/neighbor-game-0.1.0-SNAPSHOT.jar`.

## Run

```bash
java -jar target/neighbor-game-0.1.0-SNAPSHOT.jar
```

The server starts on port **8080** by default.

## Run with Docker

```bash
docker build -t neighbor-game .
docker run -p 8080:8080 neighbor-game
```

## Run Tests

```bash
./mvnw test
```

## API Endpoints

### Game (`/api/game`)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/game/start` | Start a new game, returns initial progress |
| `GET` | `/api/game/{playerId}` | Get player's current progress |
| `DELETE` | `/api/game/{playerId}` | Reset player's progress |
| `POST` | `/api/game/{playerId}/levels/{levelId}/pranks/{prankId}/execute` | Execute a prank in a level |

### Levels (`/api/levels`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/levels?playerId={playerId}` | List all levels for a player |
| `GET` | `/api/levels/{levelId}?playerId={playerId}` | Get a specific level's state |

### Actuator

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/actuator/health` | Application health check |

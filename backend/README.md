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

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SERVER_PORT` | HTTP listen port | `8080` |
| `SPRING_DATASOURCE_URL` | JDBC connection URL | `jdbc:h2:mem:gamedb` |
| `SPRING_DATASOURCE_USERNAME` | Database username | `sa` |
| `SPRING_DATASOURCE_PASSWORD` | Database password | *(empty)* |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Schema generation strategy | `create` |
| `SPRING_JPA_SHOW_SQL` | Log SQL statements | `false` |
| `SPRING_PROFILES_ACTIVE` | Active Spring profile | *(none)* |

### Profiles

- **default** — In-memory H2 database, auto-creates schema on startup.
- **dev** — Enables the H2 web console at `/h2-console`.

Activate a profile:

```bash
java -jar target/neighbor-game-0.1.0-SNAPSHOT.jar --spring.profiles.active=dev
```

### CORS

The API allows cross-origin requests from `http://localhost:3000` and `http://localhost:5173` for `GET`, `POST`, and `DELETE` methods.

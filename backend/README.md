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

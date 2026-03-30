# Tic-Tac-Toe REST API Specification

## Overview

REST API for a Tic-Tac-Toe game served by a Java 21 Spring Boot backend.

- **Base URL**: `http://localhost:8080`
- **Content-Type**: `application/json`
- **Auth**: None
- **Storage**: In-memory (data lost on restart)

---

## Endpoints

### 1. POST /api/game — Start a new game

Creates a new game with an empty 3x3 board. Player X always goes first.

**Request**

```
POST /api/game
```

No request body required.

**Response — 201 Created**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "board": [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ],
  "currentPlayer": "X",
  "status": "in_progress"
}
```

| Field           | Type       | Description                                              |
|-----------------|------------|----------------------------------------------------------|
| `id`            | `string`   | UUID of the game                                         |
| `board`         | `string[3][3]` | 3x3 array. Each cell is `null`, `"X"`, or `"O"`     |
| `currentPlayer` | `string`   | `"X"` or `"O"` — who moves next                         |
| `status`        | `string`   | One of: `in_progress`, `x_wins`, `o_wins`, `draw`       |

---

### 2. GET /api/game/{id} — Get game state

Returns the current state of an existing game.

**Request**

```
GET /api/game/550e8400-e29b-41d4-a716-446655440000
```

**Response — 200 OK**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "board": [
    ["X", null, "O"],
    [null, "X", null],
    [null, null, null]
  ],
  "currentPlayer": "O",
  "status": "in_progress"
}
```

**Response — 404 Not Found**

```json
{
  "error": "Game not found",
  "gameId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

### 3. POST /api/game/{id}/move — Make a move

Places the current player's mark on the specified cell. The server alternates turns automatically.

**Request**

```
POST /api/game/550e8400-e29b-41d4-a716-446655440000/move
Content-Type: application/json
```

```json
{
  "row": 0,
  "col": 1
}
```

| Field | Type  | Constraints | Description          |
|-------|-------|-------------|----------------------|
| `row` | `int` | 0-2         | Row index (top = 0)  |
| `col` | `int` | 0-2         | Column index (left = 0) |

**Response — 200 OK**

Returns the updated game state after the move.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "board": [
    ["X", "O", "O"],
    [null, "X", null],
    [null, null, null]
  ],
  "currentPlayer": "X",
  "status": "in_progress"
}
```

**Response — 200 OK (game over)**

When the move ends the game (win or draw), the response reflects the final state.

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "board": [
    ["X", "O", "O"],
    [null, "X", null],
    [null, null, "X"]
  ],
  "currentPlayer": "X",
  "status": "x_wins"
}
```

Note: `currentPlayer` retains the winner's mark when the game ends.

**Response — 400 Bad Request (cell occupied)**

```json
{
  "error": "Cell is already occupied",
  "row": 0,
  "col": 0
}
```

**Response — 400 Bad Request (game over)**

```json
{
  "error": "Game is already over",
  "status": "x_wins"
}
```

**Response — 400 Bad Request (invalid coordinates)**

```json
{
  "error": "Invalid coordinates: row and col must be between 0 and 2",
  "row": 5,
  "col": -1
}
```

**Response — 404 Not Found**

```json
{
  "error": "Game not found",
  "gameId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Game State Model

```json
{
  "id": "string (UUID)",
  "board": "string[3][3] (null | X | O)",
  "currentPlayer": "string (X | O)",
  "status": "string (in_progress | x_wins | o_wins | draw)"
}
```

## Status Values

| Status        | Description                     |
|---------------|---------------------------------|
| `in_progress` | Game is active, moves accepted  |
| `x_wins`      | Player X has three in a row     |
| `o_wins`      | Player O has three in a row     |
| `draw`        | All 9 cells filled, no winner   |

## Win Conditions

A player wins by placing three marks in a line:
- Any row (3 horizontal lines)
- Any column (3 vertical lines)
- Either diagonal (2 diagonal lines)

## Implementation Notes

- Game IDs are UUIDs generated server-side
- Games are stored in a `ConcurrentHashMap` — no database required
- No authentication — any client can access any game by ID
- No AI opponent — two human players alternate via API calls
- Board coordinates: `row=0, col=0` is top-left; `row=2, col=2` is bottom-right

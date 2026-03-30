package com.tictactoe.controller;

import com.tictactoe.dto.MoveRequest;
import com.tictactoe.model.Game;
import com.tictactoe.service.GameService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping
    public ResponseEntity<Game> createGame() {
        Game game = gameService.createGame();
        return ResponseEntity.status(HttpStatus.CREATED).body(game);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getGame(@PathVariable String id) {
        Game game = gameService.getGame(id);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found", "gameId", id));
        }
        return ResponseEntity.ok(game);
    }

    @PostMapping("/{id}/move")
    public ResponseEntity<?> makeMove(@PathVariable String id, @RequestBody MoveRequest move) {
        Game game = gameService.getGame(id);
        if (game == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Game not found", "gameId", id));
        }

        if (!game.getStatus().equals("in_progress")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Game is already over", "status", game.getStatus()));
        }

        int row = move.getRow();
        int col = move.getCol();

        if (row < 0 || row > 2 || col < 0 || col > 2) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error", "Invalid coordinates: row and col must be between 0 and 2",
                            "row", row,
                            "col", col));
        }

        if (game.getBoard()[row][col] != null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Cell is already occupied", "row", row, "col", col));
        }

        Game updated = gameService.makeMove(game, row, col);
        return ResponseEntity.ok(updated);
    }
}

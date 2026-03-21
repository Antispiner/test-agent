package com.neighbor.game.controller;

import com.neighbor.game.dto.GameProgress;
import com.neighbor.game.dto.PrankResult;
import com.neighbor.game.service.GameService;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
@Validated
public class GameController {

    private final GameService gameService;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/start")
    public GameProgress startGame() {
        return gameService.startNewGame();
    }

    @GetMapping("/{playerId}")
    public GameProgress getProgress(
            @PathVariable @Size(max = 36) @Pattern(regexp = "^[a-zA-Z0-9-]+$") String playerId) {
        return gameService.getProgress(playerId);
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Void> resetProgress(
            @PathVariable @Size(max = 36) @Pattern(regexp = "^[a-zA-Z0-9-]+$") String playerId) {
        gameService.resetProgress(playerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{playerId}/levels/{levelId}/pranks/{prankId}/execute")
    public PrankResult executePrank(
            @PathVariable @Size(max = 36) @Pattern(regexp = "^[a-zA-Z0-9-]+$") String playerId,
            @PathVariable long levelId,
            @PathVariable long prankId) {
        return gameService.executePrank(playerId, levelId, prankId);
    }
}

package com.neighbor.game.controller;

import com.neighbor.game.dto.GameProgress;
import com.neighbor.game.dto.PrankResult;
import com.neighbor.game.service.GameService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/game")
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
    public GameProgress getProgress(@PathVariable String playerId) {
        return gameService.getProgress(playerId);
    }

    @DeleteMapping("/{playerId}")
    public ResponseEntity<Void> resetProgress(@PathVariable String playerId) {
        gameService.resetProgress(playerId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{playerId}/levels/{levelId}/pranks/{prankId}/execute")
    public PrankResult executePrank(
            @PathVariable String playerId,
            @PathVariable long levelId,
            @PathVariable long prankId) {
        return gameService.executePrank(playerId, levelId, prankId);
    }
}

package com.neighbor.game.controller;

import com.neighbor.game.dto.LevelState;
import com.neighbor.game.service.LevelService;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/levels")
@Validated
public class LevelController {

    private final LevelService levelService;

    public LevelController(LevelService levelService) {
        this.levelService = levelService;
    }

    @GetMapping
    public List<LevelState> listLevels(
            @RequestParam @Size(max = 36) @Pattern(regexp = "^[a-zA-Z0-9-]+$") String playerId) {
        return levelService.listLevels(playerId);
    }

    @GetMapping("/{levelId}")
    public LevelState getLevel(
            @RequestParam @Size(max = 36) @Pattern(regexp = "^[a-zA-Z0-9-]+$") String playerId,
            @PathVariable long levelId) {
        return levelService.getLevel(playerId, levelId);
    }
}

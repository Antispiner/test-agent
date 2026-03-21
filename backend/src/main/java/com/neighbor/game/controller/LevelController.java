package com.neighbor.game.controller;

import com.neighbor.game.dto.LevelState;
import com.neighbor.game.service.LevelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/levels")
public class LevelController {

    private final LevelService levelService;

    public LevelController(LevelService levelService) {
        this.levelService = levelService;
    }

    @GetMapping
    public List<LevelState> listLevels(@RequestParam String playerId) {
        return levelService.listLevels(playerId);
    }

    @GetMapping("/{levelId}")
    public LevelState getLevel(@RequestParam String playerId, @PathVariable long levelId) {
        return levelService.getLevel(playerId, levelId);
    }
}

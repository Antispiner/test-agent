package com.neighbor.game.service;

import com.neighbor.game.dto.GameProgress;
import com.neighbor.game.dto.PrankResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
class GameServiceTest {

    @Autowired
    private GameService gameService;

    @Test
    void startNewGame_createsPlayerWithLevel1() {
        GameProgress progress = gameService.startNewGame();

        assertNotNull(progress.playerId());
        assertEquals(8, progress.playerId().length());
        assertEquals(1L, progress.currentLevelId());
        assertEquals(0, progress.totalScore());
        assertTrue(progress.completedLevelIds().isEmpty());
    }

    @Test
    void getProgress_afterStart_returnsCorrectState() {
        GameProgress created = gameService.startNewGame();
        GameProgress fetched = gameService.getProgress(created.playerId());

        assertEquals(created.playerId(), fetched.playerId());
        assertEquals(1L, fetched.currentLevelId());
    }

    @Test
    void getProgress_unknownPlayer_throws() {
        assertThrows(PlayerNotFoundException.class,
                () -> gameService.getProgress("unknown"));
    }

    @Test
    void executePrank_withMissingDependency_returnsFalse() {
        GameProgress progress = gameService.startNewGame();

        // Prank 3 requires prank 1 first
        PrankResult result = gameService.executePrank(progress.playerId(), 1, 3);

        assertFalse(result.success());
        assertEquals(0, result.angerGained());
        assertFalse(result.levelCompleted());
    }

    @Test
    void executePrank_wrongLevel_throwsIllegalArgument() {
        GameProgress progress = gameService.startNewGame();

        // Prank 1 belongs to level 1, not level 2
        assertThrows(IllegalArgumentException.class,
                () -> gameService.executePrank(progress.playerId(), 2, 1));
    }

    @Test
    void executePrank_unknownPrank_throws() {
        GameProgress progress = gameService.startNewGame();

        assertThrows(PrankNotFoundException.class,
                () -> gameService.executePrank(progress.playerId(), 1, 999));
    }

    @Test
    void executePrank_lockedLevel_throwsIllegalState() {
        GameProgress progress = gameService.startNewGame();

        // Player starts on level 1 — level 2 is locked
        // Prank 6 belongs to level 2
        assertThrows(IllegalStateException.class,
                () -> gameService.executePrank(progress.playerId(), 2, 6));
    }

    @Test
    void resetProgress_removesPlayer() {
        GameProgress progress = gameService.startNewGame();
        gameService.resetProgress(progress.playerId());

        assertThrows(PlayerNotFoundException.class,
                () -> gameService.getProgress(progress.playerId()));
    }
}

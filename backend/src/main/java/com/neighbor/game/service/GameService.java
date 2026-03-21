package com.neighbor.game.service;

import com.neighbor.game.dto.GameProgress;
import com.neighbor.game.dto.PrankResult;
import com.neighbor.game.model.Level;
import com.neighbor.game.model.PlayerProgress;
import com.neighbor.game.model.Prank;
import com.neighbor.game.repository.LevelRepository;
import com.neighbor.game.repository.PlayerProgressRepository;
import com.neighbor.game.repository.PrankRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GameService {

    private final PlayerProgressRepository playerRepo;
    private final PrankRepository prankRepo;
    private final LevelRepository levelRepo;

    public GameService(PlayerProgressRepository playerRepo, PrankRepository prankRepo, LevelRepository levelRepo) {
        this.playerRepo = playerRepo;
        this.prankRepo = prankRepo;
        this.levelRepo = levelRepo;
    }

    @Transactional
    public GameProgress startNewGame() {
        PlayerProgress p = new PlayerProgress();
        p.setPlayerId(UUID.randomUUID().toString().substring(0, 8));
        Level firstLevel = levelRepo.findByOrderIndex(1)
                .orElseThrow(() -> new IllegalStateException("No level with orderIndex=1 found"));
        p.setCurrentLevelId(firstLevel.getId());
        p.setCurrentAnger(0);
        p.setTotalScore(0);
        playerRepo.save(p);
        return toDto(p);
    }

    @Transactional(readOnly = true)
    public GameProgress getProgress(String playerId) {
        PlayerProgress p = playerRepo.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));
        return toDto(p);
    }

    @Transactional
    public void resetProgress(String playerId) {
        if (!playerRepo.existsById(playerId)) {
            throw new PlayerNotFoundException(playerId);
        }
        playerRepo.deleteById(playerId);
    }

    @Transactional
    public PrankResult executePrank(String playerId, long levelId, long prankId) {
        PlayerProgress p = playerRepo.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        Prank prank = prankRepo.findById(prankId)
                .orElseThrow(() -> new PrankNotFoundException(prankId));

        if (!prank.getLevel().getId().equals(levelId)) {
            throw new IllegalArgumentException("Prank does not belong to level " + levelId);
        }

        if (p.getExecutedPrankIds().contains(prankId)) {
            return new PrankResult(prankId, false, "Already executed this prank!", 0, p.getCurrentAnger(), false);
        }

        // Check dependencies
        for (Prank req : prank.getRequiredPranks()) {
            if (!p.getExecutedPrankIds().contains(req.getId())) {
                return new PrankResult(prankId, false, "You need to do something else first...", 0, p.getCurrentAnger(), false);
            }
        }

        // Roll for success
        boolean success = ThreadLocalRandom.current().nextDouble() < prank.getSuccessChance();
        int angerGained = 0;
        String message;

        if (success) {
            angerGained = prank.getAngerPoints();
            p.setCurrentAnger(p.getCurrentAnger() + angerGained);
            p.setTotalScore(p.getTotalScore() + angerGained);
            p.getExecutedPrankIds().add(prankId);
            message = "Success! The neighbor is furious! +" + angerGained + " anger";
        } else {
            message = "Failed! The neighbor almost caught you!";
        }

        // Check level completion
        Level level = prank.getLevel();
        boolean levelCompleted = p.getCurrentAnger() >= level.getMaxAnger();
        if (levelCompleted && !p.getCompletedLevelIds().contains(levelId)) {
            p.getCompletedLevelIds().add(levelId);
            p.setCurrentAnger(0);
            // Advance to next level by orderIndex
            levelRepo.findFirstByOrderIndexGreaterThanOrderByOrderIndexAsc(level.getOrderIndex())
                    .ifPresent(next -> p.setCurrentLevelId(next.getId()));
            message += " LEVEL COMPLETE!";
        }

        playerRepo.save(p);
        return new PrankResult(prankId, success, message, angerGained, p.getCurrentAnger(), levelCompleted);
    }

    private GameProgress toDto(PlayerProgress p) {
        return new GameProgress(p.getPlayerId(), p.getCurrentLevelId(), p.getCompletedLevelIds(), p.getTotalScore());
    }
}

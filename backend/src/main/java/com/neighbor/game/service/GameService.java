package com.neighbor.game.service;

import com.neighbor.game.dto.GameProgress;
import com.neighbor.game.dto.PrankResult;
import com.neighbor.game.model.PlayerProgress;
import com.neighbor.game.model.Prank;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class GameService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public GameProgress startNewGame() {
        PlayerProgress p = new PlayerProgress();
        p.setPlayerId(UUID.randomUUID().toString().substring(0, 8));
        p.setCurrentLevelId(1L);
        p.setCurrentAnger(0);
        p.setTotalScore(0);
        em.persist(p);
        return toDto(p);
    }

    public GameProgress getProgress(String playerId) {
        PlayerProgress p = em.find(PlayerProgress.class, playerId);
        if (p == null) throw new IllegalArgumentException("Player not found: " + playerId);
        return toDto(p);
    }

    @Transactional
    public void resetProgress(String playerId) {
        PlayerProgress p = em.find(PlayerProgress.class, playerId);
        if (p != null) em.remove(p);
    }

    @Transactional
    public PrankResult executePrank(String playerId, long levelId, long prankId) {
        PlayerProgress p = em.find(PlayerProgress.class, playerId);
        if (p == null) throw new IllegalArgumentException("Player not found: " + playerId);

        Prank prank = em.find(Prank.class, prankId);
        if (prank == null) throw new IllegalArgumentException("Prank not found: " + prankId);
        if (prank.getLevel().getId() != levelId) throw new IllegalArgumentException("Prank does not belong to this level");

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
        var level = prank.getLevel();
        boolean levelCompleted = p.getCurrentAnger() >= level.getMaxAnger();
        if (levelCompleted && !p.getCompletedLevelIds().contains(levelId)) {
            p.getCompletedLevelIds().add(levelId);
            p.setCurrentAnger(0);
            p.setCurrentLevelId(levelId + 1);
            message += " LEVEL COMPLETE!";
        }

        em.merge(p);
        return new PrankResult(prankId, success, message, angerGained, p.getCurrentAnger(), levelCompleted);
    }

    private GameProgress toDto(PlayerProgress p) {
        return new GameProgress(p.getPlayerId(), p.getCurrentLevelId(), p.getCompletedLevelIds(), p.getTotalScore());
    }
}

package com.neighbor.game.service;

import com.neighbor.game.dto.LevelState;
import com.neighbor.game.model.Level;
import com.neighbor.game.model.PlayerProgress;
import com.neighbor.game.model.Prank;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class LevelService {

    @PersistenceContext
    private EntityManager em;

    public List<LevelState> listLevels(String playerId) {
        PlayerProgress p = em.find(PlayerProgress.class, playerId);
        if (p == null) throw new IllegalArgumentException("Player not found: " + playerId);

        List<Level> levels = em.createQuery("SELECT l FROM Level l ORDER BY l.orderIndex", Level.class).getResultList();

        return levels.stream().map(l -> toLevelState(l, p)).toList();
    }

    public LevelState getLevel(String playerId, long levelId) {
        PlayerProgress p = em.find(PlayerProgress.class, playerId);
        if (p == null) throw new IllegalArgumentException("Player not found: " + playerId);

        Level level = em.find(Level.class, levelId);
        if (level == null) throw new IllegalArgumentException("Level not found: " + levelId);

        return toLevelState(level, p);
    }

    private LevelState toLevelState(Level level, PlayerProgress player) {
        boolean unlocked = level.getOrderIndex() == 1 || player.getCompletedLevelIds().contains(level.getId() - 1);
        boolean completed = player.getCompletedLevelIds().contains(level.getId());
        int anger = (player.getCurrentLevelId() != null && player.getCurrentLevelId().equals(level.getId()))
                ? player.getCurrentAnger() : 0;

        Set<Long> executedIds = player.getExecutedPrankIds();

        List<LevelState.PrankInfo> prankInfos = level.getPranks().stream().map(prank -> {
            boolean depsmet = prank.getRequiredPranks().stream()
                    .allMatch(req -> executedIds.contains(req.getId()));
            return new LevelState.PrankInfo(
                prank.getId(),
                prank.getName(),
                prank.getDescription(),
                prank.getObjectName(),
                prank.getPosX(),
                prank.getPosY(),
                prank.getAngerPoints(),
                depsmet && !executedIds.contains(prank.getId()),
                executedIds.contains(prank.getId())
            );
        }).toList();

        return new LevelState(level.getId(), level.getName(), level.getDescription(),
                unlocked, completed, anger, level.getMaxAnger(), prankInfos);
    }
}

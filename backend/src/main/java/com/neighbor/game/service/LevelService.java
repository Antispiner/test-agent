package com.neighbor.game.service;

import com.neighbor.game.dto.LevelState;
import com.neighbor.game.model.Level;
import com.neighbor.game.model.PlayerProgress;
import com.neighbor.game.repository.LevelRepository;
import com.neighbor.game.repository.PlayerProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class LevelService {

    private final LevelRepository levelRepo;
    private final PlayerProgressRepository playerRepo;

    public LevelService(LevelRepository levelRepo, PlayerProgressRepository playerRepo) {
        this.levelRepo = levelRepo;
        this.playerRepo = playerRepo;
    }

    @Transactional(readOnly = true)
    public List<LevelState> listLevels(String playerId) {
        PlayerProgress p = playerRepo.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        List<Level> levels = levelRepo.findAllByOrderByOrderIndexAsc();
        return levels.stream().map(l -> toLevelState(l, p)).toList();
    }

    @Transactional(readOnly = true)
    public LevelState getLevel(String playerId, long levelId) {
        PlayerProgress p = playerRepo.findById(playerId)
                .orElseThrow(() -> new PlayerNotFoundException(playerId));

        Level level = levelRepo.findById(levelId)
                .orElseThrow(() -> new LevelNotFoundException(levelId));

        return toLevelState(level, p);
    }

    private LevelState toLevelState(Level level, PlayerProgress player) {
        boolean unlocked = level.getOrderIndex() == 1
                || player.getCompletedLevelIds().contains(level.getId() - 1);
        boolean completed = player.getCompletedLevelIds().contains(level.getId());
        int anger = (player.getCurrentLevelId() != null && player.getCurrentLevelId().equals(level.getId()))
                ? player.getCurrentAnger() : 0;

        Set<Long> executedIds = player.getExecutedPrankIds();

        List<LevelState.PrankInfo> prankInfos = level.getPranks().stream().map(prank -> {
            boolean depsMet = prank.getRequiredPranks().stream()
                    .allMatch(req -> executedIds.contains(req.getId()));
            return new LevelState.PrankInfo(
                prank.getId(),
                prank.getName(),
                prank.getDescription(),
                prank.getObjectName(),
                prank.getPosX(),
                prank.getPosY(),
                prank.getAngerPoints(),
                depsMet && !executedIds.contains(prank.getId()),
                executedIds.contains(prank.getId())
            );
        }).toList();

        return new LevelState(level.getId(), level.getName(), level.getDescription(),
                unlocked, completed, anger, level.getMaxAnger(), prankInfos);
    }
}

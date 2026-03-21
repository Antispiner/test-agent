package com.neighbor.game.dto;

import java.util.Set;

public record GameProgress(
    String playerId,
    Long currentLevelId,
    Set<Long> completedLevelIds,
    int totalScore
) {}

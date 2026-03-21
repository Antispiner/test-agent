package com.neighbor.game.dto;

import java.util.List;

public record LevelState(
    long id,
    String name,
    String description,
    boolean unlocked,
    boolean completed,
    int angerMeter,
    int maxAnger,
    List<PrankInfo> pranks
) {
    public record PrankInfo(
        long id,
        String name,
        String description,
        String objectName,
        int posX,
        int posY,
        int angerPoints,
        boolean available,
        boolean executed
    ) {}
}

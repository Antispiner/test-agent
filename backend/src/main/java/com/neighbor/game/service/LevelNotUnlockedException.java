package com.neighbor.game.service;

public class LevelNotUnlockedException extends RuntimeException {
    public LevelNotUnlockedException(long levelId) {
        super("Level not unlocked: " + levelId);
    }
}

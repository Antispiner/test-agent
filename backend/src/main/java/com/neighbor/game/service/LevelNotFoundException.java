package com.neighbor.game.service;

public class LevelNotFoundException extends RuntimeException {
    public LevelNotFoundException(long levelId) {
        super("Level not found: " + levelId);
    }
}

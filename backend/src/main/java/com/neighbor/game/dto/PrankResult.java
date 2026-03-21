package com.neighbor.game.dto;

public record PrankResult(
    long prankId,
    boolean success,
    String message,
    int angerGained,
    int totalAnger,
    boolean levelCompleted
) {}

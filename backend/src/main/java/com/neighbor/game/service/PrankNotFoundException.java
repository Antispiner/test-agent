package com.neighbor.game.service;

public class PrankNotFoundException extends RuntimeException {
    public PrankNotFoundException(long prankId) {
        super("Prank not found: " + prankId);
    }
}

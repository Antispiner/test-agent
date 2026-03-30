package com.tictactoe.model;

import java.util.UUID;

public class Game {

    private final String id;
    private final String[][] board;
    private String currentPlayer;
    private String status;

    public Game() {
        this.id = UUID.randomUUID().toString();
        this.board = new String[3][3];
        this.currentPlayer = "X";
        this.status = "in_progress";
    }

    public String getId() {
        return id;
    }

    public String[][] getBoard() {
        return board;
    }

    public String getCurrentPlayer() {
        return currentPlayer;
    }

    public void setCurrentPlayer(String currentPlayer) {
        this.currentPlayer = currentPlayer;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

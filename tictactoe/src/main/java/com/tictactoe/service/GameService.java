package com.tictactoe.service;

import com.tictactoe.model.Game;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GameService {

    private final Map<String, Game> games = new ConcurrentHashMap<>();

    public Game createGame() {
        Game game = new Game();
        games.put(game.getId(), game);
        return game;
    }

    public Game getGame(String id) {
        return games.get(id);
    }

    public Game makeMove(Game game, int row, int col) {
        game.getBoard()[row][col] = game.getCurrentPlayer();

        if (checkWin(game.getBoard(), game.getCurrentPlayer())) {
            game.setStatus(game.getCurrentPlayer().equals("X") ? "x_wins" : "o_wins");
        } else if (isBoardFull(game.getBoard())) {
            game.setStatus("draw");
        } else {
            game.setCurrentPlayer(game.getCurrentPlayer().equals("X") ? "O" : "X");
        }

        return game;
    }

    private boolean checkWin(String[][] board, String player) {
        for (int i = 0; i < 3; i++) {
            if (player.equals(board[i][0]) && player.equals(board[i][1]) && player.equals(board[i][2])) {
                return true;
            }
            if (player.equals(board[0][i]) && player.equals(board[1][i]) && player.equals(board[2][i])) {
                return true;
            }
        }
        if (player.equals(board[0][0]) && player.equals(board[1][1]) && player.equals(board[2][2])) {
            return true;
        }
        if (player.equals(board[0][2]) && player.equals(board[1][1]) && player.equals(board[2][0])) {
            return true;
        }
        return false;
    }

    private boolean isBoardFull(String[][] board) {
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[i][j] == null) {
                    return false;
                }
            }
        }
        return true;
    }
}

package com.tictactoe.service;

import com.tictactoe.model.Game;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class GameServiceTest {

    private GameService gameService;

    @BeforeEach
    void setUp() {
        gameService = new GameService();
    }

    @Test
    void createGame_returnsNewGameWithEmptyBoard() {
        Game game = gameService.createGame();

        assertNotNull(game.getId());
        assertEquals("X", game.getCurrentPlayer());
        assertEquals("in_progress", game.getStatus());
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                assertNull(game.getBoard()[i][j]);
            }
        }
    }

    @Test
    void getGame_returnsCreatedGame() {
        Game created = gameService.createGame();
        Game found = gameService.getGame(created.getId());
        assertSame(created, found);
    }

    @Test
    void getGame_returnsNullForUnknownId() {
        assertNull(gameService.getGame("nonexistent"));
    }

    @Test
    void makeMove_placesMarkAndSwitchesPlayer() {
        Game game = gameService.createGame();
        gameService.makeMove(game, 0, 0);

        assertEquals("X", game.getBoard()[0][0]);
        assertEquals("O", game.getCurrentPlayer());
        assertEquals("in_progress", game.getStatus());
    }

    @Test
    void makeMove_detectsRowWin() {
        Game game = gameService.createGame();
        // X: (0,0), O: (1,0), X: (0,1), O: (1,1), X: (0,2) -> X wins
        gameService.makeMove(game, 0, 0);
        gameService.makeMove(game, 1, 0);
        gameService.makeMove(game, 0, 1);
        gameService.makeMove(game, 1, 1);
        gameService.makeMove(game, 0, 2);

        assertEquals("x_wins", game.getStatus());
        assertEquals("X", game.getCurrentPlayer());
    }

    @Test
    void makeMove_detectsColumnWin() {
        Game game = gameService.createGame();
        // X: (0,0), O: (0,1), X: (1,0), O: (1,1), X: (2,0) -> X wins
        gameService.makeMove(game, 0, 0);
        gameService.makeMove(game, 0, 1);
        gameService.makeMove(game, 1, 0);
        gameService.makeMove(game, 1, 1);
        gameService.makeMove(game, 2, 0);

        assertEquals("x_wins", game.getStatus());
    }

    @Test
    void makeMove_detectsDiagonalWin() {
        Game game = gameService.createGame();
        // X: (0,0), O: (0,1), X: (1,1), O: (0,2), X: (2,2) -> X wins
        gameService.makeMove(game, 0, 0);
        gameService.makeMove(game, 0, 1);
        gameService.makeMove(game, 1, 1);
        gameService.makeMove(game, 0, 2);
        gameService.makeMove(game, 2, 2);

        assertEquals("x_wins", game.getStatus());
    }

    @Test
    void makeMove_detectsAntiDiagonalWin() {
        Game game = gameService.createGame();
        // X: (0,2), O: (0,0), X: (1,1), O: (1,0), X: (2,0) -> X wins
        gameService.makeMove(game, 0, 2);
        gameService.makeMove(game, 0, 0);
        gameService.makeMove(game, 1, 1);
        gameService.makeMove(game, 1, 0);
        gameService.makeMove(game, 2, 0);

        assertEquals("x_wins", game.getStatus());
    }

    @Test
    void makeMove_detectsDraw() {
        Game game = gameService.createGame();
        // X O X
        // X X O
        // O X O
        gameService.makeMove(game, 0, 0); // X
        gameService.makeMove(game, 0, 1); // O
        gameService.makeMove(game, 0, 2); // X
        gameService.makeMove(game, 1, 2); // O
        gameService.makeMove(game, 1, 0); // X
        gameService.makeMove(game, 2, 0); // O
        gameService.makeMove(game, 1, 1); // X
        gameService.makeMove(game, 2, 2); // O
        gameService.makeMove(game, 2, 1); // X

        assertEquals("draw", game.getStatus());
    }

    @Test
    void makeMove_oCanWin() {
        Game game = gameService.createGame();
        // X: (0,0), O: (1,0), X: (0,1), O: (1,1), X: (2,2), O: (1,2) -> O wins row 1
        gameService.makeMove(game, 0, 0);
        gameService.makeMove(game, 1, 0);
        gameService.makeMove(game, 0, 1);
        gameService.makeMove(game, 1, 1);
        gameService.makeMove(game, 2, 2);
        gameService.makeMove(game, 1, 2);

        assertEquals("o_wins", game.getStatus());
        assertEquals("O", game.getCurrentPlayer());
    }
}

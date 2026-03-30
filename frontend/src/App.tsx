import { useState, useEffect, useCallback } from 'react';
import { Board } from './Board';
import { createGame, makeMove } from './api';
import { GameState } from './types';

function getStatusMessage(game: GameState): string {
  switch (game.status) {
    case 'x_wins':
      return 'Player X wins!';
    case 'o_wins':
      return 'Player O wins!';
    case 'draw':
      return "It's a draw!";
    case 'in_progress':
      return `Player ${game.currentPlayer}'s turn`;
  }
}

function getWinningCells(game: GameState): Set<string> {
  if (game.status !== 'x_wins' && game.status !== 'o_wins') return new Set();

  const winner = game.status === 'x_wins' ? 'X' : 'O';
  const board = game.board;

  for (let r = 0; r < 3; r++) {
    if (board[r][0] === winner && board[r][1] === winner && board[r][2] === winner) {
      return new Set([`${r}-0`, `${r}-1`, `${r}-2`]);
    }
  }
  for (let c = 0; c < 3; c++) {
    if (board[0][c] === winner && board[1][c] === winner && board[2][c] === winner) {
      return new Set([`0-${c}`, `1-${c}`, `2-${c}`]);
    }
  }
  if (board[0][0] === winner && board[1][1] === winner && board[2][2] === winner) {
    return new Set(['0-0', '1-1', '2-2']);
  }
  if (board[0][2] === winner && board[1][1] === winner && board[2][0] === winner) {
    return new Set(['0-2', '1-1', '2-0']);
  }

  return new Set();
}

export function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const startNewGame = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const newGame = await createGame();
      setGame(newGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create game');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  const handleCellClick = async (row: number, col: number) => {
    if (!game || game.status !== 'in_progress' || loading) return;
    if (game.board[row][col] !== null) return;

    setLoading(true);
    setError(null);
    try {
      const updated = await makeMove(game.id, { row, col });
      setGame(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make move');
    } finally {
      setLoading(false);
    }
  };

  const isGameOver = game?.status !== 'in_progress';
  const winningCells = game ? getWinningCells(game) : new Set<string>();

  return (
    <div className="app">
      <h1>Tic-Tac-Toe</h1>

      {error && <div className="error">{error}</div>}

      {game && (
        <>
          <div className={`status ${isGameOver ? 'game-over' : ''}`}>
            {getStatusMessage(game)}
          </div>
          <Board
            board={game.board}
            winningCells={winningCells}
            disabled={!!(isGameOver || loading)}
            onCellClick={handleCellClick}
          />
        </>
      )}

      <button className="new-game-btn" onClick={startNewGame} disabled={loading}>
        New Game
      </button>
    </div>
  );
}

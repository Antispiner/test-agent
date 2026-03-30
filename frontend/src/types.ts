export type CellValue = 'X' | 'O' | null;
export type Player = 'X' | 'O';
export type GameStatus = 'in_progress' | 'x_wins' | 'o_wins' | 'draw';

export interface GameState {
  id: string;
  board: CellValue[][];
  currentPlayer: Player;
  status: GameStatus;
}

export interface MoveRequest {
  row: number;
  col: number;
}

export interface ApiError {
  error: string;
}

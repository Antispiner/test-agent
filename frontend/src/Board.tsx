import { CellValue } from './types';

interface BoardProps {
  board: CellValue[][];
  winningCells: Set<string>;
  disabled: boolean;
  onCellClick: (row: number, col: number) => void;
}

export function Board({ board, winningCells, disabled, onCellClick }: BoardProps) {
  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((cell, c) => {
          const key = `${r}-${c}`;
          const isWinner = winningCells.has(key);
          const cellClass = [
            'cell',
            cell === 'X' ? 'cell-x' : cell === 'O' ? 'cell-o' : '',
            isWinner ? 'cell-winner' : '',
            !cell && !disabled ? 'cell-empty' : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <button
              key={key}
              className={cellClass}
              onClick={() => onCellClick(r, c)}
              disabled={disabled || cell !== null}
              aria-label={`Row ${r + 1}, Column ${c + 1}${cell ? `: ${cell}` : ''}`}
            >
              {cell}
            </button>
          );
        }),
      )}
    </div>
  );
}

import { GameState, MoveRequest } from './types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || `Request failed: ${response.status}`);
  }
  return data as T;
}

export function createGame(): Promise<GameState> {
  return request<GameState>('/api/game', { method: 'POST' });
}

export function getGame(id: string): Promise<GameState> {
  return request<GameState>(`/api/game/${id}`);
}

export function makeMove(id: string, move: MoveRequest): Promise<GameState> {
  return request<GameState>(`/api/game/${id}/move`, {
    method: 'POST',
    body: JSON.stringify(move),
  });
}

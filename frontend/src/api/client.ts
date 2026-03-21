/**
 * REST API client for communicating with the game backend.
 */

export interface GameProgress {
  playerId: string;
  currentLevelId: number | null;
  completedLevelIds: number[];
  totalScore: number;
}

export interface PrankInfo {
  id: number;
  name: string;
  description: string;
  objectName: string;
  posX: number;
  posY: number;
  angerPoints: number;
  available: boolean;
  executed: boolean;
}

export interface LevelState {
  id: number;
  name: string;
  description: string;
  unlocked: boolean;
  completed: boolean;
  angerMeter: number;
  maxAnger: number;
  pranks: PrankInfo[];
}

export interface PrankResult {
  prankId: number;
  success: boolean;
  message: string;
  angerGained: number;
  totalAnger: number;
  levelCompleted: boolean;
}

export class ApiClient {
  constructor(private baseUrl: string) {}

  async startGame(): Promise<GameProgress> {
    const res = await fetch(`${this.baseUrl}/game/start`, { method: 'POST' });
    return res.json();
  }

  async getProgress(playerId: string): Promise<GameProgress> {
    const res = await fetch(`${this.baseUrl}/game/${playerId}`);
    return res.json();
  }

  async getLevels(playerId: string): Promise<LevelState[]> {
    const res = await fetch(`${this.baseUrl}/levels?playerId=${playerId}`);
    return res.json();
  }

  async getLevel(playerId: string, levelId: number): Promise<LevelState> {
    const res = await fetch(`${this.baseUrl}/levels/${levelId}?playerId=${playerId}`);
    return res.json();
  }

  async executePrank(playerId: string, levelId: number, prankId: number): Promise<PrankResult> {
    const res = await fetch(
      `${this.baseUrl}/game/${playerId}/levels/${levelId}/pranks/${prankId}/execute`,
      { method: 'POST' }
    );
    return res.json();
  }
}

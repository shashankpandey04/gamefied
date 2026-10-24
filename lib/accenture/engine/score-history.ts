/**
 * NerdMocks Accenture Practice - Personal Best & Score Management
 * Client-side localStorage persistence for high scores and fastest completion times.
 */

export interface GameScoreRecord {
  score: number;
  timeSpentSeconds: number;
  mistakes: number;
  completedAt: string;
}

const SCORE_PREFIX = 'nerdmocks_accenture_best_';

function getScoreKey(gameId: string, variant: string): string {
  return `${SCORE_PREFIX}${gameId}_${variant}`;
}

export function getPersonalBest(gameId: string, variant: string): GameScoreRecord | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(getScoreKey(gameId, variant));
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (typeof data.score === 'number' && typeof data.timeSpentSeconds === 'number') {
      return data as GameScoreRecord;
    }
    return null;
  } catch {
    return null;
  }
}

export function savePersonalBest(gameId: string, variant: string, record: GameScoreRecord): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }

  try {
    const current = getPersonalBest(gameId, variant);
    // Better if score is higher, or if score is identical, time is lower
    const isNewBest =
      !current ||
      record.score > current.score ||
      (record.score === current.score && record.timeSpentSeconds < current.timeSpentSeconds);

    if (isNewBest) {
      window.localStorage.setItem(getScoreKey(gameId, variant), JSON.stringify(record));
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

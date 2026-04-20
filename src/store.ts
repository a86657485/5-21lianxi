export interface GameState {
  unlockedLevels: number[];
  stars: Record<number, number>; // levelId -> stars (1-3)
}

const STORAGE_KEY = 'jitu_game_state';

export const loadGameState = (): GameState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load game state', e);
  }
  return {
    unlockedLevels: [1],
    stars: {}
  };
};

export const saveGameState = (state: GameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save game state', e);
  }
};

import { Game, Player, Round } from "@shared/schema";
import { nanoid } from "nanoid";

const STORAGE_KEY = "gameScore_savedGames";
const MAX_SAVED_GAMES = 15;

export interface GameStats {
  highestScore: number;
  averageScore: number;
  roundsPlayed: number;
}

export interface GameStorageService {
  saveGame: (game: Game) => void;
  loadGame: (gameId: string) => Game | null;
  getAllGames: () => Game[];
  deleteGame: (gameId: string) => void;
  clearAllGames: () => void;
}

class LocalGameStorage implements GameStorageService {
  private getStoredGames(): Game[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error loading games from storage:", error);
      return [];
    }
  }

  private setStoredGames(games: Game[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
    } catch (error) {
      console.error("Error saving games to storage:", error);
    }
  }

  saveGame(game: Game): void {
    const games = this.getStoredGames();
    const existingIndex = games.findIndex(g => g.id === game.id);
    
    if (existingIndex >= 0) {
      games[existingIndex] = game;
    } else {
      games.unshift(game); // Add to beginning
      if (games.length > MAX_SAVED_GAMES) {
        games.pop(); // Remove oldest
      }
    }
    
    this.setStoredGames(games);
  }

  loadGame(gameId: string): Game | null {
    const games = this.getStoredGames();
    return games.find(g => g.id === gameId) || null;
  }

  getAllGames(): Game[] {
    return this.getStoredGames();
  }

  deleteGame(gameId: string): void {
    const games = this.getStoredGames();
    const filtered = games.filter(g => g.id !== gameId);
    this.setStoredGames(filtered);
  }

  clearAllGames(): void {
    this.setStoredGames([]);
  }
}

export const gameStorage = new LocalGameStorage();

export function createGame(players: Player[]): Game {
  return {
    id: nanoid(),
    name: `Game with ${players.map(p => p.name).join(", ")}`,
    players,
    rounds: [],
    currentRound: 0,
    startTime: Date.now(),
  };
}

export function createPlayer(name: string): Player {
  return {
    id: nanoid(),
    name,
    totalScore: 0,
    roundsPlayed: 0,
  };
}

export function createRound(number: number, scores: Record<string, number>): Round {
  return {
    id: nanoid(),
    number,
    scores,
    timestamp: Date.now(),
  };
}

export function calculatePlayerStats(player: Player, rounds: Round[]): GameStats {
  const playerScores = rounds
    .map(r => r.scores[player.id] || 0)
    .filter(score => score !== undefined);

  const highestScore = playerScores.length > 0 ? Math.max(...playerScores) : 0;
  const totalScore = playerScores.reduce((sum, score) => sum + score, 0);
  const averageScore = playerScores.length > 0 ? totalScore / playerScores.length : 0;

  return {
    highestScore,
    averageScore: Math.round(averageScore * 10) / 10,
    roundsPlayed: playerScores.length,
  };
}

export function updatePlayerTotals(players: Player[], rounds: Round[]): Player[] {
  return players.map(player => {
    const playerRounds = rounds.filter(r => r.scores[player.id] !== undefined);
    const totalScore = playerRounds.reduce((sum, round) => sum + (round.scores[player.id] || 0), 0);
    
    return {
      ...player,
      totalScore,
      roundsPlayed: playerRounds.length,
    };
  });
}

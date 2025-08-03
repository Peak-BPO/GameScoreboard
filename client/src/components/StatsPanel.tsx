import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Game } from "@shared/schema";
import { calculatePlayerStats } from "@/lib/gameStorage";

interface StatsPanelProps {
  open: boolean;
  onClose: () => void;
  game: Game;
}

export function StatsPanel({ open, onClose, game }: StatsPanelProps) {
  const getLeadingPlayer = () => {
    if (game.players.length === 0) return null;
    return game.players.reduce((leader, player) => 
      player.totalScore > leader.totalScore ? player : leader
    );
  };

  const getBestRound = () => {
    if (game.rounds.length === 0) return null;
    
    let bestRound = null;
    let bestScore = -Infinity;
    let bestPlayer = null;

    game.rounds.forEach(round => {
      Object.entries(round.scores).forEach(([playerId, score]) => {
        if (score > bestScore) {
          bestScore = score;
          bestRound = round;
          bestPlayer = game.players.find(p => p.id === playerId);
        }
      });
    });

    return { round: bestRound, score: bestScore, player: bestPlayer };
  };

  const getWorstRound = () => {
    if (game.rounds.length === 0) return null;
    
    let worstRound = null;
    let worstScore = Infinity;
    let worstPlayer = null;

    game.rounds.forEach(round => {
      Object.entries(round.scores).forEach(([playerId, score]) => {
        if (score < worstScore) {
          worstScore = score;
          worstRound = round;
          worstPlayer = game.players.find(p => p.id === playerId);
        }
      });
    });

    return { round: worstRound, score: worstScore, player: worstPlayer };
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const leadingPlayer = getLeadingPlayer();
  const bestRound = getBestRound();
  const worstRound = getWorstRound();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle>Game Statistics</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-6 space-y-6 pr-2">
          {/* Player Stats */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Player Statistics</h4>
            {game.players.map((player) => {
              const stats = calculatePlayerStats(player, game.rounds);
              return (
                <div key={player.id} className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-3">{player.name}</h5>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Total Score</div>
                      <div className="font-semibold text-primary">{player.totalScore}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Average</div>
                      <div className="font-semibold">{stats.averageScore}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Highest</div>
                      <div className="font-semibold text-green-600">{stats.highestScore}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Rounds</div>
                      <div className="font-semibold">{stats.roundsPlayed}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Game Overview */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Game Overview</h4>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Rounds</span>
                <span className="font-semibold">{game.rounds.length}</span>
              </div>
              {leadingPlayer && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Leading Player</span>
                  <span className="font-semibold text-primary">{leadingPlayer.name}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Started</span>
                <span className="font-semibold">{formatTime(game.startTime)}</span>
              </div>
            </div>
          </div>

          {/* Round Highlights */}
          {game.rounds.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-900 mb-4">Round Highlights</h4>
              <div className="space-y-4">
                {bestRound && bestRound.player && (
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-sm">
                      <div className="text-green-800 font-medium mb-1">Highest Scoring Round</div>
                      <div className="text-green-700">
                        <span className="font-semibold">{bestRound.player.name}</span> scored{" "}
                        <span className="font-bold">{bestRound.score > 0 ? `+${bestRound.score}` : bestRound.score}</span>{" "}
                        in Round {bestRound.round?.number}
                      </div>
                    </div>
                  </div>
                )}
                
                {worstRound && worstRound.player && (
                  <div className="bg-red-50 rounded-lg p-4">
                    <div className="text-sm">
                      <div className="text-red-800 font-medium mb-1">Lowest Scoring Round</div>
                      <div className="text-red-700">
                        <span className="font-semibold">{worstRound.player.name}</span> scored{" "}
                        <span className="font-bold">{worstRound.score > 0 ? `+${worstRound.score}` : worstRound.score}</span>{" "}
                        in Round {worstRound.round?.number}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

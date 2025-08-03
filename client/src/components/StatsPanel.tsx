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

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const leadingPlayer = getLeadingPlayer();

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle>Game Statistics</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Player Stats */}
          {game.players.map((player) => {
            const stats = calculatePlayerStats(player, game.rounds);
            return (
              <div key={player.id} className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">{player.name}</h4>
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

          {/* Game Overview */}
          <div className="border-t border-gray-200 pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Game Overview</h4>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}

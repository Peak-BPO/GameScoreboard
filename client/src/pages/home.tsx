import React, { useState, useEffect, useRef } from "react";
import { Trophy, Plus, History, BarChart3, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Game, Player, Round } from "@shared/schema";
import { 
  gameStorage, 
  createGame, 
  createPlayer, 
  createRound, 
  updatePlayerTotals,
  calculatePlayerStats 
} from "@/lib/gameStorage";
import { ScoreEntryModal } from "@/components/ScoreEntryModal";
import { StatsPanel } from "@/components/StatsPanel";
import { SavedGamesModal } from "@/components/SavedGamesModal";

type GameView = "setup" | "game";

export default function Home() {
  const [currentView, setCurrentView] = useState<GameView>("setup");
  const [players, setPlayers] = useState<Player[]>([]);
  const [newPlayerName, setNewPlayerName] = useState("");
  const [currentGame, setCurrentGame] = useState<Game | null>(null);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [showSavedGamesModal, setShowSavedGamesModal] = useState(false);
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const { toast } = useToast();
  const newPlayerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (newPlayerInputRef.current) {
      newPlayerInputRef.current.focus();
    }
  }, [players.length]);

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast({
        title: "Invalid name",
        description: "Player name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const newPlayer = createPlayer(newPlayerName.trim());
    setPlayers([...players, newPlayer]);
    setNewPlayerName("");
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addPlayer();
    }
  };

  const startGame = () => {
    if (players.length < 2) {
      toast({
        title: "Need more players",
        description: "At least 2 players are required to start a game",
        variant: "destructive",
      });
      return;
    }

    const game = createGame(players);
    setCurrentGame(game);
    setCurrentView("game");
    gameStorage.saveGame(game);
  };

  const endGame = () => {
    if (currentGame) {
      const finalGame = {
        ...currentGame,
        endTime: Date.now(),
      };
      gameStorage.saveGame(finalGame);
    }
    
    setCurrentGame(null);
    setPlayers([]);
    setCurrentView("setup");
    setShowStatsPanel(false);
  };

  const saveRoundScores = (scores: Record<string, number>) => {
    if (!currentGame) return;

    const roundNumber = editingRound ? editingRound.number : currentGame.currentRound + 1;
    const newRound = createRound(roundNumber, scores);

    let updatedRounds: Round[];
    if (editingRound) {
      // Update existing round
      updatedRounds = currentGame.rounds.map(r => 
        r.id === editingRound.id ? newRound : r
      );
    } else {
      // Add new round at the beginning (newest first)
      updatedRounds = [newRound, ...currentGame.rounds];
    }

    const updatedPlayers = updatePlayerTotals(currentGame.players, updatedRounds);
    
    const updatedGame = {
      ...currentGame,
      players: updatedPlayers,
      rounds: updatedRounds,
      currentRound: editingRound ? currentGame.currentRound : currentGame.currentRound + 1,
    };

    setCurrentGame(updatedGame);
    gameStorage.saveGame(updatedGame);
    setShowScoreModal(false);
    setEditingRound(null);

    toast({
      title: editingRound ? "Round updated" : "Round saved",
      description: `Round ${roundNumber} scores have been recorded`,
    });
  };

  const editRound = (round: Round) => {
    setEditingRound(round);
    setShowScoreModal(true);
  };

  const loadGame = (game: Game) => {
    setCurrentGame(game);
    setPlayers(game.players);
    setCurrentView("game");
    setShowSavedGamesModal(false);
  };

  const getScoreColor = (score: number) => {
    if (score > 0) return "bg-green-100 text-green-800 hover:bg-green-200";
    if (score < 0) return "bg-red-100 text-red-800 hover:bg-red-200";
    return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  };

  const formatScore = (score: number) => {
    return score > 0 ? `+${score}` : score.toString();
  };

  if (currentView === "setup") {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Trophy className="text-primary-foreground text-sm" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">GameScore Pro</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSavedGamesModal(true)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <History className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Setup View */}
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Set Up New Game</h2>
              <p className="text-gray-600">Add players to start tracking scores</p>
            </div>

            <div className="space-y-4 mb-8">
              {players.map((player, index) => (
                <div key={player.id} className="flex items-center space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <Input
                    value={player.name}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePlayer(player.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">{players.length + 1}</span>
                </div>
                <Input
                  ref={newPlayerInputRef}
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter player name..."
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={addPlayer}
                  disabled={!newPlayerName.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                onClick={addPlayer}
                disabled={!newPlayerName.trim()}
                className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Player (Press Enter in field above)
              </Button>
            </div>

            <Button
              onClick={startGame}
              disabled={players.length < 2}
              className="w-full py-4"
            >
              Start Game
            </Button>
          </Card>
        </div>

        <SavedGamesModal
          open={showSavedGamesModal}
          onClose={() => setShowSavedGamesModal(false)}
          onLoadGame={loadGame}
        />
      </div>
    );
  }

  if (!currentGame) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Trophy className="text-primary-foreground text-sm" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">GameScore Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSavedGamesModal(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <History className="h-5 w-5" />
              </Button>
              <Button
                onClick={() => setShowStatsPanel(true)}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Stats</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Game View */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Game Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Current Game</h2>
            <p className="text-gray-600 text-sm">
              Round {currentGame.currentRound} • {currentGame.players.length} Players
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={endGame}
              className="text-gray-600 hover:text-gray-800"
            >
              End Game
            </Button>
          </div>
        </div>

        {/* Score Table */}
        <Card className="overflow-hidden">
          {/* Frozen Header with Totals */}
          <div className="bg-gray-50 border-b border-gray-200 sticky top-16 z-40">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 px-4 font-medium text-gray-900 w-20">Round</th>
                    {currentGame.players.map((player) => (
                      <th key={player.id} className="text-center py-4 px-4 min-w-28">
                        <div className="space-y-1">
                          <div className="font-medium text-gray-900">{player.name}</div>
                          <div className="text-2xl font-bold text-primary">{player.totalScore}</div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          </div>

          {/* Score Rounds */}
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100">
                {currentGame.rounds.length === 0 ? (
                  <tr>
                    <td colSpan={currentGame.players.length + 1} className="py-8 text-center text-gray-500">
                      No rounds yet. Click "New Round" to start recording scores.
                    </td>
                  </tr>
                ) : (
                  currentGame.rounds.map((round) => (
                    <tr key={round.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm font-medium text-gray-900">
                        {round.number}
                      </td>
                      {currentGame.players.map((player) => (
                        <td key={player.id} className="py-3 px-4 text-center">
                          <button
                            onClick={() => editRound(round)}
                            className={`inline-flex items-center justify-center w-12 h-8 rounded font-mono text-sm cursor-pointer transition-colors ${getScoreColor(round.scores[player.id] || 0)}`}
                          >
                            {formatScore(round.scores[player.id] || 0)}
                          </button>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Floating Action Button for Score Entry */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button 
            onClick={() => setShowScoreModal(true)}
            size="lg"
            className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Modals and Panels */}
      <ScoreEntryModal
        open={showScoreModal}
        onClose={() => {
          setShowScoreModal(false);
          setEditingRound(null);
        }}
        players={currentGame.players}
        onSave={saveRoundScores}
        editingRound={editingRound}
      />

      <StatsPanel
        open={showStatsPanel}
        onClose={() => setShowStatsPanel(false)}
        game={currentGame}
      />

      <SavedGamesModal
        open={showSavedGamesModal}
        onClose={() => setShowSavedGamesModal(false)}
        onLoadGame={loadGame}
      />
    </div>
  );
}

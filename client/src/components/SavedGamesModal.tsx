import React from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Game } from "@shared/schema";
import { gameStorage } from "@/lib/gameStorage";

interface SavedGamesModalProps {
  open: boolean;
  onClose: () => void;
  onLoadGame: (game: Game) => void;
}

export function SavedGamesModal({ open, onClose, onLoadGame }: SavedGamesModalProps) {
  const [savedGames, setSavedGames] = React.useState<Game[]>([]);
  const { toast } = useToast();

  React.useEffect(() => {
    if (open) {
      setSavedGames(gameStorage.getAllGames());
    }
  }, [open]);

  const handleLoadGame = (game: Game) => {
    onLoadGame(game);
  };

  const handleDeleteGame = (e: React.MouseEvent, gameId: string) => {
    e.stopPropagation();
    
    if (confirm("Are you sure you want to delete this game?")) {
      gameStorage.deleteGame(gameId);
      setSavedGames(gameStorage.getAllGames());
      toast({
        title: "Game deleted",
        description: "The game has been removed from your saved games",
      });
    }
  };

  const handleClearAllGames = () => {
    if (confirm("Are you sure you want to clear all saved games? This action cannot be undone.")) {
      gameStorage.clearAllGames();
      setSavedGames([]);
      toast({
        title: "All games cleared",
        description: "All saved games have been removed",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getGameWinner = (game: Game) => {
    if (game.players.length === 0) return null;
    return game.players.reduce((winner, player) => 
      player.totalScore > winner.totalScore ? player : winner
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Saved Games</DialogTitle>
          <DialogDescription>
            Load a previously saved game or delete games you no longer need.
          </DialogDescription>
        </DialogHeader>

        {savedGames.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No saved games yet.</p>
            <p className="text-sm">Your completed games will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedGames.map((game) => {
              const winner = getGameWinner(game);
              return (
                <div
                  key={game.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleLoadGame(game)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-900">{game.name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {game.rounds.length} rounds • {formatDate(game.startTime)}
                      </div>
                      {winner && (
                        <div className="text-sm text-gray-500 mt-1">
                          Winner: <span className="text-primary font-medium">
                            {winner.name} ({winner.totalScore} pts)
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => handleDeleteGame(e, game.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {savedGames.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={handleClearAllGames}
              className="w-full text-gray-600"
            >
              Clear All Saved Games
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Player, Round } from "@shared/schema";

interface ScoreEntryModalProps {
  open: boolean;
  onClose: () => void;
  players: Player[];
  onSave: (scores: Record<string, number>) => void;
  editingRound?: Round | null;
}

export function ScoreEntryModal({ open, onClose, players, onSave, editingRound }: ScoreEntryModalProps) {
  const [scores, setScores] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      if (editingRound) {
        // Pre-fill with existing scores
        const initialScores: Record<string, string> = {};
        players.forEach(player => {
          initialScores[player.id] = (editingRound.scores[player.id] || 0).toString();
        });
        setScores(initialScores);
      } else {
        // Reset scores for new round
        const initialScores: Record<string, string> = {};
        players.forEach(player => {
          initialScores[player.id] = "";
        });
        setScores(initialScores);
      }
    }
  }, [open, players, editingRound]);

  const handleScoreChange = (playerId: string, value: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: value,
    }));
  };

  const skipPlayer = (playerId: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: "0",
    }));
  };

  const handleSave = () => {
    const finalScores: Record<string, number> = {};
    let hasError = false;

    // Validate and convert scores
    for (const player of players) {
      const scoreString = scores[player.id] || "0";
      const score = parseInt(scoreString, 10);
      
      if (scoreString !== "" && isNaN(score)) {
        toast({
          title: "Invalid score",
          description: `Please enter a valid number for ${player.name}`,
          variant: "destructive",
        });
        hasError = true;
        break;
      }
      
      finalScores[player.id] = scoreString === "" ? 0 : score;
    }

    if (!hasError) {
      onSave(finalScores);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingRound ? `Edit Round ${editingRound.number}` : "Enter Round Scores"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mb-6">
          {players.map((player) => (
            <div key={player.id} className="flex items-center space-x-4">
              <div className="flex-1">
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  {player.name}
                </Label>
                <Input
                  type="number"
                  placeholder="Enter score..."
                  value={scores[player.id] || ""}
                  onChange={(e) => handleScoreChange(player.id, e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skipPlayer(player.id)}
                className="text-gray-400 hover:text-primary"
              >
                Skip
              </Button>
            </div>
          ))}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
          >
            {editingRound ? "Update Round" : "Save Round"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

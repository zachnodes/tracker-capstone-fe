import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { X } from "lucide-react";

// All playable SSBM characters
const characters = [
  "Fox",
  "Falco",
  "Marth",
  "Sheik",
  "Jigglypuff",
  "Peach",
  "Captain Falcon",
  "Ice Climbers",
  "Pikachu",
  "Samus",
  "Dr. Mario",
  "Yoshi",
  "Luigi",
  "Ganondorf",
  "Mario",
  "Young Link",
  "Donkey Kong",
  "Link",
  "Mr. Game & Watch",
  "Roy",
  "Mewtwo",
  "Zelda",
  "Ness",
  "Pichu",
  "Bowser",
  "Kirby",
];

// Tournament legal stages
const stages = [
  "Battlefield",
  "Final Destination",
  "Dream Land",
  "Fountain of Dreams",
  "Yoshi's Story",
  "Pokemon Stadium",
];

interface AddMatchFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (matchData: MatchFormData) => void;
}

export interface MatchFormData {
  date: string;
  opponentName: string;
  myCharacter: string;
  opponentCharacter: string;
  stage: string;
  winner: "me" | "opponent";
  score: string;
  notes: string;
}

export function AddMatchForm({ open, onClose, onSubmit }: AddMatchFormProps) {
  const [formData, setFormData] = useState<MatchFormData>({
    date: new Date().toISOString().split('T')[0],
    opponentName: "",
    myCharacter: "",
    opponentCharacter: "",
    stage: "",
    winner: "me",
    score: "",
    notes: "",
  });

  const [notesLength, setNotesLength] = useState(0);
  const maxNotesLength = 140;

  const handleNotesChange = (value: string) => {
    if (value.length <= maxNotesLength) {
      setFormData({ ...formData, notes: value });
      setNotesLength(value.length);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      opponentName: "",
      myCharacter: "",
      opponentCharacter: "",
      stage: "",
      winner: "me",
      score: "",
      notes: "",
    });
    setNotesLength(0);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Add Match Record</DialogTitle>
          <DialogDescription className="text-slate-400">
            Manually enter details about your match
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-slate-200">
              Match Date
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white focus:border-red-500"
              required
            />
          </div>

          {/* Opponent Name */}
          <div className="space-y-2">
            <Label htmlFor="opponent" className="text-slate-200">
              Opponent Name/Tag
            </Label>
            <Input
              id="opponent"
              type="text"
              placeholder="e.g., Mango, Zain, Hungrybox"
              value={formData.opponentName}
              onChange={(e) => setFormData({ ...formData, opponentName: e.target.value })}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
              required
            />
          </div>

          {/* Characters Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="myCharacter" className="text-slate-200">
                Your Character
              </Label>
              <Select
                value={formData.myCharacter}
                onValueChange={(value) => setFormData({ ...formData, myCharacter: value })}
                required
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-red-500">
                  <SelectValue placeholder="Select your character" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
                  {characters.map((character) => (
                    <SelectItem 
                      key={character} 
                      value={character}
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      {character}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="opponentCharacter" className="text-slate-200">
                Opponent Character
              </Label>
              <Select
                value={formData.opponentCharacter}
                onValueChange={(value) => setFormData({ ...formData, opponentCharacter: value })}
                required
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-red-500">
                  <SelectValue placeholder="Select opponent's character" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white max-h-[300px]">
                  {characters.map((character) => (
                    <SelectItem 
                      key={character} 
                      value={character}
                      className="focus:bg-slate-700 focus:text-white"
                    >
                      {character}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stage */}
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-slate-200">
              Stage
            </Label>
            <Select
              value={formData.stage}
              onValueChange={(value) => setFormData({ ...formData, stage: value })}
              required
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-red-500">
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {stages.map((stage) => (
                  <SelectItem 
                    key={stage} 
                    value={stage}
                    className="focus:bg-slate-700 focus:text-white"
                  >
                    {stage}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Winner and Score Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="winner" className="text-slate-200">
                Set Winner
              </Label>
              <Select
                value={formData.winner}
                onValueChange={(value) => setFormData({ ...formData, winner: value as "me" | "opponent" })}
                required
              >
                <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-red-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="me" className="focus:bg-slate-700 focus:text-white">
                    You Won
                  </SelectItem>
                  <SelectItem value="opponent" className="focus:bg-slate-700 focus:text-white">
                    Opponent Won
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="score" className="text-slate-200">
                Score (e.g., 3-2)
              </Label>
              <Input
                id="score"
                type="text"
                placeholder="3-2"
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="notes" className="text-slate-200">
                Notes (Optional)
              </Label>
              <span className={`text-sm ${notesLength >= maxNotesLength ? 'text-red-400' : 'text-slate-400'}`}>
                {notesLength}/{maxNotesLength}
              </span>
            </div>
            <Textarea
              id="notes"
              placeholder="Add notes about the match, key moments, what you learned, etc."
              value={formData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500 resize-none"
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Save Match
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

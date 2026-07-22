import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { Badge } from "./ui/badge";
import { Download, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Checkbox } from "./ui/checkbox";
import { ErrorModal } from "./ErrorModal";

interface ImportStartGGModalProps {
  open: boolean;
  onClose: () => void;
  onImport: (matches: ImportedMatch[]) => void;
}

export interface ImportedMatch {
  date: string;
  opponent: string;
  result: "Win" | "Loss";
  score: string;
  tournament: string;
  round: string;
  myCharacter: string;
  opponentCharacter: string;
  stage: string;
}

// Mock data for preview
const mockMatches: ImportedMatch[] = [
  {
    date: "2026-03-28",
    opponent: "Mango",
    result: "Loss",
    score: "1-3",
    tournament: "Genesis 9",
    round: "Winners R2",
    myCharacter: "Unknown",
    opponentCharacter: "Unknown",
    stage: "Unknown",
  },
  {
    date: "2026-03-28",
    opponent: "Plup",
    result: "Win",
    score: "3-2",
    tournament: "Genesis 9",
    round: "Winners R1",
    myCharacter: "Unknown",
    opponentCharacter: "Unknown",
    stage: "Unknown",
  },
  {
    date: "2026-03-27",
    opponent: "Zain",
    result: "Loss",
    score: "0-3",
    tournament: "Genesis 9",
    round: "Losers R3",
    myCharacter: "Unknown",
    opponentCharacter: "Unknown",
    stage: "Unknown",
  },
  {
    date: "2026-03-27",
    opponent: "iBDW",
    result: "Win",
    score: "3-1",
    tournament: "Genesis 9",
    round: "Losers R2",
    myCharacter: "Unknown",
    opponentCharacter: "Unknown",
    stage: "Unknown",
  },
];

export function ImportStartGGModal({ open, onClose, onImport }: ImportStartGGModalProps) {
  const [step, setStep] = useState<"auth" | "loading" | "preview">("auth");
  const [apiKey, setApiKey] = useState("");
  const [username, setUsername] = useState("");
  const [importMethod, setImportMethod] = useState<"tournament" | "recent" | "daterange">("tournament");
  const [tournamentSlug, setTournamentSlug] = useState("");
  const [recentDays, setRecentDays] = useState("30");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMatches, setSelectedMatches] = useState<Set<number>>(new Set());
  const [selectAll, setSelectAll] = useState(true);
  const [showError, setShowError] = useState(false);
  const [errorDetails, setErrorDetails] = useState({ title: "", message: "", details: "" });

  const handleFetchMatches = () => {
    // Simulate API call with random success/failure
    setStep("loading");
    setTimeout(() => {
      // Temporarily set to always fail so you can see the error modal
      const shouldFail = true; // Change back to: Math.random() < 0.3 for 30% failure rate
      
      if (shouldFail) {
        setStep("auth");
        setErrorDetails({
          title: "Import Failed",
          message: "Unable to fetch matches from start.gg. Please check your API token and username.",
          details: "Error: Invalid API token or user not found. Status code: 401"
        });
        setShowError(true);
      } else {
        // Initialize all matches as selected
        setSelectedMatches(new Set(mockMatches.map((_, i) => i)));
        setStep("preview");
      }
    }, 2000);
  };

  const handleImport = () => {
    const matchesToImport = mockMatches.filter((_, index) => selectedMatches.has(index));
    onImport(matchesToImport);
    // Reset state
    setStep("auth");
    setApiKey("");
    setUsername("");
    setTournamentSlug("");
    setSelectedMatches(new Set());
    setSelectAll(true);
    onClose();
  };

  const toggleMatch = (index: number) => {
    const newSelected = new Set(selectedMatches);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedMatches(newSelected);
    setSelectAll(newSelected.size === mockMatches.length);
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedMatches(new Set());
    } else {
      setSelectedMatches(new Set(mockMatches.map((_, i) => i)));
    }
    setSelectAll(!selectAll);
  };

  const resetAndClose = () => {
    setStep("auth");
    setApiKey("");
    setUsername("");
    setTournamentSlug("");
    setSelectedMatches(new Set());
    setSelectAll(true);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={resetAndClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-900 text-white">
        {step === "auth" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-white flex items-center gap-2">
                <Download className="w-6 h-6 text-red-500" />
                Import from start.gg
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Import your tournament matches from start.gg API
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Info Alert */}
              <div className="flex gap-3 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-blue-400 mb-1">API Key Required</p>
                  <p>
                    You'll need a start.gg API token. Get yours at{" "}
                    <a
                      href="https://start.gg/admin/profile/developer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 underline"
                    >
                      start.gg/admin/profile/developer
                    </a>
                  </p>
                </div>
              </div>

              {/* API Key Input */}
              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-slate-200">
                  Start.gg API Token *
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="Enter your API token"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                  required
                />
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <Label htmlFor="username" className="text-slate-200">
                  Your Start.gg Username/Tag *
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="e.g., Mango, Zain"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                  required
                />
              </div>

              {/* Import Method Tabs */}
              <div className="space-y-2">
                <Label className="text-slate-200">Import Method</Label>
                <Tabs value={importMethod} onValueChange={(value) => setImportMethod(value as any)} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                    <TabsTrigger value="tournament" className="data-[state=active]:bg-red-600">
                      Tournament
                    </TabsTrigger>
                    <TabsTrigger value="recent" className="data-[state=active]:bg-red-600">
                      Recent
                    </TabsTrigger>
                    <TabsTrigger value="daterange" className="data-[state=active]:bg-red-600">
                      Date Range
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="tournament" className="space-y-2 mt-4">
                    <Label htmlFor="tournament" className="text-slate-200">
                      Tournament Slug
                    </Label>
                    <Input
                      id="tournament"
                      type="text"
                      placeholder="e.g., genesis-9, super-smash-con-2023"
                      value={tournamentSlug}
                      onChange={(e) => setTournamentSlug(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500 focus:border-red-500"
                    />
                    <p className="text-xs text-slate-400">
                      Found in the tournament URL: start.gg/tournament/<span className="text-blue-400">tournament-slug</span>
                    </p>
                  </TabsContent>

                  <TabsContent value="recent" className="space-y-2 mt-4">
                    <Label htmlFor="recentDays" className="text-slate-200">
                      Import matches from the last
                    </Label>
                    <Select value={recentDays} onValueChange={setRecentDays}>
                      <SelectTrigger className="bg-slate-800 border-slate-700 text-white focus:border-red-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700 text-white">
                        <SelectItem value="7" className="focus:bg-slate-700 focus:text-white">7 days</SelectItem>
                        <SelectItem value="14" className="focus:bg-slate-700 focus:text-white">14 days</SelectItem>
                        <SelectItem value="30" className="focus:bg-slate-700 focus:text-white">30 days</SelectItem>
                        <SelectItem value="60" className="focus:bg-slate-700 focus:text-white">60 days</SelectItem>
                        <SelectItem value="90" className="focus:bg-slate-700 focus:text-white">90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </TabsContent>

                  <TabsContent value="daterange" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate" className="text-slate-200">
                          Start Date
                        </Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-red-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endDate" className="text-slate-200">
                          End Date
                        </Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white focus:border-red-500"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Warning Alert */}
              <div className="flex gap-3 p-4 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-slate-300">
                  <p className="font-medium text-yellow-400 mb-1">Note About Imported Data</p>
                  <p>
                    start.gg typically doesn't include character selections or stage information. 
                    These fields will be marked as "Unknown" and you can edit them manually later.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAndClose}
                  className="flex-1 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleFetchMatches}
                  disabled={!apiKey || !username}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Fetch Matches
                </Button>
              </div>
            </div>
          </>
        )}

        {step === "loading" && (
          <div className="py-12 flex flex-col items-center justify-center">
            <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Fetching Matches...</h3>
            <p className="text-slate-400 text-center">
              Retrieving your match history from start.gg
            </p>
          </div>
        )}

        {step === "preview" && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-white flex items-center gap-2">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
                Review Matches
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Select which matches you want to import ({selectedMatches.size} of {mockMatches.length} selected)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Select All Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                <Checkbox
                  id="selectAll"
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                  className="border-slate-600"
                />
                <Label htmlFor="selectAll" className="text-slate-200 cursor-pointer">
                  Select All Matches
                </Label>
              </div>

              {/* Match List */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {mockMatches.map((match, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                      selectedMatches.has(index)
                        ? "bg-slate-800 border-red-700"
                        : "bg-slate-800/30 border-slate-700 hover:bg-slate-800/50"
                    }`}
                    onClick={() => toggleMatch(index)}
                  >
                    <Checkbox
                      checked={selectedMatches.has(index)}
                      onCheckedChange={() => toggleMatch(index)}
                      className="mt-1 border-slate-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="text-white font-medium">vs {match.opponent}</span>
                          <Badge
                            variant={match.result === "Win" ? "default" : "destructive"}
                            className={
                              match.result === "Win"
                                ? "bg-green-900 text-green-200"
                                : "bg-red-900 text-red-200"
                            }
                          >
                            {match.result}
                          </Badge>
                          <span className="text-slate-400 text-sm">{match.score}</span>
                        </div>
                        <span className="text-slate-400 text-sm">
                          {new Date(match.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        <span className="text-purple-400">{match.tournament}</span> • {match.round}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Characters & Stage: {match.myCharacter} vs {match.opponentCharacter} on {match.stage}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Warning about unknown data */}
              <div className="flex gap-3 p-3 bg-yellow-900/20 border border-yellow-800 rounded-lg">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300">
                  Character and stage data is not available from start.gg. You can edit these matches after importing.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("auth")}
                  className="flex-1 border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleImport}
                  disabled={selectedMatches.size === 0}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Import {selectedMatches.size} {selectedMatches.size === 1 ? "Match" : "Matches"}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>

      {/* Error Modal */}
      <ErrorModal
        open={showError}
        onClose={() => setShowError(false)}
        title={errorDetails.title}
        message={errorDetails.message}
        details={errorDetails.details}
      />
    </Dialog>
  );
}
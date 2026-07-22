import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  Trophy,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  LogOut,
  User,
  Gamepad2,
  BarChart3,
  Calendar,
  Target,
  Play,
  Upload
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { AddMatchForm, MatchFormData } from "./AddMatchForm";
import { Analytics } from "./Analytics";
import { ImportStartGGModal, ImportedMatch } from "./ImportStartGGModal";
import { GameViewer } from "./GameViewer";
import { UploadSlpModal } from "./UploadSlpModal";

// Mock data for recent matches
const recentMatches = [
  { id: 1, date: "2026-03-30", opponent: "Mango", myCharacter: "Fox", opponentCharacter: "Falco", stage: "Battlefield", result: "Win", score: "3-2" },
  { id: 2, date: "2026-03-30", opponent: "Zain", myCharacter: "Fox", opponentCharacter: "Marth", stage: "Final Destination", result: "Loss", score: "1-3" },
  { id: 3, date: "2026-03-29", opponent: "iBDW", myCharacter: "Fox", opponentCharacter: "Fox", stage: "Yoshi's Story", result: "Win", score: "3-1" },
  { id: 4, date: "2026-03-29", opponent: "Plup", myCharacter: "Falco", opponentCharacter: "Sheik", stage: "Pokemon Stadium", result: "Loss", score: "2-3" },
  { id: 5, date: "2026-03-28", opponent: "Hungrybox", myCharacter: "Fox", opponentCharacter: "Jigglypuff", stage: "Dream Land", result: "Win", score: "3-0" },
];

// Mock statistics
const stats = {
  totalMatches: 127,
  wins: 78,
  losses: 49,
  winRate: 61.4,
  currentStreak: 2,
  streakType: "win" as const,
  favoriteCharacter: "Fox",
  bestMatchup: "Jigglypuff (75%)",
  worstMatchup: "Marth (45%)",
};

interface DashboardProps {
  username?: string;
  onLogout: () => void;
}

export function Dashboard({ username = "Player1", onLogout }: DashboardProps) {
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [newMatch, setNewMatch] = useState<MatchFormData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGameViewer, setShowGameViewer] = useState(false);
  const [showUploadSlp, setShowUploadSlp] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importedMatches, setImportedMatches] = useState<ImportedMatch[]>([]);

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  if (showGameViewer) {
    return <GameViewer onBack={() => setShowGameViewer(false)} />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Gamepad2 className="w-8 h-8 text-red-500" />
                <Trophy className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Melee Tracker</h1>
                <p className="text-xs text-slate-400">Performance Analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-white text-sm font-medium">{username}</span>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="sm"
                className="text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Total Matches</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.totalMatches}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>All time</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Win Rate</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.winRate}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-green-400 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>{stats.wins}W - {stats.losses}L</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Current Streak</CardDescription>
              <CardTitle className="text-3xl text-white">
                {stats.currentStreak}
                <span className="text-lg ml-1">{stats.streakType === "win" ? "W" : "L"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-2 text-sm ${stats.streakType === "win" ? "text-green-400" : "text-red-400"}`}>
                {stats.streakType === "win" ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span>{stats.streakType === "win" ? "On fire!" : "Keep grinding"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardDescription className="text-slate-400">Main Character</CardDescription>
              <CardTitle className="text-3xl text-white">{stats.favoriteCharacter}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Target className="w-4 h-4" />
                <span>Most played</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowAddMatch(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Match
          </Button>
          <Button 
            variant="outline" 
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            onClick={() => setShowImportModal(true)}
          >
            <Download className="w-4 h-4 mr-2" />
            Import from start.gg
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            onClick={() => setShowAnalytics(true)}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
          <Button
            variant="outline"
            className="border-slate-700 bg-slate-800 text-white hover:bg-slate-700"
            onClick={() => setShowGameViewer(true)}
          >
            <Play className="w-4 h-4 mr-2" />
            Watch Match
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => setShowUploadSlp(true)}
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload VOD
          </Button>
        </div>

        {/* Matchup Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Best Matchup
              </CardTitle>
              <CardDescription className="text-slate-400">
                Your strongest opponent character
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">vs {stats.bestMatchup.split(" ")[0]}</div>
              <div className="text-green-400 text-lg">{stats.bestMatchup.split(" ")[1]}</div>
              <p className="text-slate-400 text-sm mt-2">Keep capitalizing on this advantage</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-red-500" />
                Needs Work
              </CardTitle>
              <CardDescription className="text-slate-400">
                Focus area for improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white mb-2">vs {stats.worstMatchup.split(" ")[0]}</div>
              <div className="text-red-400 text-lg">{stats.worstMatchup.split(" ")[1]}</div>
              <p className="text-slate-400 text-sm mt-2">Practice this matchup to improve</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Matches Table */}
        <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Recent Matches</CardTitle>
            <CardDescription className="text-slate-400">
              Your last 5 recorded matches
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-slate-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-slate-800/50">
                    <TableHead className="text-slate-300">Date</TableHead>
                    <TableHead className="text-slate-300">Opponent</TableHead>
                    <TableHead className="text-slate-300">Matchup</TableHead>
                    <TableHead className="text-slate-300">Stage</TableHead>
                    <TableHead className="text-slate-300">Score</TableHead>
                    <TableHead className="text-slate-300">Result</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentMatches.map((match) => (
                    <TableRow 
                      key={match.id} 
                      className="border-slate-800 hover:bg-slate-800/50 cursor-pointer"
                    >
                      <TableCell className="text-slate-400">
                        {new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell className="text-white font-medium">{match.opponent}</TableCell>
                      <TableCell className="text-slate-300">
                        <span className="text-blue-400">{match.myCharacter}</span> vs{" "}
                        <span className="text-purple-400">{match.opponentCharacter}</span>
                      </TableCell>
                      <TableCell className="text-slate-400">{match.stage}</TableCell>
                      <TableCell className="text-slate-300">{match.score}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={match.result === "Win" ? "default" : "destructive"}
                          className={match.result === "Win" 
                            ? "bg-green-900 text-green-200 hover:bg-green-800" 
                            : "bg-red-900 text-red-200 hover:bg-red-800"
                          }
                        >
                          {match.result}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4 text-center">
              <Button 
                variant="ghost" 
                className="text-red-400 hover:text-red-300 hover:bg-slate-800"
              >
                View All Matches →
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add Match Form */}
      <AddMatchForm
        open={showAddMatch}
        onClose={() => setShowAddMatch(false)}
        onSubmit={(formData) => {
          setNewMatch(formData);
          setShowAddMatch(false);
        }}
      />

      {/* Import StartGG Modal */}
      <ImportStartGGModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(matches) => {
          setImportedMatches(matches);
          setShowImportModal(false);
        }}
      />

      {/* Upload SLP Modal */}
      <UploadSlpModal
        open={showUploadSlp}
        onClose={() => setShowUploadSlp(false)}
      />
    </div>
  );
}
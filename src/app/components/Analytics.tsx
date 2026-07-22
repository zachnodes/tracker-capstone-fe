import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Target,
  Award,
  Zap,
  Calendar,
} from "lucide-react";

// Mock data for charts
const weeklyPerformanceData = [
  { week: "Week 1", wins: 12, losses: 8, winRate: 60 },
  { week: "Week 2", wins: 15, losses: 6, winRate: 71 },
  { week: "Week 3", wins: 10, losses: 9, winRate: 53 },
  { week: "Week 4", wins: 14, losses: 7, winRate: 67 },
  { week: "Week 5", wins: 18, losses: 5, winRate: 78 },
  { week: "Week 6", wins: 9, losses: 10, winRate: 47 },
];

const characterUsageData = [
  { character: "Fox", matches: 45, color: "#FF6B35" },
  { character: "Falco", matches: 28, color: "#4ECDC4" },
  { character: "Marth", matches: 22, color: "#6C5CE7" },
  { character: "Sheik", matches: 18, color: "#F9CA24" },
  { character: "Captain Falcon", matches: 14, color: "#00D2D3" },
];

const matchupData = [
  { opponent: "Fox", wins: 15, losses: 10, winRate: 60 },
  { opponent: "Falco", wins: 12, losses: 8, winRate: 60 },
  { opponent: "Marth", wins: 8, losses: 12, winRate: 40 },
  { opponent: "Sheik", wins: 10, losses: 9, winRate: 53 },
  { opponent: "Jigglypuff", wins: 18, losses: 6, winRate: 75 },
  { opponent: "Peach", wins: 11, losses: 8, winRate: 58 },
];

const stageData = [
  { stage: "Battlefield", wins: 22, losses: 15 },
  { stage: "Final Destination", wins: 18, losses: 12 },
  { stage: "Dream Land", wins: 15, losses: 10 },
  { stage: "Fountain of Dreams", wins: 12, losses: 8 },
  { stage: "Yoshi's Story", wins: 8, losses: 6 },
  { stage: "Pokemon Stadium", wins: 6, losses: 4 },
];

interface AnalyticsProps {
  onBack: () => void;
}

export function Analytics({ onBack }: AnalyticsProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Grid Pattern */}
      <div className="fixed inset-0 z-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">Performance Analytics</h1>
              <p className="text-sm text-slate-400">Detailed insights into your gameplay</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        {/* Key Insights Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-slate-400">Current Form</CardDescription>
                <TrendingUp className="w-4 h-4 text-green-500" />
              </div>
              <CardTitle className="text-2xl text-white">Improving</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">+15% win rate this month</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-slate-400">Best Day</CardDescription>
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-white">Friday</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">68% win rate on Fridays</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-slate-400">Avg Games/Day</CardDescription>
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <CardTitle className="text-2xl text-white">8.3</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Consistent activity</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardDescription className="text-slate-400">Peak Rank</CardDescription>
                <Award className="w-4 h-4 text-purple-500" />
              </div>
              <CardTitle className="text-2xl text-white">#47</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-400">Regional ranking</p>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Performance Line Chart */}
        <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white">Weekly Performance Trend</CardTitle>
            <CardDescription className="text-slate-400">
              Win rate and match results over the past 6 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={weeklyPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="week" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="wins"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Wins"
                />
                <Line
                  type="monotone"
                  dataKey="losses"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Losses"
                />
                <Line
                  type="monotone"
                  dataKey="winRate"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Win Rate %"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Character Usage and Matchup Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Character Usage Pie Chart */}
          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Character Usage</CardTitle>
              <CardDescription className="text-slate-400">
                Distribution of characters you've played
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={characterUsageData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ character, percent }) =>
                      `${character} ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="matches"
                  >
                    {characterUsageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Matchup Win Rates */}
          <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Matchup Win Rates</CardTitle>
              <CardDescription className="text-slate-400">
                Performance against different characters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={matchupData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="opponent" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1e293b",
                      border: "1px solid #334155",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="wins" fill="#22c55e" name="Wins" />
                  <Bar dataKey="losses" fill="#ef4444" name="Losses" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Stage Performance */}
        <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm mb-8">
          <CardHeader>
            <CardTitle className="text-white">Stage Performance</CardTitle>
            <CardDescription className="text-slate-400">
              Your win/loss record on each tournament legal stage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="stage" type="category" stroke="#94a3b8" width={150} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    border: "1px solid #334155",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend />
                <Bar dataKey="wins" fill="#22c55e" name="Wins" />
                <Bar dataKey="losses" fill="#ef4444" name="Losses" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Detailed Matchup Stats Table */}
        <Card className="border-slate-800 bg-slate-900/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Detailed Matchup Statistics</CardTitle>
            <CardDescription className="text-slate-400">
              Complete breakdown of your performance vs each character
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {matchupData.map((matchup) => (
                <div
                  key={matchup.opponent}
                  className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-slate-700 hover:bg-slate-800 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <Target className="w-5 h-5 text-slate-400" />
                    <div>
                      <div className="text-white font-medium">vs {matchup.opponent}</div>
                      <div className="text-sm text-slate-400">
                        {matchup.wins}W - {matchup.losses}L
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{matchup.winRate}%</div>
                      <div className="text-xs text-slate-400">Win Rate</div>
                    </div>
                    <Badge
                      variant={matchup.winRate >= 60 ? "default" : matchup.winRate >= 50 ? "secondary" : "destructive"}
                      className={
                        matchup.winRate >= 60
                          ? "bg-green-900 text-green-200"
                          : matchup.winRate >= 50
                          ? "bg-yellow-900 text-yellow-200"
                          : "bg-red-900 text-red-200"
                      }
                    >
                      {matchup.winRate >= 60 ? (
                        <>
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Strong
                        </>
                      ) : matchup.winRate >= 50 ? (
                        "Even"
                      ) : (
                        <>
                          <TrendingDown className="w-3 h-3 mr-1" />
                          Weak
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

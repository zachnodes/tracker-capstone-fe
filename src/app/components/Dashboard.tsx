// src/app/components/Dashboard.tsx
import { useState } from 'react';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  EmojiEvents as Trophy,
  TrendingUp,
  TrendingDown,
  Add as Plus,
  Download,
  Logout as LogOut,
  Person as User,
  SportsEsports as Gamepad2,
  BarChart as BarChart3,
  CalendarMonth as Calendar,
  GpsFixed as Target,
  PlayArrow as Play,
  Upload,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '../hooks/useAuth';
import { AddMatchForm, MatchFormData } from './AddMatchForm';
import { Analytics } from './Analytics';
import { ImportStartGGModal, ImportedMatch } from './ImportStartGGModal';
import { GameViewer } from './GameViewer';
import { UploadSlpModal } from './UploadSlpModal';
import { useLogout } from '../hooks/useLogout';
import { SetRecord, isWin, winPct, MatchSource } from '../types/sets';
import { useSets } from '../hooks/useSets';

const stats = {
  totalMatches: 127,
  wins: 78,
  losses: 49,
  winRate: 61.4,
  currentStreak: 2,
  streakType: 'win' as const,
  favoriteCharacter: 'Fox',
  bestMatchup: 'Jigglypuff (75%)',
  worstMatchup: 'Marth (45%)',
};

const cardSx = {
  border: '1px solid #1e293b',
  bgcolor: 'rgba(15, 23, 42, 0.9)',
  backdropFilter: 'blur(8px)',
};

function getStreak(sorted: SetRecord[]) {
  if (sorted.length === 0) {
    return 0;
  }
  let count = 0;
  for (const match of sorted) {
    if (match.result !== sorted[0].result) {
      break;
    }
    count++;
  }
  return count;
}

function newestFirst(a: SetRecord, b: SetRecord) {
  return b.playedAt.localeCompare(a.playedAt);
}

export function Dashboard() {
  
  const logoutMutation = useLogout();
  const navigate = useNavigate();

  const { data: sets } = useSets();
  const matches: SetRecord[] = sets ?? [];
  const sortedMatches = [...matches].sort(newestFirst);
  const totalSets = matches.length;
  const wins = matches.filter(isWin).length;
  const losses = totalSets - wins;
  const winRate = winPct(totalSets, wins);
  const recentMatches = sortedMatches.slice(0, 5);

  const currentStreak = getStreak(sortedMatches);
  const streakIsWin = sortedMatches.length > 0 && sortedMatches[0].result === 'Win';
  const [showAddMatch, setShowAddMatch] = useState(false);
  const [, setNewMatch] = useState<MatchFormData | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showGameViewer, setShowGameViewer] = useState(false);
  const [showUploadSlp, setShowUploadSlp] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [, setImportedMatches] = useState<ImportedMatch[]>([]);

  const handleLogout = () => {
    logoutMutation.mutate();
    navigate({ to: '/login' });
  };

  function handleViewMatches() {
    navigate({ to: '/matches' });
  };

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  if (showGameViewer) {
    return <GameViewer onBack={() => setShowGameViewer(false)} />;
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(to bottom right, #020617, #0f172a, #020617)', position: 'relative' }}>
      {/* Grid pattern */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          opacity: 0.05,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Header */}
      <Box component="header" sx={{ position: 'relative', zIndex: 10, borderBottom: '1px solid #1e293b', bgcolor: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(8px)' }}>
        <Container maxWidth="lg" sx={{ py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ position: 'relative' }}>
                <Gamepad2 sx={{ width: 32, height: 32, color: '#ef4444' }} />
                <Trophy sx={{ width: 16, height: 16, color: '#facc15', position: 'absolute', top: -4, right: -4 }} />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', lineHeight: 1.2 }}>
                  Melee Tracker
                </Typography>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  Performance Analytics
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                onClick={handleViewMatches}
                className="hidden text-slate-300 hover:bg-slate-800 hover:text-red-400 md:flex"
              >
                
                Matches
              </Button>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.5, py: 1, bgcolor: '#1e293b', borderRadius: 2 }}>
                <User sx={{ width: 18, height: 18, color: '#94a3b8' }} />
                <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
                  Player1
                </Typography>
              </Box>
              <Button
                onClick={handleLogout}
                size="small"
                startIcon={<LogOut sx={{ width: 16, height: 16 }} />}
                sx={{ color: '#94a3b8', '&:hover': { color: 'white', bgcolor: '#1e293b' } }}
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10, py: 4 }}>
        {/* Quick stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Total Matches</Typography>
              <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>{totalSets}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                <Calendar sx={{ width: 16, height: 16 }} />
                <Typography variant="body2">All time</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Win Rate</Typography>
              <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>{winRate}%</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                <TrendingUp sx={{ width: 16, height: 16 }} />
                <Typography variant="body2">{wins} Wins - {losses} Losses</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Current Streak</Typography>
              <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>
                {currentStreak}
                <Typography component="span" variant="h6" sx={{ ml: 0.5 }}>
                  {streakIsWin ? 'W' : 'L'}
                </Typography>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: stats.streakType === 'win' ? '#4ade80' : '#f87171' }}>
                {streakIsWin ? <TrendingUp sx={{ width: 16, height: 16 }} /> : <TrendingDown sx={{ width: 16, height: 16 }} />}
                <Typography variant="body2">{streakIsWin ? 'On fire!' : 'Keep grinding'}</Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>Main Character</Typography>
              <Typography variant="h4" sx={{ color: 'white', mb: 1 }}>{stats.favoriteCharacter}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#94a3b8' }}>
                <Target sx={{ width: 16, height: 16 }} />
                <Typography variant="body2">Most played</Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
          <Button variant="contained" startIcon={<Plus />} onClick={() => setShowAddMatch(true)} sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>
            Add Match
          </Button>
          <Button variant="outlined" startIcon={<Download />} onClick={() => setShowImportModal(true)} sx={{ borderColor: '#334155', bgcolor: '#1e293b', color: 'white', '&:hover': { bgcolor: '#334155', borderColor: '#334155' } }}>
            Import from start.gg
          </Button>
          <Button variant="outlined" startIcon={<BarChart3 />} onClick={() => setShowAnalytics(true)} sx={{ borderColor: '#334155', bgcolor: '#1e293b', color: 'white', '&:hover': { bgcolor: '#334155', borderColor: '#334155' } }}>
            View Analytics
          </Button>
          <Button variant="outlined" startIcon={<Play />} onClick={() => setShowGameViewer(true)} sx={{ borderColor: '#334155', bgcolor: '#1e293b', color: 'white', '&:hover': { bgcolor: '#334155', borderColor: '#334155' } }}>
            Watch Match
          </Button>
          <Button variant="contained" startIcon={<Upload />} onClick={() => setShowUploadSlp(true)} sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}>
            Upload VOD
          </Button>
        </Box>

        {/* Matchup stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingUp sx={{ width: 20, height: 20, color: '#22c55e' }} />
                <Typography variant="h6" sx={{ color: 'white' }}>Best Matchup</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>Your strongest opponent character</Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>vs {stats.bestMatchup.split(' ')[0]}</Typography>
              <Typography variant="h6" sx={{ color: '#4ade80' }}>{stats.bestMatchup.split(' ')[1]}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>Keep capitalizing on this advantage</Typography>
            </CardContent>
          </Card>

          <Card sx={cardSx}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <TrendingDown sx={{ width: 20, height: 20, color: '#ef4444' }} />
                <Typography variant="h6" sx={{ color: 'white' }}>Needs Work</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>Focus area for improvement</Typography>
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>vs {stats.worstMatchup.split(' ')[0]}</Typography>
              <Typography variant="h6" sx={{ color: '#f87171' }}>{stats.worstMatchup.split(' ')[1]}</Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>Practice this matchup to improve</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Recent matches table */}
        <Card sx={cardSx}>
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white' }}>Recent Matches</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8', mb: 2 }}>Your last 5 recorded matches</Typography>

            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', border: '1px solid #1e293b', boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ '& .MuiTableCell-root': { borderColor: '#1e293b', color: '#cbd5e1' } }}>
                    <TableCell>Date</TableCell>
                    <TableCell>Opponent</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentMatches.map((match) => (
                    <TableRow
                      key={match.id}
                      sx={{
                        cursor: 'pointer',
                        '& .MuiTableCell-root': { borderColor: '#1e293b' },
                        '&:hover': { bgcolor: 'rgba(30,41,59,0.5)' },
                      }}
                    >
                      <TableCell sx={{ color: '#94a3b8' }}>
                        {new Date(match.playedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 500 }}>{match.opponentTag}</TableCell>
                      {/* <TableCell sx={{ color: '#cbd5e1' }}>
                        <Box component="span" sx={{ color: '#60a5fa' }}>{match.myCharacter}</Box> vs{' '}
                        <Box component="span" sx={{ color: '#c084fc' }}>{match.opponentCharacter}</Box>
                      </TableCell> */}
                      {/* <TableCell sx={{ color: '#94a3b8' }}>{match.stage}</TableCell> */}
                      <TableCell sx={{ color: '#cbd5e1' }}>{match.scoreUser} - {match.scoreOpponent}</TableCell>
                      <TableCell>
                        <Chip
                          label={match.result}
                          size="small"
                          sx={{
                            bgcolor: match.result === 'Win' ? '#14532d' : '#7f1d1d',
                            color: match.result === 'Win' ? '#bbf7d0' : '#fecaca',
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button onClick={handleViewMatches} sx={{ color: '#f87171', '&:hover': { color: '#fca5a5', bgcolor: '#1e293b' } }}>
                View All Matches →
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>

      <AddMatchForm
        open={showAddMatch}
        onClose={() => setShowAddMatch(false)}
        onSubmit={(formData) => {
          setNewMatch(formData);
          setShowAddMatch(false);
        }}
      />

      <ImportStartGGModal
        open={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImport={(matches) => {
          setImportedMatches(matches);
          setShowImportModal(false);
        }}
      />

      <UploadSlpModal open={showUploadSlp} onClose={() => setShowUploadSlp(false)} />
    </Box>
  );
}
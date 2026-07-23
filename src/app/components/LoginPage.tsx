// src/components/LoginPage.tsx
import { useState, SubmitEvent } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { SportsEsports, EmojiEvents, TrendingUp } from '@mui/icons-material';
import { useLogin } from '../hooks/useLogin';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const handleDemoLogin = () => {
    loginMutation.mutate({ email: 'demo@example.com', password: 'demopassword' });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(to bottom right, #020617, #0f172a, #020617)',
      }}
    >
      {/* Grid pattern overlay */}
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          opacity: 0.1,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Main content */}
      <Box sx={{ zIndex: 10, width: '100%', maxWidth: 400, px: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
            <SportsEsports sx={{ width: 64, height: 64, color: '#ef4444' }} />
            <EmojiEvents
              sx={{ width: 24, height: 24, color: '#facc15', position: 'absolute', top: -4, right: -4 }}
            />
          </Box>
          <Typography variant="h3" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Melee Tracker
          </Typography>
          <Typography sx={{ color: '#94a3b8' }}>
            Track your path to competitive excellence
          </Typography>
        </Box>

        <Card
          sx={{
            bgcolor: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid #1e293b',
            backdropFilter: 'blur(8px)',
            boxShadow: 24,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" align="center" sx={{ color: 'white', mb: 0.5 }}>
              Welcome Back
            </Typography>
            <Typography align="center" sx={{ color: '#94a3b8', mb: 3 }} variant="body2">
              Enter your credentials to access your stats
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ sx: { color: '#e2e8f0' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#1e293b',
                    color: 'white',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#ef4444' },
                    '&.Mui-focused fieldset': { borderColor: '#ef4444' },
                  },
                }}
              />
              <TextField
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputLabelProps={{ sx: { color: '#e2e8f0' } }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    bgcolor: '#1e293b',
                    color: 'white',
                    '& fieldset': { borderColor: '#334155' },
                    '&:hover fieldset': { borderColor: '#ef4444' },
                    '&.Mui-focused fieldset': { borderColor: '#ef4444' },
                  },
                }}
              />

              {loginMutation.isError && <Alert severity="error">{loginMutation.error.message}</Alert>}

              <Button
                type="submit"
                variant="contained"
                disabled={loginMutation.isPending}
                fullWidth
                sx={{ bgcolor: '#dc2626', '&:hover': { bgcolor: '#b91c1c' } }}
              >
                {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Button
                type="button"
                variant="outlined"
                onClick={handleDemoLogin}
                disabled={loginMutation.isPending}
                fullWidth
                sx={{
                  borderColor: '#334155',
                  bgcolor: '#1e293b',
                  color: '#cbd5e1',
                  '&:hover': { bgcolor: '#334155', borderColor: '#334155' },
                }}
              >
                Quick Demo Login
              </Button>
            </Box>

            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                <TrendingUp sx={{ width: 20, height: 20, color: '#ef4444' }} />
                <Typography variant="body2">Track match history & statistics</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                <EmojiEvents sx={{ width: 20, height: 20, color: '#eab308' }} />
                <Typography variant="body2">Analyze matchup performance</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: '#cbd5e1' }}>
                <SportsEsports sx={{ width: 20, height: 20, color: '#3b82f6' }} />
                <Typography variant="body2">Import from start.gg API</Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        <Typography align="center" sx={{ mt: 3, color: '#64748b', fontSize: '0.75rem' }}>
          Unofficial community tool for SSBM players
        </Typography>
      </Box>
    </Box>
  );
}
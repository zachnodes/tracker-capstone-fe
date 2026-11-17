import { useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import {
  Box,
  Container,
  Card,
  Typography,
  Button,
  Chip,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  SwapVert as ArrowDownUp,
  ArrowBack as ArrowLeft,
  CalendarMonth as CalendarDays,
  ChevronLeft,
  ChevronRight,
  AccountCircle as CircleUserRound,
  Cloud,
  SportsEsports as Gamepad2,
  Home,
  Logout as LogOut,
  Search,
  Tune as SlidersHorizontal,
  EmojiEvents as Trophy,
  Groups as UsersRound,
} from "@mui/icons-material";
import { useSets } from "../hooks/useSets";
import { SetRecord, isWin, winPct, MatchSource } from "../types/sets";

const PAGE_SIZE = 8;

const sourceStyles: Record<MatchSource, { borderColor: string; bgcolor: string; color: string }> = {
  Startgg: { borderColor: "rgba(139,92,246,0.25)", bgcolor: "rgba(139,92,246,0.1)", color: "#c4b5fd" },
  Manual: { borderColor: "#475569", bgcolor: "rgba(51,65,85,0.4)", color: "#cbd5e1" },
};

const winChip = { border: "1px solid rgba(16,185,129,0.25)", bgcolor: "rgba(16,185,129,0.1)", color: "#6ee7b7" };
const lossChip = { border: "1px solid rgba(239,68,68,0.25)", bgcolor: "rgba(239,68,68,0.1)", color: "#fca5a5" };

const cardSx = {
  border: "1px solid #1e293b",
  bgcolor: "rgba(15, 23, 42, 0.75)",
  borderRadius: 0,
  boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)",
  overflow: "hidden",
};

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    height: 44,
    bgcolor: "#0f172a",
    color: "#e2e8f0",
    borderRadius: 0,
    fontSize: 14,
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#475569" },
    "&.Mui-focused fieldset": { borderColor: "#ef4444" },
  },
  "& .MuiSvgIcon-root": { color: "#64748b" },
};

const outlinedButtonSx = {
  borderColor: "#334155",
  bgcolor: "#0f172a",
  color: "#cbd5e1",
  borderRadius: 0,
  textTransform: "none",
  "&:hover": { bgcolor: "#1e293b", borderColor: "#334155", color: "white" },
  "&.Mui-disabled": { opacity: 0.3, color: "#cbd5e1", borderColor: "#334155" },
};

const headerCellSx = {
  px: 2.5,
  py: 1.75,
  fontFamily: "monospace",
  fontSize: 10,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.16em",
  color: "#64748b",
  borderColor: "#1e293b",
};

const headings = ["Date", "Opponent", "Tournament", "Round", "Score", "Result", "Source"];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function initials(tag: string) {
  return tag.slice(0, 2).toUpperCase();
}

interface MatchesPageProps {
  username: string;
  onBack: () => void;
  onLogout: () => void;
}

export function MatchesPage({ username, onBack, onLogout }: MatchesPageProps) {
  const [query, setQuery] = useState("");
  const [resultFilter, setResultFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");
  const [sortNewest, setSortNewest] = useState(true);
  const [page, setPage] = useState(1);

  const { data: sets } = useSets();
  const matches: SetRecord[] = sets ?? [];
  const totalSets = matches.length;
  const wins = matches.filter(isWin).length;

  const filteredMatches = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return matches
      .filter((match) => {
        const matchesQuery =
          !normalizedQuery ||
          [match.opponentTag, match.tournamentName, match.roundName].some((value) =>
            value?.toLowerCase().includes(normalizedQuery),
          );
        return (
          matchesQuery &&
          (resultFilter === "All" || match.result === resultFilter) &&
          (sourceFilter === "All" || match.source === sourceFilter)
        );
      })
      .sort((a, b) =>
        sortNewest ? b.playedAt.localeCompare(a.playedAt) : a.playedAt.localeCompare(b.playedAt),
      );
  }, [query, sets, resultFilter, sourceFilter, sortNewest]);

  const pageCount = Math.max(1, Math.ceil(filteredMatches.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const visibleMatches = filteredMatches.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE,
  );

  function handleQueryChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value);
    setPage(1);
  }

  function handleResultChange(event: ChangeEvent<HTMLInputElement>) {
    setResultFilter(event.target.value);
    setPage(1);
  }

  function handleSourceChange(event: ChangeEvent<HTMLInputElement>) {
    setSourceFilter(event.target.value);
    setPage(1);
  }

  function toggleSort() {
    setSortNewest(!sortNewest);
  }

  function previousPage() {
    setPage(Math.max(1, safePage - 1));
  }

  function nextPage() {
    setPage(Math.min(pageCount, safePage + 1));
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#020617", color: "#f1f5f9", position: "relative" }}>
      {/* Background glow and grid */}
      <Box
        sx={{
          pointerEvents: "none",
          position: "fixed",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 78% 0%, rgba(220,38,38,0.12), transparent 28%),
                            linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "auto, 48px 48px, 48px 48px",
        }}
      />

      {/* Header */}
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          borderBottom: "1px solid #1e293b",
          bgcolor: "rgba(2,6,23,0.9)",
          backdropFilter: "blur(24px)",
        }}
      >
        <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center", gap: 2, py: 1.5 }}>
          <Box
            component="button"
            onClick={onBack}
            aria-label="Back to dashboard"
            sx={{ display: "flex", alignItems: "center", gap: 1.5, bgcolor: "transparent", border: 0, cursor: "pointer", p: 0, textAlign: "left" }}
          >
            <Box
              sx={{
                position: "relative",
                display: "grid",
                placeItems: "center",
                width: 40,
                height: 40,
                border: "1px solid rgba(239,68,68,0.3)",
                bgcolor: "rgba(239,68,68,0.1)",
              }}
            >
              <Gamepad2 sx={{ fontSize: 20, color: "#ef4444" }} />
              <Box sx={{ position: "absolute", right: -4, top: -4, width: 8, height: 8, bgcolor: "#ef4444" }} />
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontWeight: 700, lineHeight: 1.2, color: "white" }}>Melee Tracker</Typography>
              <Typography sx={{ fontFamily: "monospace", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.2em", color: "#64748b" }}>
                Performance OS
              </Typography>
            </Box>
          </Box>

          <Box component="nav" sx={{ ml: 1, display: { xs: "none", md: "flex" }, alignItems: "center", gap: 0.5, borderLeft: "1px solid #1e293b", pl: 2 }}>
            <Button
              onClick={onBack}
              size="small"
              startIcon={<Home />}
              sx={{ color: "#94a3b8", textTransform: "none", "&:hover": { bgcolor: "#1e293b", color: "white" } }}
            >
              Dashboard
            </Button>
            <Button
              size="small"
              startIcon={<Trophy />}
              sx={{ bgcolor: "rgba(239,68,68,0.1)", color: "#f87171", textTransform: "none", "&:hover": { bgcolor: "rgba(239,68,68,0.15)", color: "#fca5a5" } }}
            >
              Matches
            </Button>
          </Box>

          <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
            <Box sx={{ display: { xs: "none", sm: "flex" }, alignItems: "center", gap: 1, border: "1px solid #1e293b", bgcolor: "#0f172a", px: 1.5, py: 1 }}>
              <CircleUserRound sx={{ fontSize: 16, color: "#64748b" }} />
              <Typography variant="body2" sx={{ fontWeight: 500, color: "#e2e8f0" }}>{username}</Typography>
            </Box>
            <Button
              onClick={onLogout}
              size="small"
              startIcon={<LogOut />}
              sx={{ color: "#64748b", textTransform: "none", "&:hover": { bgcolor: "#1e293b", color: "white" } }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" component="main" sx={{ position: "relative", zIndex: 10, py: { xs: 4, lg: 6 } }}>
        {/* Page title and summary */}
        <Box
          sx={{
            mb: 4,
            pb: 4,
            borderBottom: "1px solid #1e293b",
            display: "grid",
            gap: 4,
            gridTemplateColumns: { xs: "1fr", lg: "1fr auto" },
            alignItems: { lg: "end" },
          }}
        >
          <Box>
            <Button
              onClick={onBack}
              size="small"
              startIcon={<ArrowLeft />}
              sx={{ display: { xs: "inline-flex", md: "none" }, mb: 2.5, p: 0, color: "#64748b", textTransform: "none", fontSize: 12, "&:hover": { color: "#f87171", bgcolor: "transparent" } }}
            >
              Dashboard
            </Button>
            <Typography sx={{ mb: 1.5, fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.28em", color: "#ef4444" }}>
              Set Archive / 2026 Season
            </Typography>
            <Typography component="h1" sx={{ fontFamily: "serif", fontSize: { xs: 36, sm: 48 }, fontWeight: 700, letterSpacing: "-0.02em", color: "white" }}>
              Match history
            </Typography>
            <Typography sx={{ mt: 1.5, maxWidth: 672, fontSize: 14, lineHeight: 1.7, color: "#94a3b8" }}>
              Every recorded set, from bracket runs to late-night friendlies. Filter the archive to find the games that matter.
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", border: "1px solid #1e293b", bgcolor: "rgba(15,23,42,0.7)" }}>
            <Box sx={{ px: 2.5, py: 2 }}>
              <Typography sx={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: "white" }}>{totalSets}</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>Sets</Typography>
            </Box>
            <Box sx={{ px: 2.5, py: 2, borderLeft: "1px solid #1e293b" }}>
              <Typography sx={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: "#34d399" }}>{wins}</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>Wins</Typography>
            </Box>
            <Box sx={{ px: 2.5, py: 2, borderLeft: "1px solid #1e293b" }}>
              <Typography sx={{ fontFamily: "monospace", fontSize: 24, fontWeight: 700, color: "#f87171" }}>{winPct(totalSets, wins)}%</Typography>
              <Typography sx={{ mt: 0.5, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b" }}>Win rate</Typography>
            </Box>
          </Box>
        </Box>

        {/* Search and filters */}
        <Box sx={{ mb: 2.5, display: "flex", flexDirection: { xs: "column", xl: "row" }, gap: 1.5, alignItems: { xl: "center" } }}>
          <TextField
            value={query}
            onChange={handleQueryChange}
            placeholder="Search opponent, tournament, or round…"
            fullWidth
            sx={{ ...fieldSx, flex: 1, "& input::placeholder": { color: "#475569", opacity: 1 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            <TextField
              select
              value={resultFilter}
              onChange={handleResultChange}
              aria-label="Filter by result"
              sx={{ ...fieldSx, minWidth: 130 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Trophy fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Win">Win</MenuItem>
              <MenuItem value="Loss">Loss</MenuItem>
            </TextField>
            <TextField
              select
              value={sourceFilter}
              onChange={handleSourceChange}
              aria-label="Filter by source"
              sx={{ ...fieldSx, minWidth: 150 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Cloud fontSize="small" />
                    </InputAdornment>
                  ),
                },
              }}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Startgg">Startgg</MenuItem>
              <MenuItem value="Manual">Manual</MenuItem>
            </TextField>
            <Button variant="outlined" onClick={toggleSort} startIcon={<ArrowDownUp />} sx={{ ...outlinedButtonSx, height: 44 }}>
              {sortNewest ? "Newest" : "Oldest"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ mb: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 12, color: "#64748b" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <SlidersHorizontal sx={{ fontSize: 14 }} />
            <Typography sx={{ fontSize: 12 }}>{filteredMatches.length} records in this view</Typography>
          </Box>
          <Typography sx={{ display: { xs: "none", sm: "block" }, fontFamily: "monospace", fontSize: 12 }}>W/L DATA · LOCAL TIME</Typography>
        </Box>

        <Card sx={cardSx}>
          {/* Desktop table */}
          <TableContainer sx={{ display: { xs: "none", lg: "block" } }}>
            <Table sx={{ minWidth: 980 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "rgba(2,6,23,0.7)" }}>
                  {headings.map((heading) => (
                    <TableCell key={heading} sx={headerCellSx}>{heading}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {visibleMatches.map((match, index) => (
                  <TableRow
                    key={match.id}
                    sx={{
                      "& .MuiTableCell-root": { borderColor: "rgba(30,41,59,0.8)", px: 2.5, py: 2 },
                      "&:last-child .MuiTableCell-root": { borderBottom: 0 },
                      "&:hover": { bgcolor: "rgba(30,41,59,0.55)" },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>{formatDate(match.playedAt)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            display: "grid",
                            placeItems: "center",
                            width: 36,
                            height: 36,
                            fontFamily: "monospace",
                            fontSize: 12,
                            fontWeight: 700,
                            ...(index % 2 === 0
                              ? { border: "1px solid rgba(239,68,68,0.25)", bgcolor: "rgba(239,68,68,0.1)", color: "#fca5a5" }
                              : { border: "1px solid #334155", bgcolor: "#1e293b", color: "#cbd5e1" }),
                          }}
                        >
                          {initials(match.opponentTag)}
                        </Box>
                        <Typography sx={{ fontWeight: 600, color: "white" }}>{match.opponentTag}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography noWrap sx={{ maxWidth: 220, fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>{match.tournamentName}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontSize: 14, color: "#94a3b8" }}>{match.roundName}</TableCell>
                    <TableCell>
                      <Box component="span" sx={{ fontFamily: "monospace", fontSize: 16, fontWeight: 700, color: "white" }}>{match.scoreUser}</Box>
                      <Box component="span" sx={{ mx: 1, color: "#475569" }}>-</Box>
                      <Box component="span" sx={{ fontFamily: "monospace", fontSize: 16, color: "#94a3b8" }}>{match.scoreOpponent}</Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={match.result} size="small" sx={match.result === "Win" ? winChip : lossChip} />
                    </TableCell>
                    <TableCell>
                      <Chip label={match.source} size="small" variant="outlined" sx={sourceStyles[match.source]} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Mobile cards */}
          <Box sx={{ display: { xs: "block", lg: "none" } }}>
            {visibleMatches.map((match) => (
              <Box
                key={match.id}
                component="article"
                sx={{ p: 2, borderBottom: "1px solid #1e293b", "&:last-child": { borderBottom: 0 }, "&:hover": { bgcolor: "rgba(30,41,59,0.4)" } }}
              >
                <Box sx={{ mb: 2, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        width: 40,
                        height: 40,
                        border: "1px solid rgba(239,68,68,0.25)",
                        bgcolor: "rgba(239,68,68,0.1)",
                        fontFamily: "monospace",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#fca5a5",
                      }}
                    >
                      {initials(match.opponentTag)}
                    </Box>
                    <Typography component="h2" sx={{ fontWeight: 600, color: "white" }}>{match.opponentTag}</Typography>
                  </Box>
                  <Chip label={match.result} size="small" sx={match.result === "Win" ? winChip : lossChip} />
                </Box>
                <Box sx={{ mb: 2, borderLeft: "2px solid rgba(239,68,68,0.6)", pl: 1.5 }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>{match.tournamentName}</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 12, color: "#64748b" }}>{match.roundName}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, color: "#64748b" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <CalendarDays sx={{ fontSize: 14 }} />
                      <Typography sx={{ fontSize: 12 }}>{formatDate(match.playedAt)}</Typography>
                    </Box>
                    <Chip label={match.source} size="small" variant="outlined" sx={sourceStyles[match.source]} />
                  </Box>
                  <Typography sx={{ fontFamily: "monospace", fontSize: 18, fontWeight: 700, color: "white" }}>
                    {match.scoreUser}
                    <Box component="span" sx={{ mx: 1, color: "#475569" }}>-</Box>
                    <Box component="span" sx={{ color: "#94a3b8" }}>{match.scoreOpponent}</Box>
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {visibleMatches.length === 0 && (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 288, px: 3, textAlign: "center" }}>
              <Box>
                <UsersRound sx={{ mb: 2, fontSize: 32, color: "#475569" }} />
                <Typography component="h2" sx={{ fontFamily: "serif", fontSize: 20, fontWeight: 700, color: "white" }}>No sets found</Typography>
                <Typography sx={{ mt: 1, fontSize: 14, color: "#64748b" }}>Try a different opponent, tournament, or filter.</Typography>
              </Box>
            </Box>
          )}
        </Card>

        {/* Pagination */}
        <Box
          component="footer"
          sx={{ mt: 2.5, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, alignItems: { sm: "center" }, justifyContent: { sm: "space-between" } }}
        >
          <Typography sx={{ fontSize: 12, color: "#64748b" }}>
            Showing {filteredMatches.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1}–{Math.min(safePage * PAGE_SIZE, filteredMatches.length)} of {filteredMatches.length}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button variant="outlined" size="small" disabled={safePage === 1} onClick={previousPage} startIcon={<ChevronLeft />} sx={outlinedButtonSx}>
              Previous
            </Button>
            <Typography sx={{ px: 1, fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>{safePage} / {pageCount}</Typography>
            <Button variant="outlined" size="small" disabled={safePage === pageCount} onClick={nextPage} endIcon={<ChevronRight />} sx={outlinedButtonSx}>
              Next
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

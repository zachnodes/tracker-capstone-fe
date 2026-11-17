export type MatchResult = "Win" | "Loss";
export type MatchSource = "Startgg" | "Manual";

export interface SetRecord {
  id: string;                    // Guid comes through as a string
  opponentTag: string;
  tournamentName: string | null; // string? in C#
  roundName: string | null;      // string? in C#
  scoreUser: number;
  scoreOpponent: number;
  result: MatchResult;
  source: MatchSource;
  playedAt: string;
}

export interface SetRecord {
  id: string;                    // Guid comes through as a string
  opponentTag: string;
  tournamentName: string | null; // string? in C#
  roundName: string | null;      // string? in C#
  scoreUser: number;
  scoreOpponent: number;
  result: MatchResult;
  source: MatchSource;
  playedAt: string;
}

export function isWin(match: SetRecord) {
    return match.result === "Win";
}

export function winPct(total: number, wins: number) {
    if (total === 0) {
    return 0;
  }
  return Math.trunc((wins / total) * 100).toFixed(1);
}
import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  ArrowLeft,
  SkipBack,
  SkipForward,
  Search,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CHAR_COLORS: Record<string, string> = {
  Fox:              "#e8804a",
  Falco:            "#4a8ef5",
  Marth:            "#7b5ea7",
  Sheik:            "#3a9e6f",
  Jigglypuff:       "#e87aad",
  Peach:            "#f56fa0",
  "Captain Falcon": "#ff6b2b",
  Pikachu:          "#f0c040",
  Samus:            "#c47a2a",
  "Ice Climbers":   "#6ab8e8",
  Luigi:            "#5ab840",
  Link:             "#6dab3c",
  Mewtwo:           "#a070c8",
  Ganondorf:        "#8b4513",
};

const STAGES = [
  "Battlefield",
  "Final Destination",
  "Dream Land N64",
  "Fountain of Dreams",
  "Yoshi's Story",
  "Pokémon Stadium",
];

interface SlpFile {
  id: number;
  filename: string;
  date: string;
  time: string;
  myChar: string;
  oppChar: string;
  stage: string;
  result: "W" | "L";
  duration: string;
  stocks: number;
  oppStocks: number;
}

const SLP_FILES: SlpFile[] = [
  { id: 1,  filename: "Game_20260704T193201.slp", date: "Jul 4, 2026",  time: "7:32 PM",  myChar: "Fox",            oppChar: "Falco",           stage: "Battlefield",        result: "W", duration: "5:42", stocks: 2, oppStocks: 0 },
  { id: 2,  filename: "Game_20260704T201845.slp", date: "Jul 4, 2026",  time: "8:18 PM",  myChar: "Fox",            oppChar: "Marth",           stage: "Final Destination",  result: "L", duration: "7:11", stocks: 0, oppStocks: 1 },
  { id: 3,  filename: "Game_20260703T154402.slp", date: "Jul 3, 2026",  time: "3:44 PM",  myChar: "Fox",            oppChar: "Sheik",           stage: "Yoshi's Story",      result: "W", duration: "4:58", stocks: 3, oppStocks: 0 },
  { id: 4,  filename: "Game_20260703T160032.slp", date: "Jul 3, 2026",  time: "4:00 PM",  myChar: "Fox",            oppChar: "Sheik",           stage: "Dream Land N64",     result: "W", duration: "6:33", stocks: 1, oppStocks: 0 },
  { id: 5,  filename: "Game_20260702T213315.slp", date: "Jul 2, 2026",  time: "9:33 PM",  myChar: "Fox",            oppChar: "Jigglypuff",      stage: "Fountain of Dreams", result: "L", duration: "8:00", stocks: 0, oppStocks: 2 },
  { id: 6,  filename: "Game_20260702T220148.slp", date: "Jul 2, 2026",  time: "10:01 PM", myChar: "Fox",            oppChar: "Jigglypuff",      stage: "Battlefield",        result: "W", duration: "6:22", stocks: 2, oppStocks: 0 },
  { id: 7,  filename: "Game_20260701T181120.slp", date: "Jul 1, 2026",  time: "6:11 PM",  myChar: "Falco",          oppChar: "Fox",             stage: "Final Destination",  result: "W", duration: "5:14", stocks: 3, oppStocks: 0 },
  { id: 8,  filename: "Game_20260701T183044.slp", date: "Jul 1, 2026",  time: "6:30 PM",  myChar: "Falco",          oppChar: "Marth",           stage: "Pokémon Stadium",    result: "L", duration: "7:45", stocks: 0, oppStocks: 1 },
  { id: 9,  filename: "Game_20260630T140055.slp", date: "Jun 30, 2026", time: "2:00 PM",  myChar: "Fox",            oppChar: "Captain Falcon",  stage: "Yoshi's Story",      result: "W", duration: "3:58", stocks: 3, oppStocks: 0 },
  { id: 10, filename: "Game_20260630T142210.slp", date: "Jun 30, 2026", time: "2:22 PM",  myChar: "Fox",            oppChar: "Pikachu",         stage: "Fountain of Dreams", result: "W", duration: "5:07", stocks: 2, oppStocks: 0 },
  { id: 11, filename: "Game_20260629T192530.slp", date: "Jun 29, 2026", time: "7:25 PM",  myChar: "Fox",            oppChar: "Peach",           stage: "Battlefield",        result: "L", duration: "8:00", stocks: 0, oppStocks: 1 },
  { id: 12, filename: "Game_20260629T195811.slp", date: "Jun 29, 2026", time: "7:58 PM",  myChar: "Fox",            oppChar: "Samus",           stage: "Dream Land N64",     result: "W", duration: "6:40", stocks: 2, oppStocks: 0 },
  { id: 13, filename: "Game_20260628T203344.slp", date: "Jun 28, 2026", time: "8:33 PM",  myChar: "Marth",          oppChar: "Falco",           stage: "Yoshi's Story",      result: "W", duration: "4:29", stocks: 3, oppStocks: 0 },
  { id: 14, filename: "Game_20260628T210019.slp", date: "Jun 28, 2026", time: "9:00 PM",  myChar: "Marth",          oppChar: "Fox",             stage: "Final Destination",  result: "L", duration: "7:01", stocks: 0, oppStocks: 2 },
  { id: 15, filename: "Game_20260627T155542.slp", date: "Jun 27, 2026", time: "3:55 PM",  myChar: "Fox",            oppChar: "Ice Climbers",    stage: "Fountain of Dreams", result: "W", duration: "5:55", stocks: 2, oppStocks: 0 },
];

// Mock per-game stats that appear when a replay is loaded
const GAME_STATS: Record<number, { p1: Record<string, string>; p2: Record<string, string> }> = {
  1: { p1: { "Damage Dealt": "312%", "Openings": "14", "Conversion": "64%", "L-Cancels": "91%", "Avg Combo": "18%", "Neutral Wins": "9" }, p2: { "Damage Dealt": "198%", "Openings": "11", "Conversion": "45%", "L-Cancels": "78%", "Avg Combo": "12%", "Neutral Wins": "6" } },
  2: { p1: { "Damage Dealt": "401%", "Openings": "17", "Conversion": "53%", "L-Cancels": "88%", "Avg Combo": "22%", "Neutral Wins": "8" }, p2: { "Damage Dealt": "450%", "Openings": "15", "Conversion": "73%", "L-Cancels": "95%", "Avg Combo": "28%", "Neutral Wins": "11" } },
};

const FALLBACK_STATS = { p1: { "Damage Dealt": "—", "Openings": "—", "Conversion": "—", "L-Cancels": "—", "Avg Combo": "—", "Neutral Wins": "—" }, p2: { "Damage Dealt": "—", "Openings": "—", "Conversion": "—", "L-Cancels": "—", "Avg Combo": "—", "Neutral Wins": "—" } };

// ─── Stage color palettes ──────────────────────────────────────────────────────
const STAGE_COLORS: Record<string, { bg: string; accent: string }> = {
  "Battlefield":        { bg: "#1a2744", accent: "#3d6fcc" },
  "Final Destination":  { bg: "#1a1a3a", accent: "#6644cc" },
  "Dream Land N64":     { bg: "#1a2e1a", accent: "#44aa55" },
  "Fountain of Dreams": { bg: "#2a1a2a", accent: "#bb55cc" },
  "Yoshi's Story":      { bg: "#2a2a14", accent: "#aacc33" },
  "Pokémon Stadium":    { bg: "#2a1a14", accent: "#cc6633" },
};

// ─── Component ────────────────────────────────────────────────────────────────
export function GameViewer({ onBack }: { onBack: () => void }) {
  const [selectedFile, setSelectedFile] = useState<SlpFile | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = SLP_FILES.filter((f) => {
    const q = query.toLowerCase();
    return (
      q === "" ||
      f.myChar.toLowerCase().includes(q) ||
      f.oppChar.toLowerCase().includes(q) ||
      f.stage.toLowerCase().includes(q) ||
      f.date.toLowerCase().includes(q)
    );
  });

  const stats = selectedFile ? (GAME_STATS[selectedFile.id] ?? FALLBACK_STATS) : null;
  const stageTheme = selectedFile ? (STAGE_COLORS[selectedFile.stage] ?? STAGE_COLORS["Battlefield"]) : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="fixed inset-0 z-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: "50px 50px",
      }} />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800 bg-slate-900/80 backdrop-blur-sm sticky top-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="h-5 w-px bg-slate-700 shrink-0" />
          <div className="flex items-center gap-2 min-w-0">
            <FolderOpen className="w-4 h-4 text-red-500 shrink-0" />
            <span className="text-white font-semibold text-sm truncate">Replay Viewer</span>
            {selectedFile && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                <span className="text-slate-400 text-sm truncate">{selectedFile.filename}</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-6">
        <div className="grid grid-cols-[320px_1fr] gap-6 items-start">

          {/* ── SLP File Browser ── */}
          <aside className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-white font-semibold text-sm">Replays</h2>
              <span className="text-slate-600 text-xs">{filtered.length} files</span>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search character, stage…"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-slate-600"
              />
            </div>

            {/* File list */}
            <div className="space-y-1.5 max-h-[calc(100vh-220px)] overflow-y-auto pr-0.5" style={{ scrollbarWidth: "none" }}>
              {filtered.map((f) => (
                <SlpCard
                  key={f.id}
                  file={f}
                  selected={selectedFile?.id === f.id}
                  onClick={() => { setSelectedFile(f); setPlaying(false); }}
                />
              ))}
            </div>
          </aside>

          {/* ── Player + Stats ── */}
          <div className="space-y-4 min-w-0">

            {/* Video Player */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-black shadow-2xl shadow-black/50">

              {/* Player screen */}
              <div className="relative w-full bg-black" style={{ aspectRatio: "16/9" }}>
                {selectedFile ? (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-4"
                    style={{ background: `radial-gradient(ellipse at center, ${stageTheme!.bg}dd 0%, #050508 70%)` }}
                  >
                    {/* Stage ambience stripe */}
                    <div className="absolute inset-x-0 bottom-0 h-24 opacity-20"
                      style={{ background: `linear-gradient(to top, ${stageTheme!.accent}60, transparent)` }}
                    />

                    {/* Matchup display */}
                    <div className="flex items-center gap-6 z-10">
                      <CharBadge char={selectedFile.myChar} size="lg" />
                      <div className="text-center">
                        <div className="text-slate-600 text-xs font-semibold tracking-widest uppercase mb-1">vs</div>
                        <div className="text-slate-500 text-xs">{selectedFile.stage}</div>
                        <div className="text-slate-600 text-xs mt-0.5">{selectedFile.date}</div>
                      </div>
                      <CharBadge char={selectedFile.oppChar} size="lg" />
                    </div>

                    {/* Result pill */}
                    <div className={`z-10 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest ${
                      selectedFile.result === "W"
                        ? "bg-green-900/60 border border-green-700/50 text-green-400"
                        : "bg-red-900/60 border border-red-700/50 text-red-400"
                    }`}>
                      {selectedFile.result === "W" ? "WIN" : "LOSS"} · {selectedFile.duration}
                    </div>

                    {/* Play hint */}
                    <button
                      onClick={() => setPlaying(p => !p)}
                      className="z-10 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-colors mt-1"
                    >
                      {playing
                        ? <Pause className="w-6 h-6 text-white" />
                        : <Play className="w-6 h-6 text-white ml-0.5" />}
                    </button>
                  </div>
                ) : (
                  /* Empty state */
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-950">
                    <FolderOpen className="w-10 h-10 text-slate-700" />
                    <p className="text-slate-600 text-sm">Select a replay to load</p>
                  </div>
                )}
              </div>

              {/* Controls bar */}
              <div className="bg-slate-950 border-t border-slate-800/60 px-4 py-3 space-y-2.5">
                {/* Scrubber */}
                <div className="relative w-full h-1 bg-slate-800 rounded-full cursor-pointer group">
                  <div className="h-full bg-red-600 rounded-full w-0 group-hover:bg-red-500 transition-colors" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button className="text-slate-600 hover:text-white transition-colors" disabled={!selectedFile}>
                      <SkipBack className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { if (selectedFile) setPlaying(p => !p); }}
                      disabled={!selectedFile}
                      className="text-white hover:text-red-400 transition-colors disabled:text-slate-700"
                    >
                      {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button className="text-slate-600 hover:text-white transition-colors" disabled={!selectedFile}>
                      <SkipForward className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 ml-1">
                      <button
                        onClick={() => setMuted(m => !m)}
                        className="text-slate-500 hover:text-white transition-colors"
                      >
                        {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <div className="w-16 h-1 bg-slate-800 rounded-full">
                        <div className="h-full bg-slate-500 rounded-full" style={{ width: muted ? "0%" : "70%" }} />
                      </div>
                    </div>

                    <span className="text-slate-600 text-xs font-mono">
                      0:00 / {selectedFile?.duration ?? "—:——"}
                    </span>
                  </div>

                  <button className="text-slate-500 hover:text-white transition-colors">
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ── Stats Panel ── */}
            {selectedFile && stats ? (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                {/* Header row */}
                <div className="grid grid-cols-[1fr_auto_1fr] border-b border-slate-800">
                  <div className="flex items-center gap-3 px-5 py-4">
                    <CharBadge char={selectedFile.myChar} size="sm" />
                    <div>
                      <div className="text-white font-semibold text-sm">{selectedFile.myChar}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        {"●".repeat(selectedFile.stocks).split("").map((_, i) => (
                          <span key={i} className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: CHAR_COLORS[selectedFile.myChar] ?? "#888" }} />
                        ))}
                        {"○".repeat(4 - selectedFile.stocks).split("").map((_, i) => (
                          <span key={i} className="w-2 h-2 rounded-full inline-block bg-slate-700" />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center px-4 border-x border-slate-800">
                    <span className={`text-xs font-bold tracking-widest px-2 py-0.5 rounded ${
                      selectedFile.result === "W"
                        ? "text-green-400 bg-green-900/30"
                        : "text-red-400 bg-red-900/30"
                    }`}>
                      {selectedFile.result === "W" ? "WIN" : "LOSS"}
                    </span>
                    <span className="text-slate-600 text-xs mt-1">{selectedFile.stage}</span>
                  </div>

                  <div className="flex items-center gap-3 px-5 py-4 flex-row-reverse">
                    <CharBadge char={selectedFile.oppChar} size="sm" />
                    <div className="text-right">
                      <div className="text-white font-semibold text-sm">{selectedFile.oppChar}</div>
                      <div className="flex items-center gap-1.5 justify-end mt-0.5">
                        {"●".repeat(selectedFile.oppStocks).split("").map((_, i) => (
                          <span key={i} className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: CHAR_COLORS[selectedFile.oppChar] ?? "#888" }} />
                        ))}
                        {"○".repeat(4 - selectedFile.oppStocks).split("").map((_, i) => (
                          <span key={i} className="w-2 h-2 rounded-full inline-block bg-slate-700" />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stat rows */}
                <div className="divide-y divide-slate-800/60">
                  {Object.keys(stats.p1).map((label) => (
                    <StatRow
                      key={label}
                      label={label}
                      p1={stats.p1[label]}
                      p2={stats.p2[label]}
                      p1Color={CHAR_COLORS[selectedFile.myChar] ?? "#e8533a"}
                      p2Color={CHAR_COLORS[selectedFile.oppChar] ?? "#4a8ef5"}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/40 px-6 py-8 text-center">
                <p className="text-slate-600 text-sm">Load a replay to see match statistics</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CharBadge({ char, size }: { char: string; size: "sm" | "lg" }) {
  const color = CHAR_COLORS[char] ?? "#888888";
  const abbr = char.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  if (size === "lg") {
    return (
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center font-black text-xl text-white shadow-lg"
        style={{ backgroundColor: `${color}28`, border: `2px solid ${color}60`, color }}
      >
        {abbr}
      </div>
    );
  }

  return (
    <div
      className="w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm text-white shrink-0"
      style={{ backgroundColor: `${color}22`, border: `1.5px solid ${color}50`, color }}
    >
      {abbr}
    </div>
  );
}

function SlpCard({ file, selected, onClick }: { file: SlpFile; selected: boolean; onClick: () => void }) {
  const myColor = CHAR_COLORS[file.myChar] ?? "#888";
  const oppColor = CHAR_COLORS[file.oppChar] ?? "#888";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border px-3 py-2.5 transition-all ${
        selected
          ? "bg-slate-800 border-slate-600"
          : "bg-slate-900/60 border-slate-800 hover:bg-slate-800/60 hover:border-slate-700"
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Char badges */}
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ color: myColor, backgroundColor: `${myColor}18` }}
          >
            {file.myChar.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </span>
          <span className="text-slate-700 text-xs">vs</span>
          <span
            className="text-xs font-bold px-1.5 py-0.5 rounded"
            style={{ color: oppColor, backgroundColor: `${oppColor}18` }}
          >
            {file.oppChar.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </span>
        </div>

        {/* Stage + date */}
        <div className="flex-1 min-w-0">
          <div className="text-slate-300 text-xs font-medium truncate">{file.stage}</div>
          <div className="text-slate-600 text-xs">{file.date}</div>
        </div>

        {/* Result + duration */}
        <div className="shrink-0 flex flex-col items-end gap-0.5">
          <span className={`text-xs font-bold ${file.result === "W" ? "text-green-400" : "text-red-400"}`}>
            {file.result}
          </span>
          <span className="text-slate-600 text-xs">{file.duration}</span>
        </div>
      </div>
    </button>
  );
}

function StatRow({
  label, p1, p2, p1Color, p2Color,
}: {
  label: string; p1: string; p2: string; p1Color: string; p2Color: string;
}) {
  const p1Num = parseFloat(p1.replace(/[^0-9.]/g, ""));
  const p2Num = parseFloat(p2.replace(/[^0-9.]/g, ""));
  const hasNumbers = !isNaN(p1Num) && !isNaN(p2Num) && p1 !== "—";
  const p1Pct = hasNumbers ? (p1Num / (p1Num + p2Num)) * 100 : 50;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center px-5 py-3 gap-4">
      <span className="font-mono text-sm font-semibold text-right" style={{ color: p1Color }}>{p1}</span>

      <div className="flex flex-col items-center gap-1.5 w-40">
        <span className="text-slate-500 text-xs text-center">{label}</span>
        {hasNumbers && (
          <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden flex">
            <div
              className="h-full rounded-l-full"
              style={{ width: `${p1Pct}%`, backgroundColor: p1Color }}
            />
            <div
              className="h-full rounded-r-full"
              style={{ width: `${100 - p1Pct}%`, backgroundColor: p2Color }}
            />
          </div>
        )}
      </div>

      <span className="font-mono text-sm font-semibold" style={{ color: p2Color }}>{p2}</span>
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePersistentState, usePrefersReducedMotion } from "@/lib/hooks";
import {
  type Candle,
  accuracyMultiplier,
  candlePath,
  directionalPnl,
  nextCandle,
  pctMove,
  seedCandles,
} from "@/lib/market";
import GameChart from "./GameChart";

const START_BALANCE = 10000;
const ROUND_MS = 2500;
const ROUND_SECONDS = 5;
const LEVERAGES = [1, 5, 10, 25] as const;
const STAKE_CHIPS = [100, 500, 1000] as const;
const KEY = "simex_game_v2";

type Phase = "idle" | "running" | "result";
type Mode = "dir" | "predict";
type Stats = { rounds: number; wins: number; streak: number; best: number; sessionPnl: number };
type HistoryItem = {
  id: number;
  label: string;
  detail: string;
  move: number;
  pnl: number;
  liquidated?: boolean;
};
type Result = {
  mode: Mode;
  pnl: number;
  move: number;
  liquidated?: boolean;
  mult?: number;
  predicted?: number;
  close: number;
};

const ZERO_STATS: Stats = { rounds: 0, wins: 0, streak: 0, best: 0, sessionPnl: 0 };
const fmt = (n: number) => n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const signed = (n: number) => `${n >= 0 ? "+" : "−"}$${fmt(Math.abs(n))}`;

export default function TradeGame() {
  const reduce = usePrefersReducedMotion();

  // Persisted progress.
  const [balance, setBalance, hydrated] = usePersistentState<number>(`${KEY}:bal`, START_BALANCE);
  const [stats, setStats] = usePersistentState<Stats>(`${KEY}:stats`, ZERO_STATS);
  const [history, setHistory] = usePersistentState<HistoryItem[]>(`${KEY}:hist`, []);

  // Ephemeral round state.
  const [candles, setCandles] = useState<Candle[]>([]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [mode, setMode] = useState<Mode>("dir");
  const [lev, setLev] = useState<number>(5);
  const [stakeStr, setStakeStr] = useState("500");
  const [predictStr, setPredictStr] = useState("");
  const [live, setLive] = useState<Candle | null>(null);
  const [entry, setEntry] = useState<number | null>(null);
  const [target, setTarget] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(ROUND_SECONDS);
  const [preview, setPreview] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const idRef = useRef(0);
  const rafRef = useRef(0);

  // Seed the chart on the client only (keeps SSR deterministic / mismatch-free).
  useEffect(() => {
    setCandles(seedCandles(40, 100));
  }, []);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  const lastClose = candles.length ? candles[candles.length - 1].c : 100;
  const stake = Math.max(0, Math.floor(Number(stakeStr) || 0));
  const predicted = Number(predictStr) || 0;
  const broke = hydrated && balance < 1;
  const canBet =
    phase === "idle" &&
    !broke &&
    stake >= 1 &&
    stake <= balance &&
    (mode === "dir" || predicted > 0);

  const settle = useCallback(
    (final: Candle, dir: 1 | -1, st: number, lv: number, m: Mode, pred: number) => {
      setLive(final);
      setCandles((prev) => [...prev, final].slice(-200));

      const move = pctMove(final);
      let pnl = 0;
      let liquidated = false;
      let mult: number | undefined;

      if (m === "dir") {
        const r = directionalPnl(st, lv, dir, move);
        pnl = r.pnl;
        liquidated = r.liquidated;
      } else {
        mult = accuracyMultiplier(pred, final.c, final.o);
        pnl = +(st * mult - st).toFixed(2);
      }

      const won = pnl > 0;
      setBalance((b) => Math.max(0, +(b + pnl).toFixed(2)));
      setStats((s) => ({
        rounds: s.rounds + 1,
        wins: s.wins + (won ? 1 : 0),
        streak: won ? s.streak + 1 : 0,
        best: Math.max(s.best, won ? s.streak + 1 : 0),
        sessionPnl: +(s.sessionPnl + pnl).toFixed(2),
      }));

      idRef.current += 1;
      const label =
        m === "dir" ? (dir === 1 ? `LONG ${lv}×` : `SHORT ${lv}×`) : `PREDICT ${pred.toFixed(2)}`;
      const detail =
        m === "dir"
          ? `$${st.toLocaleString()} · ${(move * 100).toFixed(2)}%`
          : `${mult?.toFixed(2)}× · close ${final.c.toFixed(2)}`;
      setHistory((h) =>
        [{ id: idRef.current, label, detail, move, pnl, liquidated }, ...h].slice(0, 12),
      );

      setResult({ mode: m, pnl, move, liquidated, mult, predicted: pred, close: final.c });
      setPhase("result");
    },
    [setBalance, setStats, setHistory],
  );

  const place = useCallback(
    (dir: 1 | -1) => {
      if (!canBet) return;
      const st = stake;
      const lv = lev;
      const m = mode;
      const pred = predicted;

      const final = nextCandle(lastClose);
      setEntry(final.o);
      setTarget(m === "predict" ? pred : null);
      setResult(null);
      setPreview(0);
      setPhase("running");

      if (reduce) {
        setLive(final);
        settle(final, dir, st, lv, m, pred);
        return;
      }

      const path = candlePath(final);
      let runHi = final.o;
      let runLo = final.o;
      let lastIdx = 0;
      const start = performance.now();

      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / ROUND_MS);
        const idx = Math.floor(p * (path.length - 1));
        for (let k = lastIdx + 1; k <= idx; k++) {
          runHi = Math.max(runHi, path[k]);
          runLo = Math.min(runLo, path[k]);
        }
        lastIdx = idx;
        const cur = path[idx];
        setLive({ o: final.o, h: +runHi.toFixed(2), l: +runLo.toFixed(2), c: cur });
        setCountdown(Math.max(0, Math.ceil((1 - p) * ROUND_SECONDS)));

        const liveMove = (cur - final.o) / final.o;
        setPreview(
          m === "dir"
            ? directionalPnl(st, lv, dir, liveMove).pnl
            : +(st * accuracyMultiplier(pred, cur, final.o) - st).toFixed(2),
        );

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          settle(final, dir, st, lv, m, pred);
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [canBet, stake, lev, mode, predicted, lastClose, reduce, settle],
  );

  const nextRound = () => {
    setPhase("idle");
    setLive(null);
    setEntry(null);
    setTarget(null);
    setResult(null);
    setPreview(0);
  };

  const doReset = () => {
    setBalance(START_BALANCE);
    setStats(ZERO_STATS);
    setHistory([]);
    setCandles(seedCandles(40, 100));
    nextRound();
    setConfirmReset(false);
  };

  const winRate = stats.rounds ? Math.round((stats.wins / stats.rounds) * 100) : 0;

  return (
    <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      {/* ===== Chart panel ===== */}
      <div className="panel relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span
                className={`absolute inline-flex h-full w-full rounded-full bg-accent ${
                  phase === "running" && !reduce ? "animate-ping-soft" : ""
                }`}
              />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="font-mono text-xs font-medium tracking-wide text-ink">
              SIMEX · PERPETUAL
            </span>
          </div>
          <span className="mono-label text-faint">
            {phase === "running" ? `SETTLING 0${countdown}` : `LAST ${lastClose.toFixed(2)}`}
          </span>
        </div>

        <div className="h-[320px] w-full px-1 sm:h-[420px]">
          <GameChart candles={candles} live={live} entry={entry} predicted={target} />
        </div>

        {/* live P/L overlay during a round */}
        {phase === "running" && (
          <div className="pointer-events-none absolute right-4 top-16 text-right">
            <div className="mono-label text-faint">unrealised</div>
            <div
              className={`tnum font-mono text-2xl font-semibold tabular-nums ${
                preview >= 0 ? "text-bid" : "text-ask"
              }`}
            >
              {signed(preview)}
            </div>
          </div>
        )}
      </div>

      {/* ===== Control panel ===== */}
      <div className="flex flex-col gap-4">
        {/* Balance + stats */}
        <div className="panel p-4">
          <div className="flex items-end justify-between">
            <div>
              <div className="mono-label text-faint">Balance · play money</div>
              <div className="tnum mt-1 font-mono text-3xl font-semibold tabular-nums text-ink">
                ${hydrated ? fmt(balance) : fmt(START_BALANCE)}
              </div>
            </div>
            <div className="text-right">
              <div className="mono-label text-faint">Session</div>
              <div
                className={`tnum font-mono text-sm font-semibold tabular-nums ${
                  stats.sessionPnl >= 0 ? "text-bid" : "text-ask"
                }`}
              >
                {signed(stats.sessionPnl)}
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Stat label="Win rate" value={`${winRate}%`} />
            <Stat label="Streak" value={`${stats.streak}`} sub={`best ${stats.best}`} />
            <Stat label="Rounds" value={`${stats.rounds}`} />
          </div>
        </div>

        {/* Bet / result */}
        {phase === "result" && result ? (
          <ResultCard result={result} onNext={nextRound} broke={broke} />
        ) : (
          <div className="panel p-4">
            {/* mode toggle */}
            <div className="grid grid-cols-2 gap-1 rounded-lg border border-line bg-base/50 p-1">
              <ModeTab active={mode === "dir"} onClick={() => setMode("dir")}>
                Long / Short
              </ModeTab>
              <ModeTab
                active={mode === "predict"}
                onClick={() => {
                  setMode("predict");
                  if (!predictStr) setPredictStr(lastClose.toFixed(2));
                }}
              >
                Predict close
              </ModeTab>
            </div>

            {/* stake */}
            <label className="mono-label mb-2 mt-4 block text-faint" htmlFor="stake">
              Stake
            </label>
            <div className="flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-lg border border-line bg-base/60 px-3">
                <span className="font-mono text-sm text-faint">$</span>
                <input
                  id="stake"
                  inputMode="numeric"
                  value={stakeStr}
                  onChange={(e) => setStakeStr(e.target.value.replace(/[^0-9]/g, ""))}
                  disabled={phase !== "idle" || broke}
                  className="w-full bg-transparent px-2 py-2.5 font-mono text-sm text-ink outline-none"
                />
              </div>
              {STAKE_CHIPS.map((c) => (
                <Chip key={c} onClick={() => setStakeStr(String(c))} disabled={phase !== "idle"}>
                  {c >= 1000 ? `${c / 1000}k` : c}
                </Chip>
              ))}
              <Chip
                onClick={() => setStakeStr(String(Math.floor(balance)))}
                disabled={phase !== "idle"}
              >
                Max
              </Chip>
            </div>

            {mode === "dir" ? (
              <>
                {/* leverage */}
                <div className="mono-label mb-2 mt-4 text-faint">Leverage</div>
                <div className="grid grid-cols-4 gap-2">
                  {LEVERAGES.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLev(l)}
                      disabled={phase !== "idle"}
                      className={`rounded-lg border py-2 font-mono text-sm transition-colors ${
                        lev === l
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-line text-muted hover:border-line-strong hover:text-ink"
                      }`}
                    >
                      {l}×
                    </button>
                  ))}
                </div>

                {/* long / short */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => place(1)}
                    disabled={!canBet}
                    className="group flex items-center justify-center gap-2 rounded-lg border border-bid/40 bg-bid/10 py-3.5 font-semibold text-bid transition-all hover:bg-bid/20 disabled:opacity-40"
                  >
                    <span className="font-mono">▲</span> LONG
                  </button>
                  <button
                    type="button"
                    onClick={() => place(-1)}
                    disabled={!canBet}
                    className="group flex items-center justify-center gap-2 rounded-lg border border-ask/40 bg-ask/10 py-3.5 font-semibold text-ask transition-all hover:bg-ask/20 disabled:opacity-40"
                  >
                    <span className="font-mono">▼</span> SHORT
                  </button>
                </div>
              </>
            ) : (
              <>
                <label className="mono-label mb-2 mt-4 block text-faint" htmlFor="predict">
                  Predicted close — closer = bigger payout (up to 10×)
                </label>
                <input
                  id="predict"
                  inputMode="decimal"
                  value={predictStr}
                  placeholder={lastClose.toFixed(2)}
                  onChange={(e) => setPredictStr(e.target.value.replace(/[^0-9.]/g, ""))}
                  disabled={phase !== "idle" || broke}
                  className="w-full rounded-lg border border-line bg-base/60 px-3 py-2.5 font-mono text-sm text-ink outline-none focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => place(1)}
                  disabled={!canBet}
                  className="mt-4 w-full rounded-lg bg-accent py-3.5 font-semibold text-base transition-all hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-40"
                >
                  Place prediction
                </button>
              </>
            )}

            {broke && (
              <p className="mt-3 text-center font-mono text-xs text-ask">
                Bankrupt — reset to play again.
              </p>
            )}
          </div>
        )}

        {/* History + reset */}
        <div className="panel p-4">
          <div className="flex items-center justify-between">
            <span className="mono-label text-faint">History</span>
            {confirmReset ? (
              <span className="flex items-center gap-2 font-mono text-[11px]">
                <button onClick={doReset} className="text-ask hover:underline" type="button">
                  confirm reset
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="text-faint hover:text-ink"
                  type="button"
                >
                  cancel
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="font-mono text-[11px] uppercase tracking-wider text-faint transition-colors hover:text-accent"
              >
                Reset
              </button>
            )}
          </div>
          <div className="mt-3 space-y-1">
            {history.length === 0 ? (
              <p className="py-3 text-center font-mono text-xs text-faint">No rounds yet.</p>
            ) : (
              history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between border-b border-line/60 py-1.5 font-mono text-xs last:border-0"
                >
                  <span className="text-muted">{h.label}</span>
                  <span className="text-faint">{h.detail}</span>
                  <span className={h.pnl >= 0 ? "text-bid" : "text-ask"}>
                    {h.liquidated ? "LIQ " : ""}
                    {signed(h.pnl)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="text-center font-mono text-[10px] leading-relaxed text-faint">
          Play money only · simulated market · not financial advice · no real wagering
        </p>
      </div>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-line bg-base/40 px-3 py-2">
      <div className="mono-label text-faint">{label}</div>
      <div className="tnum mt-0.5 font-mono text-lg font-semibold tabular-nums text-ink">{value}</div>
      {sub && <div className="font-mono text-[10px] text-faint">{sub}</div>}
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md py-2 text-sm font-medium transition-colors ${
        active ? "bg-surface-2 text-ink" : "text-faint hover:text-muted"
      }`}
    >
      {children}
    </button>
  );
}

function Chip({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="rounded-lg border border-line px-2.5 py-2.5 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
    >
      {children}
    </button>
  );
}

function ResultCard({
  result,
  onNext,
  broke,
}: {
  result: Result;
  onNext: () => void;
  broke: boolean;
}) {
  const won = result.pnl > 0;
  return (
    <div className="panel p-5 text-center">
      <div className="mono-label text-faint">
        {result.liquidated
          ? "Liquidated"
          : result.mode === "predict"
            ? `Accuracy ${result.mult?.toFixed(2)}×`
            : won
              ? "Profit"
              : "Loss"}
      </div>
      <div
        className={`tnum mt-2 font-mono text-4xl font-semibold tabular-nums ${
          won ? "text-bid" : "text-ask"
        }`}
      >
        {signed(result.pnl)}
      </div>
      <p className="mt-2 font-mono text-xs text-faint">
        Candle closed {result.close.toFixed(2)} · {(result.move * 100).toFixed(2)}%
        {result.mode === "predict" && result.predicted
          ? ` · you said ${result.predicted.toFixed(2)}`
          : ""}
      </p>
      <button
        type="button"
        onClick={onNext}
        disabled={broke}
        className="mt-5 w-full rounded-lg bg-accent py-3 text-sm font-semibold text-base transition-all hover:-translate-y-0.5 disabled:opacity-40"
      >
        {broke ? "Out of funds — reset below" : "Next round"}
      </button>
    </div>
  );
}

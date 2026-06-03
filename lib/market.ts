// Play-money market simulation for the /play game. Pure functions — no state,
// no side effects. All randomness is client-runtime only (never during SSR).

export type Candle = { o: number; h: number; l: number; c: number };

const VOL = 0.013; // base per-candle volatility (~1.3% std)
const PREDICT_BAND = 0.02; // miss ≥2% of price → 0× payout
const PREDICT_MAX = 10; // bullseye multiplier

/** Roughly-normal noise in [-~1, ~1] via the central limit trick. */
function gauss(): number {
  return (Math.random() + Math.random() + Math.random() + Math.random() - 2) / 2;
}

/** Generate the next OHLC candle from the previous close (random walk). */
export function nextCandle(prevClose: number): Candle {
  const o = prevClose;
  const c = Math.max(1, o * (1 + gauss() * VOL));
  const wick = (0.25 + Math.random() * 1.1) * VOL;
  const h = Math.max(o, c) * (1 + Math.random() * wick);
  const l = Math.min(o, c) * (1 - Math.random() * wick);
  return {
    o: +o.toFixed(2),
    h: +h.toFixed(2),
    l: +l.toFixed(2),
    c: +c.toFixed(2),
  };
}

/** Seed an initial series of `n` candles starting from `start`. */
export function seedCandles(n: number, start = 100): Candle[] {
  const out: Candle[] = [];
  let prev = start;
  for (let i = 0; i < n; i++) {
    const candle = nextCandle(prev);
    out.push(candle);
    prev = candle.c;
  }
  return out;
}

/** Signed percentage move of a candle (close vs open). */
export function pctMove(c: Candle): number {
  return (c.c - c.o) / c.o;
}

/**
 * Directional P/L for a leveraged position. Loss is capped at the staked
 * margin (a liquidation), upside is uncapped.
 */
export function directionalPnl(
  stake: number,
  leverage: number,
  dir: 1 | -1,
  move: number,
): { pnl: number; liquidated: boolean } {
  const raw = stake * leverage * move * dir;
  if (raw <= -stake) return { pnl: -stake, liquidated: true };
  return { pnl: +raw.toFixed(2), liquidated: false };
}

/**
 * Accuracy multiplier for the "predict the close" mode: 10× at a bullseye,
 * decaying linearly to 0 once the prediction is `PREDICT_BAND` of price off.
 */
export function accuracyMultiplier(
  predicted: number,
  actual: number,
  refPrice: number,
): number {
  const err = Math.abs(actual - predicted) / refPrice;
  return +Math.max(0, PREDICT_MAX * (1 - err / PREDICT_BAND)).toFixed(2);
}

/**
 * Pre-compute a tick-by-tick price path for a candle that starts at the open,
 * touches the high and low, and ends exactly at the close — so the live reveal
 * animation traces a believable intrabar wander.
 */
export function candlePath(c: Candle, steps = 72): number[] {
  const hiIdx = 1 + Math.floor(Math.random() * (steps - 2));
  let loIdx = 1 + Math.floor(Math.random() * (steps - 2));
  if (loIdx === hiIdx) loIdx = (hiIdx + Math.floor(steps / 2)) % (steps - 1) || 1;

  const waypoints = new Map<number, number>([
    [0, c.o],
    [hiIdx, c.h],
    [loIdx, c.l],
    [steps - 1, c.c],
  ]);
  const keys = [...waypoints.keys()].sort((a, b) => a - b);
  const range = c.h - c.l || 1;

  const path: number[] = [];
  for (let i = 0; i < steps; i++) {
    let lo = keys[0];
    let hi = keys[keys.length - 1];
    for (let k = 0; k < keys.length - 1; k++) {
      if (i >= keys[k] && i <= keys[k + 1]) {
        lo = keys[k];
        hi = keys[k + 1];
        break;
      }
    }
    const t = hi === lo ? 0 : (i - lo) / (hi - lo);
    const base = waypoints.get(lo)! + (waypoints.get(hi)! - waypoints.get(lo)!) * t;
    const noise = (Math.random() - 0.5) * range * 0.07;
    path.push(+Math.min(c.h, Math.max(c.l, base + noise)).toFixed(2));
  }
  path[0] = c.o;
  path[steps - 1] = c.c;
  return path;
}

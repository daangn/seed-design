export type PullToRefreshState = "idle" | "pulling" | "ready" | "loading";

export interface PullToRefreshContext {
  y0: number;
  y: number;
  displacement: number;
  displacementRatio: number;
}

export interface PullEngine {
  state: PullToRefreshState;
  context: PullToRefreshContext;
  origin: number | null;
}

export interface PullConfig {
  threshold: number;
  displacementMultiplier: number;
  indicatorSize: number;
  disabled: boolean;
  hasRefresh: boolean;
}

export type PullEffect =
  | { type: "start" | "move" | "end"; context: PullToRefreshContext }
  | { type: "ready" | "refresh" };

const RUBBER_BAND_COEFFICIENT = 0.55;

function context(y0 = 0, y = -1, displacement = 0, threshold = 88): PullToRefreshContext {
  return { y0, y, displacement, displacementRatio: Math.min(displacement / threshold, 1) };
}

export function createPullEngine(): PullEngine {
  return { state: "idle", context: context(), origin: null };
}

export function beginPull(engine: PullEngine, y: number): void {
  engine.origin = y;
}

export function movePull(
  engine: PullEngine,
  config: PullConfig,
  y: number,
  scrollTop: number,
  prevented: boolean,
): PullEffect[] {
  if (config.disabled || prevented || engine.state === "loading") return [];
  if (engine.state === "idle") {
    if (engine.origin === null || scrollTop > 0 || y <= engine.origin) return [];
    engine.context = context(y, y, 0, config.threshold);
    engine.state = "pulling";
    return [{ type: "start", context: engine.context }];
  }
  const raw = (y - engine.context.y0) * config.displacementMultiplier;
  const limit = Math.max(config.indicatorSize, config.threshold);
  const excess = raw - limit;
  const displacement =
    raw <= limit
      ? raw
      : limit +
        (excess * limit * RUBBER_BAND_COEFFICIENT) / (limit + RUBBER_BAND_COEFFICIENT * excess);
  engine.context = context(
    displacement <= 0 ? y : engine.context.y0,
    y,
    Math.max(0, displacement),
    config.threshold,
  );
  engine.state = displacement > config.threshold ? "ready" : "pulling";
  return engine.state === "ready"
    ? [{ type: "move", context: engine.context }, { type: "ready" }]
    : [{ type: "move", context: engine.context }];
}

export function endPull(engine: PullEngine, config: PullConfig): PullEffect[] {
  engine.origin = null;
  if (config.disabled || engine.state === "loading" || engine.state === "idle") return [];
  const effects: PullEffect[] = [{ type: "end", context: engine.context }];
  if (engine.state === "ready" && config.hasRefresh) {
    engine.state = "loading";
    engine.context = context(0, -1, config.threshold, config.threshold);
    effects.push({ type: "refresh" });
  } else {
    engine.state = "idle";
    engine.context = context();
  }
  return effects;
}

export function cancelPull(engine: PullEngine): PullEffect[] {
  engine.origin = null;
  if (engine.state !== "pulling" && engine.state !== "ready") return [];
  engine.state = "idle";
  engine.context = context();
  return [{ type: "end", context: engine.context }];
}

export function settlePull(engine: PullEngine): void {
  if (engine.state !== "loading") return;
  engine.state = "idle";
  engine.context = context();
}

export function ease(time: number): number {
  const x = Math.max(0, Math.min(1, time));
  let low = 0;
  let high = 1;
  let t = x;
  for (let i = 0; i < 20; i++) {
    const sample = ((t - 0.75) * t + 0.75) * t;
    if (Math.abs(sample - x) < 0.000001) break;
    if (sample < x) low = t;
    else high = t;
    t = (low + high) / 2;
  }
  return ((-1.7 * t + 2.4) * t + 0.3) * t;
}

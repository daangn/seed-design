import { describe, expect, it } from "vitest";
import {
  beginPull,
  cancelPull,
  createPullEngine,
  endPull,
  movePull,
  settlePull,
  ease,
  type PullConfig,
} from "./engine";

const config: PullConfig = {
  threshold: 88,
  displacementMultiplier: 0.75,
  indicatorSize: 88,
  disabled: false,
  hasRefresh: true,
};
const reset = { y0: 0, y: -1, displacement: 0, displacementRatio: 0 };

function pulling() {
  const engine = createPullEngine();
  beginPull(engine, 100);
  movePull(engine, config, 110, 0, false);
  return engine;
}

describe("당김 행동", () => {
  it("같은 contact의 아래 이동·최상단·enabled·보호 영역 밖에서만 진입한다", () => {
    const engine = createPullEngine();
    expect(movePull(engine, config, 110, 0, false)).toEqual([]);
    beginPull(engine, 100);
    for (const [y, top, prevented, disabled] of [
      [90, 0, false, false],
      [110, 1, false, false],
      [110, 0, true, false],
      [110, 0, false, true],
    ] as const) {
      expect(movePull(engine, { ...config, disabled }, y, top, prevented)).toEqual([]);
    }
    expect(movePull(engine, config, 110, 0, false)).toEqual([
      { type: "start", context: { y0: 110, y: 110, displacement: 0, displacementRatio: 0 } },
    ]);
    expect(engine.state).toBe("pulling");
  });

  it("threshold와 같으면 pulling이며 위에서는 move 다음 ready를 매번 알린다", () => {
    const engine = pulling();
    movePull(engine, { ...config, displacementMultiplier: 1 }, 198, 0, false);
    expect(engine.state).toBe("pulling");
    expect(engine.context.displacement).toBe(88);
    for (const y of [230, 240]) {
      const effects = movePull(engine, config, y, 0, false);
      expect(effects.map((effect) => effect.type)).toEqual(["move", "ready"]);
      expect(engine.context.displacementRatio).toBe(1);
    }
    movePull(engine, config, 150, 0, false);
    expect(engine.state).toBe("pulling");
  });

  it("위로 넘긴 손가락을 origin이 따라가므로 아래로 되돌릴 때 즉시 다시 이동한다", () => {
    const engine = pulling();
    expect(movePull(engine, config, 80, 0, false)).toEqual([
      { type: "move", context: { y0: 80, y: 80, displacement: 0, displacementRatio: 0 } },
    ]);
    movePull(engine, config, 100, 0, false);
    expect(engine.context.displacement).toBe(15);
  });

  it("ready release는 최종 end 다음 refresh이며 loading 중 모든 입력을 무시한다", () => {
    const engine = pulling();
    movePull(engine, config, 250, 0, false);
    expect(endPull(engine, config)).toEqual([
      { type: "end", context: expect.objectContaining({ y0: 110, y: 250, displacementRatio: 1 }) },
      { type: "refresh" },
    ]);
    expect(engine.state).toBe("loading");
    expect(engine.context).toEqual({ ...reset, displacement: 88, displacementRatio: 1 });
    beginPull(engine, 50);
    expect(movePull(engine, config, 350, 0, false)).toEqual([]);
    expect(endPull(engine, config)).toEqual([]);
    expect(cancelPull(engine)).toEqual([]);
    expect(engine.state).toBe("loading");
    settlePull(engine);
    expect(engine.state).toBe("idle");
    expect(engine.context).toEqual(reset);
  });

  it("기준 이하 또는 refresh 없는 ready release는 refresh 없이 리셋한다", () => {
    for (const [y, hasRefresh] of [
      [150, true],
      [250, false],
    ] as const) {
      const engine = pulling();
      movePull(engine, config, y, 0, false);
      expect(endPull(engine, { ...config, hasRefresh }).map((effect) => effect.type)).toEqual([
        "end",
      ]);
      expect(engine.state).toBe("idle");
      expect(engine.context).toEqual(reset);
      expect(movePull(engine, config, 500, 0, false)).toEqual([]);
    }
  });

  it("cancel과 disabled 중단은 end 전에 context를 리셋하고 contact를 제거한다", () => {
    for (const y of [150, 250]) {
      const engine = pulling();
      movePull(engine, config, y, 0, false);
      expect(cancelPull(engine)).toEqual([{ type: "end", context: reset }]);
      expect(engine.state).toBe("idle");
      expect(movePull(engine, config, 500, 0, false)).toEqual([]);
    }
  });

  it("Indicator 높이까지 선형이고 이후 저항은 유한한 한계에 접근하며 역방향도 같은 곡선을 따른다", () => {
    const engine = pulling();
    const options = { ...config, threshold: 100, indicatorSize: 100, displacementMultiplier: 1 };
    const move = (raw: number) => {
      const effect = movePull(engine, options, 110 + raw, 0, false)[0];
      if (effect.type !== "move") throw new Error("이동 콜백이 없습니다.");
      return effect.context.displacement;
    };
    expect(move(25)).toBe(25);
    expect(move(100)).toBe(100);
    expect(engine.state).toBe("pulling");
    const forward = move(300);
    expect(forward).toBeCloseTo(152.380952, 5);
    expect(engine.state).toBe("ready");
    let previous = 100;
    for (const raw of [101, 120, 200, 1000, 100000]) {
      const displacement = move(raw);
      expect(displacement).toBeGreaterThan(previous);
      expect(displacement).toBeLessThan(200);
      previous = displacement;
    }
    expect(move(300)).toBe(forward);
    expect(move(25)).toBe(25);
    expect(engine.context.displacementRatio).toBe(0.25);
    expect(engine.state).toBe("pulling");
  });

  it("Indicator가 threshold보다 작아도 저항 시작점을 threshold로 두어 ready에 도달한다", () => {
    const engine = pulling();
    movePull(engine, { ...config, indicatorSize: 24 }, 230, 0, false);
    expect(engine.state).toBe("ready");
    expect(engine.context.displacement).toBeGreaterThan(88);
    expect(engine.context.displacement).toBeLessThan(90);
    expect(engine.context.displacementRatio).toBe(1);
  });

  it("CSS ease는 중간에 선형보다 먼저 이동하며 양 끝을 정확히 맞춘다", () => {
    expect(ease(0)).toBe(0);
    expect(ease(1)).toBeCloseTo(1);
    expect(ease(0.5)).toBeCloseTo(0.8024, 3);
  });
});

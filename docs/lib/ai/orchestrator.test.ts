import { describe, expect, it } from "bun:test";
import {
  generateOrchestrationPlan,
  shouldUsePlanningStage,
} from "./orchestrator";
import { createToolDescriptor, type ToolDescriptor } from "./tool-registry";

const TOOL_CATALOG: ToolDescriptor[] = [
  createToolDescriptor({
    name: "showInstallation",
    source: "client",
    capability: "install",
    description: "install",
  }),
  createToolDescriptor({
    name: "showComponentExample",
    source: "client",
    capability: "preview",
    description: "preview",
  }),
  createToolDescriptor({
    name: "showReactTypeTable",
    source: "client",
    capability: "types",
    description: "types",
  }),
];

describe("orchestrator", () => {
  it("enables planning stage for complex query", () => {
    const enabled = shouldUsePlanningStage({
      question: "설치 방법 알려주고 그다음 예시 코드랑 props도 같이 정리해줘",
      toolCatalog: TOOL_CATALOG,
      isComponentGuide: false,
    });

    expect(enabled).toBe(true);
  });

  it("skips planning stage for short component guide question", () => {
    const enabled = shouldUsePlanningStage({
      question: "ActionButton 사용법 알려줘",
      toolCatalog: TOOL_CATALOG,
      isComponentGuide: true,
    });

    expect(enabled).toBe(false);
  });

  it("falls back to heuristic sequence when model orchestration fails", async () => {
    const plan = await generateOrchestrationPlan({
      question: "AlertDialog 설치 방법 알려줘",
      toolCatalog: TOOL_CATALOG,
      model: {} as never,
    });

    expect(plan).not.toBeNull();
    expect(plan?.toolSequence).toEqual(["showInstallation", "showComponentExample"]);
  });
});

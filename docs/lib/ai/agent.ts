import { ToolLoopAgent, stepCountIs, type LanguageModel, type Tool, type ToolSet } from "ai";
import type { OrchestrationPlan } from "./orchestrator";

export interface SeedAssistantAgentOptions {
  model: LanguageModel;
  tools: Record<string, Tool>;
  instructions: string;
  orchestrationPlan?: OrchestrationPlan | null;
  maxSteps?: number;
}

function resolveActiveTools(
  stepNumber: number,
  toolNames: Set<string>,
  orchestrationPlan?: OrchestrationPlan | null,
): string[] | undefined {
  if (!orchestrationPlan || orchestrationPlan.toolSequence.length === 0) {
    return undefined;
  }

  const plannedTool = orchestrationPlan.toolSequence[stepNumber];
  if (!plannedTool) {
    return undefined;
  }

  if (!toolNames.has(plannedTool)) {
    return undefined;
  }

  return [plannedTool];
}

export function createSeedAssistantAgent(options: SeedAssistantAgentOptions) {
  const toolNames = new Set(Object.keys(options.tools));

  return new ToolLoopAgent({
    id: "seed-docs-assistant",
    model: options.model,
    instructions: options.instructions,
    tools: options.tools as ToolSet,
    stopWhen: stepCountIs(options.maxSteps ?? 12),
    prepareStep: async ({ stepNumber }) => {
      const activeTools = resolveActiveTools(stepNumber, toolNames, options.orchestrationPlan);

      if (!activeTools || activeTools.length === 0) {
        return undefined;
      }

      return {
        activeTools,
      };
    },
  });
}

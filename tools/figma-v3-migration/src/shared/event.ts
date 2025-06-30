import { createEventSystem } from "@figmazing/event";
import type {
  FigmaMetadata,
  GroupedSerializedTextStyleSuggestionsResults,
  InstanceInfo,
  SerializedBaseNode,
  SerializedColorVariablesSuggestionsResults,
  SerializedVariable,
  SwapResult,
} from "./types";

// 이벤트 타입 정의
interface PluginEventMap {
  "announce-selection": {
    serializedSelections: SerializedBaseNode[];
  };
  "announce-target": {
    serializedTargets: SerializedBaseNode[];
  };
  "request-announce-target": {
    nodeIds: string[];
  };
  "focus-node": {
    nodeIds: string[];
  };
  "send-figma-metadata": FigmaMetadata;
  "request-text-style-suggestions": {};
  "suggest-text-styles": {
    results: GroupedSerializedTextStyleSuggestionsResults;
  };
  "apply-text-style": {
    textNodeIds: string[];
    textStyleId: string;
  };
  "request-color-suggestions": {
    nodeIds?: string[];
  };
  "suggest-color-variables": {
    results: SerializedColorVariablesSuggestionsResults;
  };
  "apply-color-variable": {
    oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"];
    consumerNodeIds: SerializedColorVariablesSuggestionsResults[number]["consumers"][number]["node"]["id"][];
    variableId: SerializedVariable["id"];
  };
  "request-component-suggestions": {};
  "suggest-components": {
    results: InstanceInfo[];
  };
  "swap-component": {
    instanceNode: InstanceInfo;
    selectedVariants: Record<string, string>;
  };
  "swap-all-components": {
    instanceNodes: InstanceInfo[];
    selectedVariants: Record<string, string>;
  };
  "swap-result": {
    results: SwapResult;
  };
  "get-selected-info": {};
}

export const events = createEventSystem<PluginEventMap>();

import {
  SYSTEM_COMPONENT_KEYS_ALL,
  SYSTEM_COMPONENT_KEYS_V3_ONLY,
} from "@/features/design-system/data/component";
import { applyColorVariable } from "@/features/design-system/services/apply-color-variable";
import { applyTextStyles } from "@/features/design-system/services/apply-text-style";
import {
  applyLayoutVariable,
  applySizingVariable,
  applyStrokeWeightOrCornerRadiusVariable,
} from "@/features/design-system/services/apply-unit-variable";
import { getColorVariableSuggestions } from "@/features/design-system/services/get-color-variable-suggestions";
import { getComponentInSceneNodes } from "@/features/design-system/services/get-component-in-selection";
import { getSerializedTextStyleSuggestions } from "@/features/design-system/services/get-text-style-suggestions";
import {
  getSerializedLayoutVariableSuggestions,
  getSerializedSizingVariableSuggestions,
  getSerializedStrokeWeightAndCornerRadiusVariableSuggestions,
} from "@/features/design-system/services/get-unit-variable-suggestions";
import { swapComponent } from "@/features/design-system/services/swap-component";
import type {
  AnnounceSelectionsEventHandler,
  AnnounceTargetsEventHandler,
  ApplyColorVariableEventHandler,
  ApplyLayoutVariableEventHandler,
  ApplySizingVariableEventHandler,
  ApplyStrokeWeightAndCornerRadiusVariableEventHandler,
  ApplyTextStyleEventHandler,
  CheckComponentEventHandler,
  DebugEventHandler,
  FocusNodeEventHandler,
  NotifyEventHandler,
  RequestAnnounceTargetsEventHandler,
  RequestColorSuggestionsEventHandler,
  RequestLayoutSuggestionsEventHandler,
  RequestSizingSuggestionsEventHandler,
  RequestStrokeWeightAndCornerRadiusSuggestionsEventHandler,
  RequestTextStyleSuggestionsEventHandler,
  SendComponentInfoEventHandler,
  SendFigmaMetadataEventHandler,
  SendPreferencesEventHandler,
  SuggestColorVariablesEventHandler,
  SuggestLayoutVariablesEventHandler,
  SuggestSizingVariablesEventHandler,
  SuggestStrokeWeightAndCornerRadiusVariablesEventHandler,
  SuggestTextStylesEventHandler,
  SwapAllComponentsEventHandler,
  SwapComponentEventHandler,
  SwapResultEventHandler,
  UpdatePreferencesEventHandler,
} from "@/features/design-system/types";
import { logError, logEvent } from "@/features/design-system/utils/log";
import {
  areSceneNodesWithinReferenceSceneNodes,
  serializeBaseNode,
} from "@/features/design-system/utils/nodes";
import { SETTINGS_KEY } from "@/shared/constants";
import { DEFAULT_PREFERENCES } from "@/shared/contexts/PreferencesProvider";
import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import { getFigmaMetadata } from "./services/get-figma-metadata";
import { getSelectedComponentInfo } from "./services/get-selected-info";
import { notify } from "./services/notify";

export default async function () {
  showUI({ width: 500, height: 800 });

  // XXX
  figma.skipInvisibleInstanceChildren = true;

  let currentTarget: SceneNode[] = [...figma.currentPage.selection];
  let currentPreferences = await loadSettingsAsync(DEFAULT_PREFERENCES, SETTINGS_KEY);

  emit<SendFigmaMetadataEventHandler>("SEND_FIGMA_METADATA", getFigmaMetadata());
  emit<SendPreferencesEventHandler>("SEND_PREFERENCES", { preferences: currentPreferences });

  figma.on("selectionchange", () => {
    const currentSelections = [...figma.currentPage.selection];

    emit<AnnounceSelectionsEventHandler>("ANNOUNCE_SELECTION", {
      serializedSelections: currentSelections.map(serializeBaseNode),
    });

    if (currentSelections.length !== 1) return;

    if (
      currentTarget.length === 1 &&
      areSceneNodesWithinReferenceSceneNodes(currentSelections, currentTarget) === false
    ) {
      currentTarget = [...currentSelections];

      emit<AnnounceTargetsEventHandler>("ANNOUNCE_TARGET", {
        serializedTargets: currentTarget.map(serializeBaseNode),
      });
    }

    if (currentTarget.length === 0) {
      currentTarget = [...currentSelections];

      emit<AnnounceTargetsEventHandler>("ANNOUNCE_TARGET", {
        serializedTargets: currentTarget.map(serializeBaseNode),
      });
    }
  });

  figma.on("selectionchange", getSelectedInfo);

  emit<AnnounceSelectionsEventHandler>("ANNOUNCE_SELECTION", {
    serializedSelections: currentTarget.map(serializeBaseNode),
  });

  emit<AnnounceTargetsEventHandler>("ANNOUNCE_TARGET", {
    serializedTargets: currentTarget.map(serializeBaseNode),
  });

  on<UpdatePreferencesEventHandler>("UPDATE_PREFERENCES", async ({ preferences }) => {
    await saveSettingsAsync(preferences, SETTINGS_KEY);
    currentPreferences = preferences;
  });

  on<FocusNodeEventHandler>("FOCUS_NODE", async ({ nodeIds }) => {
    const nodes = (
      await Promise.all(nodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId)))
    ).filter((node) => node !== null && node.type !== "DOCUMENT" && node.type !== "PAGE");

    figma.currentPage.selection = nodes;
  });

  on<RequestAnnounceTargetsEventHandler>("REQUEST_ANNOUNCE_TARGET", async ({ nodeIds }) => {
    const nodes = (
      await Promise.all(nodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId)))
    ).filter((node) => node !== null && node.type !== "DOCUMENT" && node.type !== "PAGE");

    emit<AnnounceTargetsEventHandler>("ANNOUNCE_TARGET", {
      serializedTargets: nodes.map(serializeBaseNode),
    });
  });

  on<CheckComponentEventHandler>("CHECK_COMPONENT", async (targetIds) => {
    const components = await getComponentInSceneNodes({ nodeIds: targetIds });
    emit<SendComponentInfoEventHandler>("SEND_COMPONENT_INFO", components);
  });

  on<SwapComponentEventHandler>("SWAP_COMPONENT", async (instanceNode, selectedVariants = {}) => {
    const result = await swapComponent(instanceNode, selectedVariants);
    emit<SwapResultEventHandler>("SWAP_RESULT", result);
  });

  on<SwapAllComponentsEventHandler>(
    "SWAP_ALL_COMPONENTS",
    async (instanceNodes, selectedVariants = {}) => {
      const results = await Promise.all(
        instanceNodes.map((instanceNode) => swapComponent(instanceNode, selectedVariants)),
      );
      const swapResult = Object.assign({}, ...results);

      logEvent({
        event: "swap_all_components",
        properties: {
          swapResult,
          swapCount: Object.keys(swapResult).length,
        },
        currentTarget: currentTarget[0],
      });

      emit<SwapResultEventHandler>("SWAP_RESULT", swapResult);
    },
  );

  on<NotifyEventHandler>("NOTIFY", async ({ message }) => {
    notify(message);
  });

  on<RequestTextStyleSuggestionsEventHandler>(
    "REQUEST_TEXT_STYLE_SUGGESTIONS",
    async ({ nodeIds }) => {
      try {
        const results = await getSerializedTextStyleSuggestions({
          nodeIds,
          systemComponentKeys:
            currentPreferences["inspect-v2-components-on-text-style-migration"] === true
              ? SYSTEM_COMPONENT_KEYS_V3_ONLY
              : SYSTEM_COMPONENT_KEYS_ALL,
        });

        emit<SuggestTextStylesEventHandler>("SUGGEST_TEXT_STYLES", { results });

        logEvent({
          event: "request_text_style_suggestions",
          properties: {
            nodeIds,
            results,
          },
          currentTarget: currentTarget[0],
        });
      } catch (error) {
        if (error instanceof Error === false) return;

        logError({
          event: "request_text_style_suggestions",
          error,
          properties: { nodeIds },
          currentTarget: currentTarget[0],
        });
      }
    },
  );

  on<ApplyTextStyleEventHandler>("APPLY_TEXT_STYLE", async ({ textNodeIds, textStyleId }) => {
    await applyTextStyles(textNodeIds, textStyleId);

    figma.commitUndo();

    logEvent({
      event: "apply_text_style",
      properties: {
        textNodeIds,
        textNodeCount: textNodeIds.length,
        textStyleId,
      },
      currentTarget: currentTarget[0],
    });
  });

  on<RequestColorSuggestionsEventHandler>("REQUEST_COLOR_SUGGESTIONS", async ({ nodeIds }) => {
    try {
      const results = await getColorVariableSuggestions({
        nodeIds,
        systemComponentKeys:
          currentPreferences["inspect-v2-components-on-color-migration"] === true
            ? SYSTEM_COMPONENT_KEYS_V3_ONLY
            : SYSTEM_COMPONENT_KEYS_ALL,
      });

      emit<SuggestColorVariablesEventHandler>("SUGGEST_COLOR_VARIABLES", { results });

      logEvent({
        event: "request_color_suggestions",
        properties: {
          nodeIds,
          results,
        },
        currentTarget: currentTarget[0],
      });
    } catch (error) {
      if (error instanceof Error === false) return;

      logError({
        event: "request_color_suggestions",
        error,
        properties: { nodeIds },
        currentTarget: currentTarget[0],
      });
    }
  });

  on<ApplyColorVariableEventHandler>(
    "APPLY_COLOR_VARIABLE",
    async ({ oldValue, consumerNodeIds, variableId }) => {
      await applyColorVariable({ oldValue, consumerNodeIds, variableId });

      figma.commitUndo();

      logEvent({
        event: "apply_color_variable",
        properties: {
          oldValue,
          consumerNodeIds,
          consumerNodeCount: consumerNodeIds.length,
          variableId,
        },
        currentTarget: currentTarget[0],
      });
    },
  );

  on<RequestSizingSuggestionsEventHandler>("REQUEST_SIZING_SUGGESTIONS", async ({ nodeIds }) => {
    try {
      const results = await getSerializedSizingVariableSuggestions({
        nodeIds,
        systemComponentKeys: SYSTEM_COMPONENT_KEYS_ALL,
      });

      emit<SuggestSizingVariablesEventHandler>("SUGGEST_SIZING_VARIABLES", { results });

      logEvent({
        event: "request_sizing_suggestions",
        properties: {
          nodeIds,
          results,
        },
        currentTarget: currentTarget[0],
      });
    } catch (error) {
      if (error instanceof Error === false) return;

      logError({
        event: "request_sizing_suggestions",
        error,
        properties: { nodeIds },
        currentTarget: currentTarget[0],
      });
    }
  });

  on<ApplySizingVariableEventHandler>(
    "APPLY_SIZING_VARIABLE",
    async ({ oldValue, consumerNodeIds, variableId }) => {
      await applySizingVariable({ oldValue, consumerNodeIds, variableId });

      figma.commitUndo();

      logEvent({
        event: "apply_sizing_variable",
        properties: {
          oldValue,
          consumerNodeIds,
          consumerNodeCount: consumerNodeIds.length,
          variableId,
        },
        currentTarget: currentTarget[0],
      });
    },
  );

  on<RequestLayoutSuggestionsEventHandler>("REQUEST_LAYOUT_SUGGESTIONS", async ({ nodeIds }) => {
    try {
      const results = await getSerializedLayoutVariableSuggestions({
        nodeIds,
        systemComponentKeys: SYSTEM_COMPONENT_KEYS_ALL,
      });

      emit<SuggestLayoutVariablesEventHandler>("SUGGEST_LAYOUT_VARIABLES", { results });

      logEvent({
        event: "request_layout_suggestions",
        properties: {
          nodeIds,
          results,
        },
        currentTarget: currentTarget[0],
      });
    } catch (error) {
      if (error instanceof Error === false) return;

      logError({
        event: "request_layout_suggestions",
        error,
        properties: { nodeIds },
        currentTarget: currentTarget[0],
      });
    }
  });

  on<ApplyLayoutVariableEventHandler>(
    "APPLY_LAYOUT_VARIABLE",
    async ({ oldValue, consumerNodeIds, variableId }) => {
      await applyLayoutVariable({ oldValue, consumerNodeIds, variableId });

      figma.commitUndo();

      logEvent({
        event: "apply_layout_variable",
        properties: {
          oldValue,
          consumerNodeIds,
          consumerNodeCount: consumerNodeIds.length,
          variableId,
        },
        currentTarget: currentTarget[0],
      });
    },
  );

  on<RequestStrokeWeightAndCornerRadiusSuggestionsEventHandler>(
    "REQUEST_STROKE_WEIGHT_AND_CORNER_RADIUS_SUGGESTIONS",
    async ({ nodeIds }) => {
      try {
        const results = await getSerializedStrokeWeightAndCornerRadiusVariableSuggestions({
          nodeIds,
          systemComponentKeys: SYSTEM_COMPONENT_KEYS_ALL,
        });

        emit<SuggestStrokeWeightAndCornerRadiusVariablesEventHandler>(
          "SUGGEST_STROKE_WEIGHT_AND_CORNER_RADIUS_VARIABLES",
          { results },
        );

        logEvent({
          event: "request_stroke_weight_and_corner_radius_suggestions",
          properties: {
            nodeIds,
            results,
          },
          currentTarget: currentTarget[0],
        });
      } catch (error) {
        if (error instanceof Error === false) return;

        logError({
          event: "request_stroke_weight_and_corner_radius_suggestions",
          error,
          properties: { nodeIds },
          currentTarget: currentTarget[0],
        });
      }
    },
  );

  on<ApplyStrokeWeightAndCornerRadiusVariableEventHandler>(
    "APPLY_STROKE_WEIGHT_AND_CORNER_RADIUS_VARIABLE",
    async ({ oldValue, consumerNodeIds, variableId }) => {
      await applyStrokeWeightOrCornerRadiusVariable({ oldValue, consumerNodeIds, variableId });

      figma.commitUndo();

      logEvent({
        event: "apply_stroke_weight_and_corner_radius_variable",
        properties: {
          oldValue,
          consumerNodeIds,
          consumerNodeCount: consumerNodeIds.length,
          variableId,
        },
        currentTarget: currentTarget[0],
      });
    },
  );
}

async function getSelectedInfo() {
  const getSelectedInfo = await getSelectedComponentInfo();
  // const componentSetKey = await getComponentSetKey();

  emit<DebugEventHandler>("DEBUG", getSelectedInfo);
}

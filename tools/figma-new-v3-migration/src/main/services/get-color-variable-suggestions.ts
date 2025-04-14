import {
  getColorVariableSuggestionsInEffects,
  getColorVariableSuggestionsInFills,
  getColorVariableSuggestionsInStrokes,
} from "../../main/services/get-color-variable-suggestions-by-properties";
import {
  SEED_V3_LIBRARY_NAME,
  SEED_V3_LIBRARY_VARIABLE_COLLECTION_NAMES,
} from "../../shared/constants";
import type {
  ColorVariablesSuggestionsResults,
  SerializedColorVariablesSuggestionsResults,
} from "../../shared/types";
import { convertRgbColorToHexColor } from "../../shared/utils/colors";
import { getLibraryVariableCollection } from "../../shared/utils/libraries";
import {
  getAllColorVariableBindableNodesInSceneNodes,
  getClosestInstanceNode,
  serializeBaseNode,
  serializeInstanceNode,
} from "../../shared/utils/nodes";
import { serializePaintStyle } from "../../shared/utils/styles";
import { serializeVariable } from "../../shared/utils/variables";

interface GetColorVariableSuggestionsParams {
  nodeIds: SceneNode["id"][];
  systemComponentKeys: string[];
}

export async function getColorVariableSuggestions({
  nodeIds,
}: GetColorVariableSuggestionsParams): Promise<SerializedColorVariablesSuggestionsResults> {
  const nodes = (await Promise.all(nodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId)))).filter(
    (node) => node !== null && node.type !== "DOCUMENT" && node.type !== "PAGE",
  );

  const library = await getLibraryVariableCollection({
    libraryName: SEED_V3_LIBRARY_NAME,
    name: SEED_V3_LIBRARY_VARIABLE_COLLECTION_NAMES.COLOR,
  });
  if (!library)
    throw new Error("신규 라이브러리를 찾을 수 없습니다. 라이브러리가 추가되었는지 확인해주세요.");

  const variableKeys = (
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync(library.key)
  ).map(({ key }) => key);

  if (variableKeys.length === 0)
    throw new Error("신규 Variable을 찾을 수 없습니다. 라이브러리가 추가되었는지 확인해주세요.");

  const nodesInTarget = getAllColorVariableBindableNodesInSceneNodes(nodes);

  const availableVariables = await Promise.all(
    variableKeys.map((key) => figma.variables.importVariableByKeyAsync(key)),
  );

  if (nodesInTarget.length === 0) return [];

  const firstNodeWithoutExplicitVariableMode = nodesInTarget.find(
    (node) => Object.keys(node.explicitVariableModes).length === 0,
  );

  if (!firstNodeWithoutExplicitVariableMode)
    throw new Error("모든 레이어에 Variable Mode가 설정되어 있습니다.");

  const candidateVariables = availableVariables
    .map((variable) => {
      const { value } = variable.resolveForConsumer(firstNodeWithoutExplicitVariableMode);

      if (typeof value !== "object" || "type" in value || !("a" in value)) return null;

      const hex = convertRgbColorToHexColor(value);
      if (!hex) return null;

      return { variable, hex, opacity: value.a };
    })
    .filter((item) => item !== null);

  const results: ColorVariablesSuggestionsResults = [];

  for await (const node of nodesInTarget) {
    const fillResults = await getColorVariableSuggestionsInFills({ node, candidateVariables });
    const strokeResults = await getColorVariableSuggestionsInStrokes({ node, candidateVariables });
    const effectResults = await getColorVariableSuggestionsInEffects({ node, candidateVariables });

    for (const { property, propertyResults } of [
      { property: "Fill" as const, propertyResults: fillResults },
      { property: "Stroke" as const, propertyResults: strokeResults },
      { property: "Effect" as const, propertyResults: effectResults },
    ]) {
      for (const propertyResult of propertyResults) {
        const oldValueFound = results.find((result) => {
          switch (propertyResult.type) {
            case "variable":
              return (
                result.oldValue.type === "variable" &&
                result.oldValue.variable.id === propertyResult.variable.id
              );
            case "style":
              return (
                result.oldValue.type === "style" &&
                result.oldValue.style.id === propertyResult.style.id &&
                result.oldValue.paletteProperty === propertyResult.paletteProperty
              );
            case "detached":
              return (
                result.oldValue.type === "detached" &&
                result.oldValue.hex === propertyResult.hex &&
                result.oldValue.opacity === propertyResult.opacity
              );
            case "uncheckable":
              return result.oldValue.type === "uncheckable";
          }
        });

        if (!oldValueFound) {
          if (propertyResult.type === "uncheckable") {
            results.push({
              oldValue: { type: "uncheckable" },
              consumers: [{ node, properties: [property] }],
              suggestions: [],
            });

            continue;
          }

          results.push({
            oldValue: ((): ColorVariablesSuggestionsResults[number]["oldValue"] => {
              switch (propertyResult.type) {
                case "variable": {
                  const { value } = propertyResult.variable.resolveForConsumer(node);

                  if (typeof value !== "object" || "type" in value || !("a" in value))
                    return { type: "uncheckable" };

                  const hex = convertRgbColorToHexColor(value);

                  if (!hex) return { type: "uncheckable" };

                  return {
                    type: "variable",
                    variable: propertyResult.variable,
                    hex,
                    opacity: value.a,
                  };
                }
                case "style": {
                  const paint = propertyResult.style.paints[0];
                  if (paint.type !== "SOLID") return { type: "uncheckable" };

                  const { color, opacity = 1 } = paint;

                  const hex = convertRgbColorToHexColor(color);
                  if (!hex) return { type: "uncheckable" };

                  return {
                    type: "style",
                    style: propertyResult.style,
                    paletteProperty: propertyResult.paletteProperty,
                    hex,
                    opacity,
                  };
                }
                case "detached":
                  return {
                    type: "detached",
                    hex: propertyResult.hex,
                    opacity: propertyResult.opacity,
                  };
              }
            })(),
            consumers: [{ node, properties: [property] }],
            suggestions: propertyResult.suggestions,
          });

          continue;
        }

        const consumerFound = oldValueFound.consumers.find(
          (consumer) => consumer.node.id === node.id,
        );

        if (consumerFound) {
          if (consumerFound.properties.includes(property)) continue;

          consumerFound.properties.push(property);

          continue;
        }

        oldValueFound.consumers.push({ node, properties: [property] });
      }
    }
  }

  const serializedResults: SerializedColorVariablesSuggestionsResults = results
    .map((result) => {
      const serializedOldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"] =
        (() => {
          switch (result.oldValue.type) {
            case "variable":
              return {
                type: "variable",
                variable: serializeVariable(result.oldValue.variable),
                hex: result.oldValue.hex,
                opacity: result.oldValue.opacity,
              };
            case "style":
              return {
                type: "style",
                style: serializePaintStyle(result.oldValue.style),
                hex: result.oldValue.hex,
                opacity: result.oldValue.opacity,
                paletteProperty: result.oldValue.paletteProperty,
              };
            case "detached":
              return {
                type: "detached",
                hex: result.oldValue.hex,
                opacity: result.oldValue.opacity,
              };
            case "uncheckable":
              return { type: "uncheckable" };
          }
        })();

      const oldValue = result.oldValue;
      const selectedNewVariable =
        oldValue.type === "variable"
          ? (candidateVariables.find(({ variable }) => variable.id === oldValue.variable.id) ??
            null)
          : null;

      const serializedConsumers: SerializedColorVariablesSuggestionsResults[number]["consumers"] =
        result.consumers.map(({ node, properties }) => {
          const closestInstanceNode = getClosestInstanceNode(node);

          return {
            node: serializeBaseNode(node),
            properties,
            closestInstanceNode: closestInstanceNode
              ? serializeInstanceNode(closestInstanceNode)
              : null,
            selectedNewVariableId: selectedNewVariable ? selectedNewVariable.variable.id : null,
          };
        });

      const serializedSuggestions = result.suggestions.map(({ variable, hex, opacity }) => ({
        variable: serializeVariable(variable),
        hex,
        opacity,
      }));

      return {
        oldValue: serializedOldValue,
        consumers: serializedConsumers,
        suggestions: serializedSuggestions,
      };
    })
    .sort((a, b) => {
      const aUnselectedCount = a.consumers.filter(
        ({ selectedNewVariableId }) => selectedNewVariableId === null,
      ).length;
      const bUnselectedCount = b.consumers.filter(
        ({ selectedNewVariableId }) => selectedNewVariableId === null,
      ).length;

      if (aUnselectedCount < a.consumers.length && bUnselectedCount === b.consumers.length)
        return 1;
      if (aUnselectedCount === a.consumers.length && bUnselectedCount < b.consumers.length)
        return -1;

      if (a.suggestions.length === 0 && b.suggestions.length > 0) return 1;
      if (a.suggestions.length > 0 && b.suggestions.length === 0) return -1;

      if (aUnselectedCount - bUnselectedCount > 0) return 1;
      if (aUnselectedCount - bUnselectedCount < 0) return -1;

      if (TYPE_ORDER[a.oldValue.type] < TYPE_ORDER[b.oldValue.type]) return -1;
      if (TYPE_ORDER[a.oldValue.type] > TYPE_ORDER[b.oldValue.type]) return 1;

      return a.consumers.length - b.consumers.length;
    });

  // 신규 변수인데, oldValue에 존재하는 경우 제거
  const filteredNewValueInOldValue = serializedResults.filter(({ oldValue }) => {
    if (oldValue.type !== "variable") return true;

    return (
      oldValue.type === "variable" &&
      !availableVariables.find(({ key }) => key === oldValue.variable.key)
    );
  });

  return filteredNewValueInOldValue;
}

const TYPE_ORDER: Record<
  SerializedColorVariablesSuggestionsResults[number]["oldValue"]["type"],
  number
> = {
  style: 0,
  variable: 1,
  detached: 2,
  uncheckable: 3,
};

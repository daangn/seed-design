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

/**
 * 변수 제안 배열에서 고유한 해시를 생성합니다.
 * 이를 통해 동일한 제안을 가진 색상을 그룹화할 수 있습니다.
 */
function getSuggestionHash(
  suggestions: { variable: Variable; hex: string; opacity: number }[],
): string {
  if (suggestions.length === 0) return "";

  return suggestions
    .map(
      ({ variable, hex, opacity }) => `${variable.name}:${hex}:${Math.round(opacity * 100) / 100}`,
    )
    .sort()
    .join("|");
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

  // 결과를 suggestion 해시별로 그룹화하는 Map
  const groupedResultsMap = new Map<string, ColorVariablesSuggestionsResults[number]>();
  // uncheckable 타입을 위한 특별 처리
  const uncheckableResults: ColorVariablesSuggestionsResults[number][] = [];

  for await (const node of nodesInTarget) {
    // 디자인시스템 컴포넌트 내에 있는 경우 컬러 변수 제안 생략
    // if (
    //   await isNodeWithinSystemComponents({
    //     node,
    //     excludeMonochromeIcons: true,
    //     systemComponentKeys,
    //   })
    // )
    //   continue;

    const fillResults = await getColorVariableSuggestionsInFills({ node, candidateVariables });
    const strokeResults = await getColorVariableSuggestionsInStrokes({ node, candidateVariables });
    const effectResults = await getColorVariableSuggestionsInEffects({ node, candidateVariables });

    for (const { property, propertyResults } of [
      { property: "Fill" as const, propertyResults: fillResults },
      { property: "Stroke" as const, propertyResults: strokeResults },
      { property: "Effect" as const, propertyResults: effectResults },
    ]) {
      for (const propertyResult of propertyResults) {
        // uncheckable 타입은 별도로 처리
        if (propertyResult.type === "uncheckable") {
          const uncheckableResult = uncheckableResults.find(() => true); // 항상 첫 번째 것 사용

          if (!uncheckableResult) {
            uncheckableResults.push({
              oldValue: { type: "uncheckable" },
              consumers: [{ node, properties: [property] }],
              suggestions: [],
            });
          } else {
            const consumerFound = uncheckableResult.consumers.find(
              (consumer) => consumer.node.id === node.id,
            );

            if (consumerFound) {
              if (!consumerFound.properties.includes(property)) {
                consumerFound.properties.push(property);
              }
            } else {
              uncheckableResult.consumers.push({ node, properties: [property] });
            }
          }

          continue;
        }

        // suggestion 해시를 생성
        const suggestionHash = getSuggestionHash(propertyResult.suggestions);

        // 이미 같은 suggestion을 가진 그룹이 있는지 확인
        let resultGroup = groupedResultsMap.get(suggestionHash);

        if (!resultGroup) {
          // 새 그룹 생성
          resultGroup = {
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
          };

          groupedResultsMap.set(suggestionHash, resultGroup);
        } else {
          // 기존 그룹에 추가
          const consumerFound = resultGroup.consumers.find(
            (consumer) => consumer.node.id === node.id,
          );

          if (consumerFound) {
            if (!consumerFound.properties.includes(property)) {
              consumerFound.properties.push(property);
            }
          } else {
            resultGroup.consumers.push({ node, properties: [property] });
          }
        }
      }
    }
  }

  // Map에서 결과 배열로 변환하고 uncheckable 결과도 추가
  const results: ColorVariablesSuggestionsResults = [
    ...Array.from(groupedResultsMap.values()),
    ...uncheckableResults,
  ];

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

  return serializedResults;
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

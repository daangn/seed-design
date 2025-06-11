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
  if (!library) {
    figma.notify("신규 라이브러리를 찾을 수 없습니다. 라이브러리가 추가되었는지 확인해주세요.", {
      error: true,
      timeout: 5000,
    });
    return [];
  }

  const variableKeys = (
    await figma.teamLibrary.getVariablesInLibraryCollectionAsync(library.key)
  ).map(({ key }) => key);

  if (variableKeys.length === 0) {
    figma.notify("신규 Variable을 찾을 수 없습니다. 라이브러리가 추가되었는지 확인해주세요.", {
      error: true,
      timeout: 5000,
    });
    return [];
  }

  const nodesInTarget = getAllColorVariableBindableNodesInSceneNodes(nodes);

  const availableVariables = await Promise.all(
    variableKeys.map((key) => figma.variables.importVariableByKeyAsync(key)),
  );

  if (nodesInTarget.length === 0) return [];

  const firstNodeWithoutExplicitVariableMode = nodesInTarget.find(
    (node) => Object.keys(node.explicitVariableModes).length === 0,
  );

  if (!firstNodeWithoutExplicitVariableMode) {
    figma.notify("모든 레이어에 Variable Mode가 설정되어 있습니다.", {
      error: true,
      timeout: 5000,
    });
    return [];
  }

  const candidateVariables = (
    await Promise.all(
      availableVariables.map(async (variable) => {
        // Light 모드 기준으로 매칭하기 위해 Light 모드 값을 기본으로 사용
        const lightModeId = await getVariableModeIdForTheme(variable, "light");
        const lightValue = variable.valuesByMode[lightModeId];

        // Variable Alias 처리 (semantic 변수들이 palette 변수를 참조하는 경우)
        let resolvedValue = lightValue;
        if (
          typeof lightValue === "object" &&
          "type" in lightValue &&
          lightValue.type === "VARIABLE_ALIAS"
        ) {
          try {
            // Variable Alias를 해석해서 최종 색상값 가져오기
            const referencedVariable = await figma.variables.getVariableByIdAsync(lightValue.id);
            if (referencedVariable) {
              const referencedLightModeId = await getVariableModeIdForTheme(
                referencedVariable,
                "light",
              );
              const referencedValue = referencedVariable.valuesByMode[referencedLightModeId];
              resolvedValue = referencedValue;

              if (variable.name.startsWith("bg/") || variable.name.startsWith("fg/")) {
                console.log(
                  `🔗 ${variable.name} resolved alias:`,
                  referencedVariable.name,
                  referencedValue,
                );
              }
            }
          } catch (error) {
            if (variable.name.startsWith("bg/") || variable.name.startsWith("fg/")) {
              console.log(`  ❌ ${variable.name} failed to resolve alias:`, error);
            }
            return null;
          }
        }

        if (
          typeof resolvedValue !== "object" ||
          "type" in resolvedValue ||
          !("a" in resolvedValue)
        ) {
          if (variable.name.startsWith("bg/") || variable.name.startsWith("fg/")) {
            console.log(`  ❌ ${variable.name} filtered out: invalid resolvedValue`, resolvedValue);
          }
          return null;
        }

        const lightHex = convertRgbColorToHexColor(resolvedValue);
        if (!lightHex) {
          if (variable.name.startsWith("bg/") || variable.name.startsWith("fg/")) {
            console.log(`  ❌ ${variable.name} filtered out: convertRgbColorToHexColor failed`);
          }
          return null;
        }

        if (variable.name.startsWith("bg/") || variable.name.startsWith("fg/")) {
          console.log(`  ✅ ${variable.name} included: ${lightHex}, ${resolvedValue.a}`);
        }

        return {
          variable,
          hex: lightHex,
          opacity: resolvedValue.a,
        };
      }),
    )
  ).filter((item) => item !== null);

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

  const mappedResults = await Promise.all(
    results.map(async (result) => {
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

      const serializedSuggestions = await Promise.all(
        result.suggestions.map(async ({ variable, hex, opacity }) => {
          // Light와 Dark 모드의 색상 값 가져오기
          const lightModeId = await getVariableModeIdForTheme(variable, "light");
          const darkModeId = await getVariableModeIdForTheme(variable, "dark");

          const lightValue = variable.valuesByMode[lightModeId];
          const darkValue = variable.valuesByMode[darkModeId];

          let lightMode = { hex, opacity };
          let darkMode = { hex, opacity };

          // Light mode 값 처리 (Variable Alias 해석 포함)
          let resolvedLightValue = lightValue;
          if (
            typeof lightValue === "object" &&
            "type" in lightValue &&
            lightValue.type === "VARIABLE_ALIAS"
          ) {
            try {
              const referencedVariable = await figma.variables.getVariableByIdAsync(lightValue.id);
              if (referencedVariable) {
                const referencedLightModeId = await getVariableModeIdForTheme(
                  referencedVariable,
                  "light",
                );
                resolvedLightValue = referencedVariable.valuesByMode[referencedLightModeId];
              }
            } catch (error) {
              console.log(`Failed to resolve light mode alias for ${variable.name}:`, error);
            }
          }

          if (typeof resolvedLightValue === "object" && "a" in resolvedLightValue) {
            const lightHex = convertRgbColorToHexColor(resolvedLightValue);
            if (lightHex) {
              lightMode = { hex: lightHex, opacity: resolvedLightValue.a };
            }
          }

          // Dark mode 값 처리 (Variable Alias 해석 포함)
          let resolvedDarkValue = darkValue;
          if (
            typeof darkValue === "object" &&
            "type" in darkValue &&
            darkValue.type === "VARIABLE_ALIAS"
          ) {
            try {
              const referencedVariable = await figma.variables.getVariableByIdAsync(darkValue.id);
              if (referencedVariable) {
                const referencedDarkModeId = await getVariableModeIdForTheme(
                  referencedVariable,
                  "dark",
                );
                resolvedDarkValue = referencedVariable.valuesByMode[referencedDarkModeId];
              }
            } catch (error) {
              console.log(`Failed to resolve dark mode alias for ${variable.name}:`, error);
            }
          }

          if (typeof resolvedDarkValue === "object" && "a" in resolvedDarkValue) {
            const darkHex = convertRgbColorToHexColor(resolvedDarkValue);
            if (darkHex) {
              darkMode = { hex: darkHex, opacity: resolvedDarkValue.a };
            }
          }

          console.log(`🌓 ${variable.name} modes:`, { lightMode, darkMode });

          return {
            variable: serializeVariable(variable),
            hex,
            opacity,
            lightMode,
            darkMode,
          };
        }),
      );

      return {
        oldValue: serializedOldValue,
        consumers: serializedConsumers,
        suggestions: serializedSuggestions,
      };
    }),
  );

  const serializedResults: SerializedColorVariablesSuggestionsResults = mappedResults.sort(
    (a, b) => {
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
    },
  );

  console.log("serializedResults", serializedResults);

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

// 테마 모드에 따른 Variable Mode ID 가져오는 유틸 함수
async function getVariableModeIdForTheme(
  variable: Variable,
  themeMode: "light" | "dark",
): Promise<string> {
  const collection = await figma.variables.getVariableCollectionByIdAsync(
    variable.variableCollectionId,
  );

  if (!collection) return Object.keys(variable.valuesByMode)[0]; // 기본값

  // 테마 모드명에 따라 적절한 mode 찾기
  const targetModeName = themeMode === "light" ? "theme-light" : "theme-dark";
  const targetMode = collection.modes.find(
    (mode) =>
      mode.name.toLowerCase().includes(targetModeName) ||
      mode.name.toLowerCase().includes(themeMode),
  );

  return targetMode ? targetMode.modeId : collection.modes[0].modeId;
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

import { COLOR_MAPPING, type ColorMapping } from "../../main/data/colors";
import type {
  DetachedResultWithColorSuggestions,
  PaletteProperty,
  StyleResultWithColorSuggestions,
  VariableResultWithColorSuggestions,
  VariableWithResolvedColor,
} from "../../main/services/get-color-variable-suggestions-by-properties";
import { SEED_V3_LIBRARY_VARIABLE_PREFIXES } from "../../shared/constants";
import { convertRgbColorToHexColor } from "@create-figma-plugin/utilities";
import { deltaE } from "color-delta-e";

const FILL_STYLE_PREFIXES = {
  SCALE: "$scale/",
  SEMANTIC: "$semantic/",
  STATIC: "$static/",
};

/**
 * .theme-light/, .theme-dark/, theme/ 접두사를 제거한 PaintStyle 이름을 반환합니다.
 * @example getPaintStyleNameWithoutTheme(".theme-light/$scale/primary-500") // => "$scale/primary-500"
 */
export function getPaintStyleNameWithoutTheme(fillStyleName: PaintStyle["name"]) {
  return fillStyleName.replace(/.theme-(light|dark)\/|(theme)\//, "");
}

/**
 * PaintStyle 이름에서 토큰의 타입을 반환합니다.
 * @example getPaintStyleType("$scale/primary-500") // => "scale"
 */
export function getPaintStyleType(fillStyleNameWithoutTheme: string) {
  if (fillStyleNameWithoutTheme.startsWith(FILL_STYLE_PREFIXES.SCALE)) return "scale";
  if (fillStyleNameWithoutTheme.startsWith(FILL_STYLE_PREFIXES.SEMANTIC)) return "semantic";

  return null;
}

/**
 * candidateVariables 중에서, variables의 hex, opacity와 동일한 값으로 resolve되는 variable을 반환합니다.
 */
export function getEquivalentVariables({
  variables,
  candidateVariables,
  propertyScope,
}: {
  variables: VariableWithResolvedColor[];
  candidateVariables: VariableWithResolvedColor[];
  propertyScope?: string;
}): VariableWithResolvedColor[] {
  const equivalentVariables = candidateVariables.filter(
    ({ variable: candidateVariable, hex: candidateHex, opacity: candidateOpacity }) => {
      if (variables.some(({ variable }) => variable.id === candidateVariable.id)) return false;

      const isInScope = propertyScope
        ? candidateVariable.name.startsWith(`${propertyScope}/`)
        : true;

      return (
        isInScope &&
        variables.some(
          ({ hex: variableHex, opacity: variableOpacity }) =>
            variableHex === candidateHex &&
            Math.round(variableOpacity * 100) === Math.round(candidateOpacity * 100),
        )
      );
    },
  );

  return [...equivalentVariables, ...variables];
}

/**
 * candidateVariables의 palette variable 중에서, hex 값이 가장 가까운 variable을 반환합니다.
 * @param param0.hueScope hueScope가 주어진 경우, 해당 hueScope에 해당하는 palette variable 중에서 찾습니다.
 */
export function getClosestPaletteVariablesWithResolvedColor({
  hex,
  opacity,
  candidateVariables,
  hueScope,
}: {
  hex: string;
  opacity: number;
  candidateVariables: VariableWithResolvedColor[];
  hueScope?: string;
}): VariableWithResolvedColor[] {
  const filteredVariables = candidateVariables.filter(({ variable }) => {
    if (variable.name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.PALETTE) === false)
      return false;

    if (variable.name.includes("static")) return false;

    if (
      hueScope &&
      variable.name.startsWith(`${SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.PALETTE}${hueScope}-`) ===
        false
    )
      return false;

    return true;
  });

  const deltaEs = filteredVariables.map(({ hex: variableHex }) =>
    deltaE(`#${hex}`, `#${variableHex}`),
  );

  const minDeltaE = Math.min(...deltaEs);

  const variablesWithMinDeltaE = filteredVariables.filter(
    (variable, index) =>
      deltaEs[index] === minDeltaE &&
      (opacity === 1 ? variable.opacity === 1 : variable.opacity !== 1),
  );

  return variablesWithMinDeltaE;
}

/**
 * styleNameWithoutTheme에 해당하는 맵핑이 존재하는 경우, candidateVariables 중에서 맵핑에 해당하는 variable을 반환합니다.
 */
export function getVariableFromMapping({
  styleNameWithoutTheme,
  candidateVariables,
  mapping,
  propertyScope,
}: {
  styleNameWithoutTheme: string;
  candidateVariables: VariableWithResolvedColor[];
  mapping: ColorMapping;
  propertyScope?: string;
}) {
  if (!(styleNameWithoutTheme in mapping)) return null;

  const variables = candidateVariables.filter(({ variable }) =>
    mapping[styleNameWithoutTheme]?.includes(variable.name),
  );

  if (!propertyScope) return variables;

  const variablesWithPropertyScopeMatched = variables.filter(
    ({ variable }) =>
      variable.name.startsWith(`${propertyScope}/`) ||
      variable.name.startsWith(SEED_V3_LIBRARY_VARIABLE_PREFIXES.COLOR.PALETTE),
  );

  if (variablesWithPropertyScopeMatched.length === 0) return variables;

  return variablesWithPropertyScopeMatched;
}

/**
 * Paint 스타일 정보를 통해 variable을 추천합니다.
 */
export async function getVariableSuggestionsFromPaintStyle({
  paints,
  paintStyleId,
  paletteProperty,
  candidateVariables,
}: {
  paints: Readonly<Paint[]> | Paint[];
  paintStyleId: PaintStyle["id"];
  paletteProperty: PaletteProperty;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<StyleResultWithColorSuggestions | null> {
  if (paintStyleId === "") return null;

  const style = await figma.getStyleByIdAsync(paintStyleId);
  if (!style || style.type !== "PAINT") return null;

  const styleNameWithoutTheme = getPaintStyleNameWithoutTheme(style.name);

  const onlyPaint = paints[0];
  if (!onlyPaint || onlyPaint.type !== "SOLID") return null;

  const hex = convertRgbColorToHexColor(onlyPaint.color);
  if (!hex) return null;

  const suggestions = (() => {
    switch (getPaintStyleType(styleNameWithoutTheme)) {
      case "scale": {
        const variablesFromMapping = getVariableFromMapping({
          styleNameWithoutTheme,
          candidateVariables,
          mapping: COLOR_MAPPING,
        });

        // scale -> palette 맵핑이 정의되어 있는 경우 ([]도 있다고 봄)
        // 맵핑에서 제공하는 variable을 사용
        // 추천되는 palette 값을 사용하는 semantic도 함께 반환
        if (variablesFromMapping) {
          return getEquivalentVariables({
            variables: variablesFromMapping,
            candidateVariables,
            ...(paletteProperty && { propertyScope: paletteProperty }),
          });
        }

        // scale -> palette 맵핑이 정의되어 있지 않은 경우 (null)
        // 같은 hue의 palette 중 색상이 가까운 variable을 찾아서 사용
        // 추천되는 palette 값을 사용하는 semantic도 함께 반환
        return getEquivalentVariables({
          variables: getClosestPaletteVariablesWithResolvedColor({
            hex,
            opacity: onlyPaint.opacity ?? 1,
            candidateVariables,
            hueScope: styleNameWithoutTheme.replace(FILL_STYLE_PREFIXES.SCALE, "").split("-")[0],
          }),
          candidateVariables,
          ...(paletteProperty && { propertyScope: paletteProperty }),
        });
      }

      default: {
        // semantic -> 맵핑만을 참고
        const variablesFromMapping = getVariableFromMapping({
          styleNameWithoutTheme,
          candidateVariables,
          mapping: COLOR_MAPPING,
          ...(paletteProperty && { propertyScope: paletteProperty }),
        });

        return variablesFromMapping ?? [];
      }
    }
  })();

  return {
    type: "style",
    style,
    paletteProperty,
    suggestions,
  };
}

/**
 * SolidPaint 정보(detach된 값과 variable)를 통해 variable을 추천합니다.
 */
export async function getVariableSuggestionsFromSolidPaint({
  solidPaint: { color, opacity = 1, boundVariables },
  candidateVariables,
}: {
  solidPaint: SolidPaint;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<VariableResultWithColorSuggestions | DetachedResultWithColorSuggestions | null> {
  const hex = convertRgbColorToHexColor(color);
  if (!hex) return null;

  const boundColorVariable = boundVariables?.color;

  if (!boundColorVariable) {
    const suggestions = getClosestPaletteVariablesWithResolvedColor({
      hex,
      opacity,
      candidateVariables,
    });

    return {
      type: "detached",
      hex,
      opacity,
      suggestions,
    };
  }

  const found = candidateVariables.find(({ variable }) => variable.id === boundColorVariable.id);

  if (found)
    return {
      type: "variable",
      variable: found.variable,
      suggestions: [found],
    };

  const variable = await figma.variables.getVariableByIdAsync(boundColorVariable.id);
  if (!variable) return null;

  const suggestions = getClosestPaletteVariablesWithResolvedColor({
    hex,
    opacity,
    candidateVariables,
  });

  return {
    type: "variable",
    variable,
    suggestions,
  };
}

/**
 * GradientStop 정보(detach된 값과 variable)를 통해 variable을 추천합니다.
 */
export async function getVariableSuggestionsFromGradientStop({
  stop,
  candidateVariables,
}: {
  stop: ColorStop;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<VariableResultWithColorSuggestions | DetachedResultWithColorSuggestions | null> {
  const hex = convertRgbColorToHexColor(stop.color);
  if (!hex) return null;

  const suggestions = getClosestPaletteVariablesWithResolvedColor({
    hex,
    opacity: stop.color.a,
    candidateVariables,
  });

  const boundColorVariable = stop.boundVariables?.color;
  if (!boundColorVariable) {
    return { type: "detached", hex, opacity: stop.color.a, suggestions };
  }

  const variable = await figma.variables.getVariableByIdAsync(boundColorVariable.id);
  if (!variable) return null;

  return { type: "variable", variable, suggestions };
}

/**
 * ShadowEffect 정보(detach된 값과 variable)를 통해 variable을 추천합니다.
 */
export async function getVariableSuggestionsFromShadowEffect({
  effect,
  candidateVariables,
}: {
  effect: DropShadowEffect | InnerShadowEffect;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<VariableResultWithColorSuggestions | DetachedResultWithColorSuggestions | null> {
  const hex = convertRgbColorToHexColor(effect.color);
  if (!hex) return null;

  const suggestions = getClosestPaletteVariablesWithResolvedColor({
    hex,
    opacity: effect.color.a,
    candidateVariables,
  });

  const boundColorVariable = effect.boundVariables?.color;
  if (!boundColorVariable) {
    return { type: "detached", hex, opacity: effect.color.a, suggestions };
  }

  const variable = await figma.variables.getVariableByIdAsync(boundColorVariable.id);
  if (!variable) return null;

  return { type: "variable", variable, suggestions };
}

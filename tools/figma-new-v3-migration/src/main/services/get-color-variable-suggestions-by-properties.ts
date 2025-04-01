import {
  getVariableSuggestionsFromGradientStop,
  getVariableSuggestionsFromPaintStyle,
  getVariableSuggestionsFromShadowEffect,
  getVariableSuggestionsFromSolidPaint,
} from "../../shared/utils/colors";

export type VariableWithResolvedColor = { variable: Variable; hex: string; opacity: number };

export type PaletteProperty = "bg" | "fg" | "stroke" | null;

export interface StyleResultWithColorSuggestions {
  type: "style";
  style: PaintStyle;
  paletteProperty: PaletteProperty;
  suggestions: VariableWithResolvedColor[];
}

export interface VariableResultWithColorSuggestions {
  type: "variable";
  variable: Variable;
  suggestions: VariableWithResolvedColor[];
}

export interface DetachedResultWithColorSuggestions {
  type: "detached";
  hex: string;
  opacity: number;
  suggestions: VariableWithResolvedColor[];
}

export interface UncheckableResult {
  type: "uncheckable";
}

type ColorVariablesSuggestionsInPropertyResults = (
  | VariableResultWithColorSuggestions
  | DetachedResultWithColorSuggestions
  | StyleResultWithColorSuggestions
  | UncheckableResult
)[];

export async function getColorVariableSuggestionsInFills({
  node,
  candidateVariables,
}: {
  node: SceneNode;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<ColorVariablesSuggestionsInPropertyResults> {
  if (!("fills" in node)) return [];

  const { fills, fillStyleId } = node;

  if (fills === figma.mixed || fillStyleId === figma.mixed) return [{ type: "uncheckable" }];

  const paletteProperty = (() => {
    switch (node.type) {
      case "FRAME":
      case "INSTANCE":
      case "ELLIPSE":
      case "RECTANGLE":
      case "COMPONENT":
      case "COMPONENT_SET":
      case "STAR":
        return "bg";
      case "TEXT":
      case "VECTOR":
      case "BOOLEAN_OPERATION":
        return "fg";
    }

    return null;
  })();

  const variableSuggestionsFromFillStyle = await getVariableSuggestionsFromPaintStyle({
    paints: fills,
    paintStyleId: fillStyleId,
    candidateVariables,
    paletteProperty,
  });
  if (variableSuggestionsFromFillStyle) return [variableSuggestionsFromFillStyle];

  const results: (VariableResultWithColorSuggestions | DetachedResultWithColorSuggestions)[] = [];

  for await (const fill of fills) {
    switch (fill.type) {
      case "SOLID": {
        const hasResultWithSameBoundVariable = results.some(
          (result) =>
            result.type === "variable" && result.variable.id === fill.boundVariables?.color?.id,
        );
        if (hasResultWithSameBoundVariable) continue;

        const variableSuggestionsFromFill = await getVariableSuggestionsFromSolidPaint({
          solidPaint: fill,
          candidateVariables,
        });
        if (!variableSuggestionsFromFill) return [];

        results.push(variableSuggestionsFromFill);

        break;
      }
      case "GRADIENT_LINEAR":
      case "GRADIENT_RADIAL":
      case "GRADIENT_ANGULAR":
      case "GRADIENT_DIAMOND": {
        for await (const stop of fill.gradientStops) {
          const hasResultWithSameBoundVariable = results.some(
            (result) =>
              result.type === "variable" && result.variable.id === stop.boundVariables?.color?.id,
          );
          if (hasResultWithSameBoundVariable) continue;

          const variableSuggestionsFromGradientStop = await getVariableSuggestionsFromGradientStop({
            stop,
            candidateVariables,
          });
          if (!variableSuggestionsFromGradientStop) return [];

          results.push(variableSuggestionsFromGradientStop);
        }

        break;
      }
      case "IMAGE":
      case "VIDEO": {
        break;
      }
    }
  }

  return results;
}

export async function getColorVariableSuggestionsInStrokes({
  node,
  candidateVariables,
}: {
  node: SceneNode;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<ColorVariablesSuggestionsInPropertyResults> {
  if (!("strokes" in node)) return [];

  const { strokes, strokeStyleId } = node;

  const variableSuggestionsFromStrokeStyle = await getVariableSuggestionsFromPaintStyle({
    paints: strokes,
    paintStyleId: strokeStyleId,
    candidateVariables,
    paletteProperty: "stroke",
  });

  if (variableSuggestionsFromStrokeStyle) return [variableSuggestionsFromStrokeStyle];

  const results: (VariableResultWithColorSuggestions | DetachedResultWithColorSuggestions)[] = [];

  for await (const stroke of strokes) {
    switch (stroke.type) {
      case "SOLID": {
        const hasResultWithSameBoundVariable = results.some(
          (result) =>
            result.type === "variable" && result.variable.id === stroke.boundVariables?.color?.id,
        );
        if (hasResultWithSameBoundVariable) continue;

        const variableSuggestionsFromStroke = await getVariableSuggestionsFromSolidPaint({
          solidPaint: stroke,
          candidateVariables,
        });
        if (!variableSuggestionsFromStroke) return [];

        results.push(variableSuggestionsFromStroke);

        break;
      }
      case "GRADIENT_LINEAR":
      case "GRADIENT_RADIAL":
      case "GRADIENT_ANGULAR":
      case "GRADIENT_DIAMOND": {
        for await (const stop of stroke.gradientStops) {
          const hasResultWithSameBoundVariable = results.some(
            (result) =>
              result.type === "variable" && result.variable.id === stop.boundVariables?.color?.id,
          );
          if (hasResultWithSameBoundVariable) continue;

          const variableSuggestionsFromGradientStop = await getVariableSuggestionsFromGradientStop({
            stop,
            candidateVariables,
          });

          if (!variableSuggestionsFromGradientStop) return [];

          results.push(variableSuggestionsFromGradientStop);
        }

        break;
      }
      case "IMAGE":
      case "VIDEO": {
        break;
      }
    }
  }

  return results;
}

export async function getColorVariableSuggestionsInEffects({
  node,
  candidateVariables,
}: {
  node: SceneNode;
  candidateVariables: VariableWithResolvedColor[];
}): Promise<ColorVariablesSuggestionsInPropertyResults> {
  if (!("effects" in node)) return [];

  const { effects, effectStyleId } = node;

  if (effectStyleId) return [{ type: "uncheckable" }];

  const results: (VariableResultWithColorSuggestions | DetachedResultWithColorSuggestions)[] = [];

  for await (const effect of effects) {
    switch (effect.type) {
      case "DROP_SHADOW":
      case "INNER_SHADOW": {
        const hasResultWithSameBoundVariable = results.some(
          (result) =>
            result.type === "variable" && result.variable.id === effect.boundVariables?.color?.id,
        );
        if (hasResultWithSameBoundVariable) continue;

        const variableSuggestionsFromEffect = await getVariableSuggestionsFromShadowEffect({
          effect,
          candidateVariables,
        });
        if (!variableSuggestionsFromEffect) return [];

        results.push(variableSuggestionsFromEffect);

        continue;
      }
      default: {
        continue;
      }
    }
  }

  return results;
}

import type { SerializedColorVariablesSuggestionsResults } from "../../shared/types";
import { convertRgbColorToHexColor } from "../../shared/utils/colors";

export async function applyColorVariable({
  oldValue,
  consumerNodeIds,
  variableId,
}: {
  oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"];
  consumerNodeIds: SerializedColorVariablesSuggestionsResults[number]["consumers"][number]["node"]["id"][];
  variableId: SerializedColorVariablesSuggestionsResults[number]["suggestions"][number]["variable"]["id"];
}) {
  const variable = await figma.variables.getVariableByIdAsync(variableId);
  if (!variable) return;

  const nodes = await Promise.all(consumerNodeIds.map((nodeId) => figma.getNodeByIdAsync(nodeId)));

  for await (const node of nodes) {
    if (!node) continue;
    if (node.type === "DOCUMENT" || node.type === "PAGE") continue;

    await applyColorVariableToMatchingFills({ node, oldValue, variable });
    await applyColorVariableToMatchingStrokes({ node, oldValue, variable });
    applyColorVariableToMatchingEffects({ node, oldValue, variable });
  }
}

interface ApplyColorVariableParams {
  node: SceneNode;
  oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"];
  variable: Variable;
}

async function applyColorVariableToMatchingFills({
  node,
  oldValue,
  variable,
}: ApplyColorVariableParams) {
  if (!("fills" in node)) return;

  switch (oldValue.type) {
    case "style": {
      if (
        node.fillStyleId === figma.mixed ||
        node.fills === figma.mixed ||
        node.fills.length < 1 ||
        node.fills[0].type !== "SOLID" ||
        node.fillStyleId !== oldValue.style.id
      )
        return;

      // 1. detach
      await node.setFillStyleIdAsync("");

      // 2. apply new variable
      node.fills = [figma.variables.setBoundVariableForPaint(node.fills[0], "color", variable)];

      break;
    }
    case "detached": {
      if (node.fills === figma.mixed) return;

      node.fills = node.fills.map((fill) => {
        switch (fill.type) {
          case "SOLID": {
            if (convertRgbColorToHexColor(fill.color) !== oldValue.hex) return fill;

            return figma.variables.setBoundVariableForPaint(fill, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND":
            return {
              ...fill,
              gradientStops: fill.gradientStops.map((stop) => {
                if (convertRgbColorToHexColor(stop.color) !== oldValue.hex) return stop;

                const newStop = { ...stop };

                newStop.boundVariables = {
                  color: { type: "VARIABLE_ALIAS", id: variable.id },
                };

                return newStop;
              }),
            };
          case "IMAGE":
          case "VIDEO":
            return fill;
        }
      });

      break;
    }
    case "variable": {
      if (node.fills === figma.mixed) return;

      node.fills = node.fills.map((fill) => {
        switch (fill.type) {
          case "SOLID": {
            if (fill.boundVariables?.color?.id !== oldValue.variable.id) return fill;

            return figma.variables.setBoundVariableForPaint(fill, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND": {
            return {
              ...fill,
              gradientStops: fill.gradientStops.map((stop) => {
                if (stop.boundVariables?.color?.id !== oldValue.variable.id) return stop;

                const newStop = { ...stop };

                newStop.boundVariables = {
                  color: { type: "VARIABLE_ALIAS", id: variable.id },
                };

                return newStop;
              }),
            };
          }
          case "IMAGE":
          case "VIDEO":
            return fill;
        }
      });

      break;
    }
    case "uncheckable":
      break;
  }
}

async function applyColorVariableToMatchingStrokes({
  node,
  oldValue,
  variable,
}: ApplyColorVariableParams) {
  if (!("strokes" in node)) return;

  switch (oldValue.type) {
    case "style": {
      if (
        node.strokes.length < 1 ||
        node.strokes[0].type !== "SOLID" ||
        node.strokeStyleId !== oldValue.style.id
      )
        return;

      // 1. detach
      await node.setStrokeStyleIdAsync("");

      // 2. apply new variable
      node.strokes = [figma.variables.setBoundVariableForPaint(node.strokes[0], "color", variable)];

      break;
    }
    case "detached": {
      node.strokes = node.strokes.map((stroke) => {
        switch (stroke.type) {
          case "SOLID": {
            if (convertRgbColorToHexColor(stroke.color) !== oldValue.hex) return stroke;

            return figma.variables.setBoundVariableForPaint(stroke, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND":
            return {
              ...stroke,
              gradientStops: stroke.gradientStops.map((stop) => {
                if (convertRgbColorToHexColor(stop.color) !== oldValue.hex) return stop;

                const newStop = { ...stop };

                newStop.boundVariables = {
                  color: { type: "VARIABLE_ALIAS", id: variable.id },
                };

                return newStop;
              }),
            };
          case "IMAGE":
          case "VIDEO":
            return stroke;
        }
      });

      break;
    }
    case "variable": {
      node.strokes = node.strokes.map((stroke) => {
        switch (stroke.type) {
          case "SOLID": {
            if (stroke.boundVariables?.color?.id !== oldValue.variable.id) return stroke;

            return figma.variables.setBoundVariableForPaint(stroke, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND": {
            return {
              ...stroke,
              gradientStops: stroke.gradientStops.map((stop) => {
                if (stop.boundVariables?.color?.id !== oldValue.variable.id) return stop;

                const newStop = { ...stop };

                newStop.boundVariables = {
                  color: { type: "VARIABLE_ALIAS", id: variable.id },
                };

                return newStop;
              }),
            };
          }
          case "IMAGE":
          case "VIDEO":
            return stroke;
        }
      });

      break;
    }
    case "uncheckable":
      break;
  }
}

function applyColorVariableToMatchingEffects({
  node,
  oldValue,
  variable,
}: ApplyColorVariableParams) {
  if (!("effects" in node)) return;

  switch (oldValue.type) {
    case "detached": {
      node.effects = node.effects.map((effect) => {
        switch (effect.type) {
          case "DROP_SHADOW":
          case "INNER_SHADOW": {
            if (convertRgbColorToHexColor(effect.color) !== oldValue.hex) return effect;

            return figma.variables.setBoundVariableForEffect(effect, "color", variable);
          }
          case "LAYER_BLUR":
          case "BACKGROUND_BLUR":
            return effect;
        }
      });

      break;
    }
    case "variable": {
      node.effects = node.effects.map((effect) => {
        switch (effect.type) {
          case "DROP_SHADOW":
          case "INNER_SHADOW": {
            if (effect.boundVariables?.color?.id !== oldValue.variable.id) return effect;

            return figma.variables.setBoundVariableForEffect(effect, "color", variable);
          }
          case "LAYER_BLUR":
          case "BACKGROUND_BLUR":
            return effect;
        }
      });

      break;
    }
    case "style":
    case "uncheckable":
      break;
  }
}

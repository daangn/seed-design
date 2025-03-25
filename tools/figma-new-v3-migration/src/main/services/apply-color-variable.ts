import type { SerializedColorVariablesSuggestionsResults } from "../../shared/types";
import { convertRgbColorToHexColor } from "@create-figma-plugin/utilities";

interface ApplyColorVariableParams {
  node: SceneNode;
  oldValue: SerializedColorVariablesSuggestionsResults[number]["oldValue"];
  variable: Variable;
}

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

    // 각 노드에 대해 모든 타입의 색상 속성을 시도
    // 원래 oldValue 타입에 맞는 함수 먼저 실행
    await applyColorVariableToNode({ node, oldValue, variable });

    // 다른 타입의 색상 속성도 동일한 노드에 시도
    if (oldValue.type !== "detached") {
      // detached 색상 찾기 시도
      if (oldValue.type === "variable" || oldValue.type === "style") {
        const detachedOldValue = {
          type: "detached" as const,
          hex: oldValue.hex,
          opacity: oldValue.opacity,
        };
        await applyColorVariableToNode({ node, oldValue: detachedOldValue, variable });
      }
    }

    if (oldValue.type !== "variable") {
      // 기존 variable이 있다면 시도
      // 노드에 바인딩된 모든 변수를 확인하고 업데이트
      await applyToAllBoundVariables(node, variable);
    }
  }
}

/**
 * 노드에 바인딩된 모든 변수를 확인하고 업데이트합니다.
 */
async function applyToAllBoundVariables(node: SceneNode, newVariable: Variable) {
  if (!("boundVariables" in node)) return;

  // 노드에 직접 바인딩된 변수 처리
  if (node.boundVariables) {
    for (const [property, binding] of Object.entries(node.boundVariables)) {
      if (binding && typeof binding === "object" && "id" in binding && property.includes("color")) {
        try {
          // @ts-ignore
          node.setBoundVariable(property, newVariable);
        } catch (error) {
          console.error("Failed to set bound variable", error);
        }
      }
    }
  }

  // fill, stroke, effect에 바인딩된 변수도 처리
  await applyColorVariableToMatchingFills({
    node,
    oldValue: { type: "variable", variable: { id: "any" } as any, hex: "", opacity: 1 },
    variable: newVariable,
    checkAllBound: true,
  });

  await applyColorVariableToMatchingStrokes({
    node,
    oldValue: { type: "variable", variable: { id: "any" } as any, hex: "", opacity: 1 },
    variable: newVariable,
    checkAllBound: true,
  });

  applyColorVariableToMatchingEffects({
    node,
    oldValue: { type: "variable", variable: { id: "any" } as any, hex: "", opacity: 1 },
    variable: newVariable,
    checkAllBound: true,
  });
}

/**
 * 주어진 노드에 색상 변수를 적용합니다.
 */
async function applyColorVariableToNode({ node, oldValue, variable }: ApplyColorVariableParams) {
  await applyColorVariableToMatchingFills({ node, oldValue, variable });
  await applyColorVariableToMatchingStrokes({ node, oldValue, variable });
  applyColorVariableToMatchingEffects({ node, oldValue, variable });
}

async function applyColorVariableToMatchingFills({
  node,
  oldValue,
  variable,
  checkAllBound = false,
}: ApplyColorVariableParams & { checkAllBound?: boolean }) {
  if (!("fills" in node)) return;

  switch (oldValue.type) {
    case "style": {
      if (
        node.fillStyleId === figma.mixed ||
        node.fills === figma.mixed ||
        node.fills.length < 1 ||
        node.fills[0].type !== "SOLID" ||
        (node.fillStyleId !== oldValue.style.id && !checkAllBound)
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
            if (convertRgbColorToHexColor(fill.color) !== oldValue.hex && !checkAllBound)
              return fill;

            return figma.variables.setBoundVariableForPaint(fill, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND":
            return {
              ...fill,
              gradientStops: fill.gradientStops.map((stop) => {
                if (convertRgbColorToHexColor(stop.color) !== oldValue.hex && !checkAllBound)
                  return stop;

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
            if (fill.boundVariables?.color?.id !== oldValue.variable.id && !checkAllBound)
              return fill;

            return figma.variables.setBoundVariableForPaint(fill, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND": {
            return {
              ...fill,
              gradientStops: fill.gradientStops.map((stop) => {
                if (stop.boundVariables?.color?.id !== oldValue.variable.id && !checkAllBound)
                  return stop;

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
  checkAllBound = false,
}: ApplyColorVariableParams & { checkAllBound?: boolean }) {
  if (!("strokes" in node)) return;

  switch (oldValue.type) {
    case "style": {
      if (
        node.strokes.length < 1 ||
        node.strokes[0].type !== "SOLID" ||
        (node.strokeStyleId !== oldValue.style.id && !checkAllBound)
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
            if (convertRgbColorToHexColor(stroke.color) !== oldValue.hex && !checkAllBound)
              return stroke;

            return figma.variables.setBoundVariableForPaint(stroke, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND":
            return {
              ...stroke,
              gradientStops: stroke.gradientStops.map((stop) => {
                if (convertRgbColorToHexColor(stop.color) !== oldValue.hex && !checkAllBound)
                  return stop;

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
            if (stroke.boundVariables?.color?.id !== oldValue.variable.id && !checkAllBound)
              return stroke;

            return figma.variables.setBoundVariableForPaint(stroke, "color", variable);
          }
          case "GRADIENT_LINEAR":
          case "GRADIENT_RADIAL":
          case "GRADIENT_ANGULAR":
          case "GRADIENT_DIAMOND": {
            return {
              ...stroke,
              gradientStops: stroke.gradientStops.map((stop) => {
                if (stop.boundVariables?.color?.id !== oldValue.variable.id && !checkAllBound)
                  return stop;

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
  checkAllBound = false,
}: ApplyColorVariableParams & { checkAllBound?: boolean }) {
  if (!("effects" in node)) return;

  switch (oldValue.type) {
    case "detached": {
      node.effects = node.effects.map((effect) => {
        switch (effect.type) {
          case "DROP_SHADOW":
          case "INNER_SHADOW": {
            if (convertRgbColorToHexColor(effect.color) !== oldValue.hex && !checkAllBound)
              return effect;

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
            if (effect.boundVariables?.color?.id !== oldValue.variable.id && !checkAllBound)
              return effect;

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

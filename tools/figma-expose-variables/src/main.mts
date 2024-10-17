import { setRelaunchButton } from "@create-figma-plugin/utilities";
import { COMBINATION_INPUT_FRAME_NAMES, FRAME_NAMES, SUFFIXES } from "./constants.mjs";
import { createMainFrame } from "./node.mjs";
import { drawFrames } from "./utils.mjs";

setRelaunchButton(figma.root, "add", { description: "페이지에 Variable 프리뷰 프레임을 추가해요" });

type PreviewType = "foreground" | "background" | "stroke";

export interface FrameToDraw {
  name: FrameNode["name"];
  type: "token" | "palette";
  collections: {
    id: VariableCollection["id"];
    name: VariableCollection["name"];
    modes: {
      id: VariableCollection["modes"][number]["modeId"];
      name: VariableCollection["modes"][number]["name"];
      isDark: boolean;
      variablesByPrefix: {
        prefix: string;
        previewType: PreviewType;
        variableInfos: {
          variable: Variable;
          matchedSwatches: FrameNode[];
        }[];
      }[];
    }[];
  }[];
}

// const mainFrame = isFirstSelectionMainFrame ? (firstSelection as FrameNode) : createMainFrame();
// if (isFirstSelectionMainFrame) for (const child of mainFrame.children) child.remove();

figma.variables.getLocalVariableCollectionsAsync().then(async (variableCollections) => {
  if (variableCollections.length === 0) {
    figma.notify("보여줄 수 있는 variable collection이 없어요.", { error: true });
    figma.closePlugin();
  }

  const isValidCombinationsInputFrame = (node: SceneNode): node is FrameNode =>
    node.type === "FRAME" &&
    (node.name === COMBINATION_INPUT_FRAME_NAMES.DEFAULT ||
      node.name === COMBINATION_INPUT_FRAME_NAMES.DARK);

  const combinationsInputFrames = {
    default: (() => {
      const sceneNodeFound = figma.currentPage.findOne(
        (node) => node.name === COMBINATION_INPUT_FRAME_NAMES.DEFAULT,
      );

      if (!sceneNodeFound || !isValidCombinationsInputFrame(sceneNodeFound)) return undefined;
      return sceneNodeFound;
    })(),
    dark: (() => {
      const sceneNodeFound = figma.currentPage.findOne(
        (node) => node.name === COMBINATION_INPUT_FRAME_NAMES.DARK,
      );

      if (!sceneNodeFound || !isValidCombinationsInputFrame(sceneNodeFound)) return undefined;
      return sceneNodeFound;
    })(),
  };

  const swatches = {
    default: combinationsInputFrames.default?.children.filter(isValidSwatch) ?? [],
    dark: combinationsInputFrames.dark?.children.filter(isValidSwatch) ?? [],
  };

  const framesToDraw = await getFramesToDraw({
    variableCollections,
    swatches,
    collectionNamesToInclude: ["Color"],
  });

  drawFrames({ framesToDraw, possibleSuffixes: SUFFIXES }).then(() => {
    // figma.currentPage.selection = [mainFrame];
    // figma.viewport.scrollAndZoomIntoView([mainFrame]);

    figma.notify("생성 완료!");

    figma.closePlugin();
  });
});

function getPreviewType(variablePrefix: string) {
  switch (variablePrefix) {
    case "fg":
      return "foreground";
    case "bg":
      return "background";
    case "stroke":
      return "stroke";
    default:
      return "foreground";
  }
}

interface GetFramesToDrawParams {
  variableCollections: VariableCollection[];
  swatches: {
    default: FrameNode[];
    dark: FrameNode[];
  };
  collectionNamesToInclude?: string[];
}

async function getFramesToDraw({
  variableCollections,
  swatches,
  collectionNamesToInclude,
}: GetFramesToDrawParams) {
  const framesToDraw: FrameToDraw[] = [];

  const filterCollection = (collection: VariableCollection) =>
    !collectionNamesToInclude || collectionNamesToInclude.includes(collection.name);

  for (const collection of variableCollections) {
    if (!filterCollection(collection)) continue;

    for (const mode of collection.modes) {
      const promises = collection.variableIds.map((id) => figma.variables.getVariableByIdAsync(id));
      const variablesInCollection = await Promise.all(promises);

      for (const variable of variablesInCollection) {
        if (!variable) continue;

        const variablePrefix = variable.name.split("/")[0];
        const previewType = getPreviewType(variablePrefix);
        const isVariablePalette = variablePrefix.startsWith("palette");

        let frameToDraw: FrameToDraw | undefined = isVariablePalette
          ? framesToDraw.find(({ name }) => name === FRAME_NAMES.PALETTES)
          : framesToDraw.find(({ name }) => name === FRAME_NAMES.DEFAULT);

        // make a new frame to draw if it doesn't exist
        if (!frameToDraw) {
          const newFrameToDraw: FrameToDraw = {
            name: isVariablePalette ? FRAME_NAMES.PALETTES : FRAME_NAMES.DEFAULT,
            type: isVariablePalette ? "palette" : "token",
            collections: variableCollections.filter(filterCollection).map((collection) => ({
              id: collection.id,
              name: collection.name,
              modes: collection.modes.map((mode) => ({
                id: mode.modeId,
                name: mode.name,
                isDark: mode.name.toLowerCase().includes("dark"),
                variablesByPrefix: [
                  {
                    prefix: variablePrefix,
                    previewType,
                    variableInfos: [],
                  },
                ],
              })),
            })),
          };

          framesToDraw.push(newFrameToDraw);
          frameToDraw = newFrameToDraw;
        }

        let collectionToDraw = frameToDraw.collections.find(({ id }) => id === collection.id);
        if (!collectionToDraw) {
          const newCollection = {
            id: collection.id,
            name: collection.name,
            modes: collection.modes.map((mode) => ({
              id: mode.modeId,
              name: mode.name,
              isDark: mode.name.toLowerCase().includes("dark"),
              variablesByPrefix: [
                {
                  prefix: variablePrefix,
                  previewType: previewType as PreviewType,
                  variableInfos: [],
                },
              ],
            })),
          };

          frameToDraw.collections.push(newCollection);
          collectionToDraw = newCollection;
        }

        let modeToDraw = collectionToDraw.modes.find(({ id }) => id === mode.modeId);
        if (!modeToDraw) {
          const newMode = {
            id: mode.modeId,
            name: mode.name,
            isDark: mode.name.toLowerCase().includes("dark"),
            variablesByPrefix: [
              {
                prefix: variablePrefix,
                previewType: previewType as PreviewType,
                variableInfos: [],
              },
            ],
          };

          collectionToDraw.modes.push(newMode);
          modeToDraw = newMode;
        }

        let variablesByPrefixToDraw = modeToDraw.variablesByPrefix.find(
          ({ prefix }) => prefix === variablePrefix,
        );
        if (!variablesByPrefixToDraw) {
          const newVariablesByPrefix = {
            prefix: variablePrefix,
            previewType: previewType as PreviewType,
            variableInfos: [],
          };

          modeToDraw.variablesByPrefix.push(newVariablesByPrefix);
          variablesByPrefixToDraw = newVariablesByPrefix;
        }

        const swatchesToUse = swatches[modeToDraw.isDark ? "dark" : "default"];

        const matchedSwatches = swatchesToUse.filter((swatch) => {
          const nodeToCheck =
            previewType === "foreground" ? (swatch.children[0] as TextNode) : swatch;

          if (nodeToCheck.fills === figma.mixed || nodeToCheck.fills[0].type !== "SOLID")
            return false;

          return nodeToCheck.fills[0].boundVariables?.color?.id === variable.id;
        });

        variablesByPrefixToDraw.variableInfos.push({ variable, matchedSwatches });
      }
    }
  }

  return framesToDraw;
}

function isValidSwatch(node: SceneNode): node is FrameNode {
  return (
    node.type === "FRAME" &&
    node.fills !== figma.mixed &&
    node.fills.every(
      (fill) => fill.type === "SOLID" && fill.boundVariables && fill.boundVariables.color,
    ) &&
    node.children.length === 1 &&
    node.children[0].type === "TEXT"
  );
}

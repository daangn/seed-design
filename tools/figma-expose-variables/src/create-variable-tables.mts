import { VARIABLE_TABLE_NAMES } from "constants.mjs";
import { getPreviewType } from "utils.mjs";

type PreviewType = "foreground" | "background" | "stroke";

export interface VariableTable {
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

interface CreateVariableTablesParams {
  variableCollections: VariableCollection[];
  swatches: {
    default: FrameNode[];
    dark: FrameNode[];
  };
  collectionNamesToInclude?: string[];
}

export async function createVariableTables({
  variableCollections,
  swatches,
  collectionNamesToInclude,
}: CreateVariableTablesParams) {
  const framesToDraw: VariableTable[] = [];

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

        let frameToDraw: VariableTable | undefined = isVariablePalette
          ? framesToDraw.find(({ name }) => name === VARIABLE_TABLE_NAMES.PALETTES)
          : framesToDraw.find(({ name }) => name === VARIABLE_TABLE_NAMES.DEFAULT);

        // make a new frame to draw if it doesn't exist
        if (!frameToDraw) {
          const newFrameToDraw: VariableTable = {
            name: isVariablePalette ? VARIABLE_TABLE_NAMES.PALETTES : VARIABLE_TABLE_NAMES.DEFAULT,
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

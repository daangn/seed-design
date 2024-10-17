import type { FrameToDraw } from "main.mjs";
import { FILLS, FONT_FAMILIES, FONT_SIZES, FRAME_NAMES, SIZES } from "./constants.mjs";
import { createAutoLayout, createMainFrame, createTableCell, createTextNode } from "./node.mjs";

interface DrawFramesParams {
  framesToDraw: FrameToDraw[];
  possibleSuffixes: string[];
}

export async function drawFrames({ framesToDraw, possibleSuffixes }: DrawFramesParams) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  for (const key in FONT_FAMILIES) {
    await figma.loadFontAsync(FONT_FAMILIES[key as keyof typeof FONT_FAMILIES]);
  }

  for (const frameToDraw of framesToDraw) {
    const mainFrame = createMainFrame({ name: frameToDraw.name });

    for (const collection of frameToDraw.collections) {
      const collectionFrame = createAutoLayout(
        {
          name: collection.name,
          layoutMode: "VERTICAL",
          layoutSizingHorizontal: "HUG",
          layoutSizingVertical: "HUG",
          itemSpacing: 24,
        },
        mainFrame,
      );

      createTextNode(
        {
          characters: `${collection.name} / ${frameToDraw.name}`,
          fontName: FONT_FAMILIES.BOLD,
          fontSize: FONT_SIZES.XXL,
          fills: [FILLS.DARK],
        },
        collectionFrame,
      );

      const modesFrame = createAutoLayout(
        {
          name: "Modes",
          layoutMode: frameToDraw.type === "palette" ? "VERTICAL" : "HORIZONTAL",
          layoutSizingHorizontal: "HUG",
          layoutSizingVertical: "HUG",
          itemSpacing: 32,
        },
        collectionFrame,
      );

      for (const mode of collection.modes) {
        const frameFills = [mode.isDark ? FILLS.DARK : FILLS.LIGHT];
        const textFills = [mode.isDark ? FILLS.LIGHT : FILLS.DARK];
        const fadedFills = [mode.isDark ? FILLS.DARK_FADED : FILLS.LIGHT_FADED];

        const modeFrame = createAutoLayout(
          {
            name: mode.name,
            layoutMode: "VERTICAL",
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            itemSpacing: 24,
            paddingX: 32,
            paddingY: 32,
          },
          modesFrame,
        );
        modeFrame.cornerRadius = 16;
        modeFrame.fills = frameFills;

        const collectionFound = await figma.variables.getVariableCollectionByIdAsync(collection.id);
        if (collectionFound) {
          modeFrame.setExplicitVariableModeForCollection(collectionFound, mode.id);
        }

        createTextNode(
          {
            characters: mode.name,
            fontName: FONT_FAMILIES.BOLD,
            fontSize: FONT_SIZES.XL,
            fills: textFills,
            opacity: 0.9,
          },
          modeFrame,
        );

        const prefixesFrame = createAutoLayout(
          {
            name: "Prefixes",
            layoutMode: "VERTICAL",
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            itemSpacing: 16,
          },
          modeFrame,
        );

        for (const { prefix, variableInfos, previewType } of mode.variablesByPrefix) {
          const prefixFrame = createAutoLayout(
            {
              name: prefix,
              layoutMode: "VERTICAL",
              layoutSizingHorizontal: "HUG",
              layoutSizingVertical: "HUG",
              itemSpacing: 8,
            },
            prefixesFrame,
          );

          const prefixTitleContainer = createAutoLayout(
            {
              name: prefix,
              layoutMode: "HORIZONTAL",
              layoutSizingHorizontal: "HUG",
              layoutSizingVertical: "HUG",
              paddingX: 12,
            },
            prefixFrame,
          );

          createTextNode(
            {
              characters: prefix,
              fontName: FONT_FAMILIES.BOLD,
              fontSize: FONT_SIZES.LG,
              fills: textFills,
              opacity: 0.8,
            },
            prefixTitleContainer,
          );

          const prefixTable = createAutoLayout(
            {
              name: prefix,
              layoutMode: frameToDraw.type === "palette" ? "HORIZONTAL" : "VERTICAL",
              layoutSizingHorizontal: "HUG",
              layoutSizingVertical: "HUG",
            },
            prefixFrame,
          );
          prefixTable.clipsContent = true;
          prefixTable.cornerRadius = 8;
          prefixTable.strokes = fadedFills;
          prefixTable.strokeWeight = 2;

          switch (frameToDraw.type) {
            case "token": {
              for (const { variable, matchedSwatches } of variableInfos) {
                const variableRow = createAutoLayout(
                  {
                    name: variable.name,
                    layoutMode: "HORIZONTAL",
                    layoutSizingHorizontal: "FILL",
                    height: SIZES.CELL_HEIGHT,
                  },
                  prefixTable,
                );

                console.log(variableRow);

                // Cell #1: Variable Name

                const titleCell = createTableCell(
                  {
                    name: variable.name,
                    width: SIZES.CELL_WIDTH,
                    layoutSizingVertical: "FILL",
                  },
                  variableRow,
                );
                titleCell.fills = fadedFills;

                const hasSuffix = possibleSuffixes.some((suffix) => variable.name.endsWith(suffix));

                createTextNode(
                  {
                    characters: hasSuffix ? `┗ ${variable.name}` : variable.name,
                    fontName: FONT_FAMILIES.REGULAR,
                    fontSize: FONT_SIZES.BASE,
                    fills: textFills,
                  },
                  titleCell,
                );

                // Cell #2: Preview

                const previewCell = createTableCell(
                  {
                    name: "Preview",
                    width: SIZES.CELL_WIDTH,
                    layoutSizingVertical: "FILL",
                  },
                  variableRow,
                );

                switch (previewType) {
                  case "foreground": {
                    createTextNode(
                      {
                        characters: "Aa",
                        fontName: FONT_FAMILIES.BOLD,
                        fontSize: 16,
                        fills: [
                          figma.variables.setBoundVariableForPaint(
                            { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
                            "color",
                            variable,
                          ),
                        ],
                      },
                      previewCell,
                    );

                    break;
                  }
                  case "background": {
                    const color = figma.createRectangle();
                    color.cornerRadius = 4;
                    color.resize(16, 16);
                    color.strokes = fadedFills;
                    color.fills = frameFills; // temporal
                    color.fills = [
                      figma.variables.setBoundVariableForPaint(
                        color.fills[0] as SolidPaint,
                        "color",
                        variable,
                      ),
                    ];

                    previewCell.appendChild(color);

                    break;
                  }
                  case "stroke": {
                    const color = figma.createRectangle();
                    color.cornerRadius = 4;
                    color.resize(16, 16);
                    color.fills = [];
                    color.strokes = frameFills; // temporal
                    color.strokes = [
                      figma.variables.setBoundVariableForPaint(
                        color.strokes[0] as SolidPaint,
                        "color",
                        variable,
                      ),
                    ];
                    color.strokeWeight = 2;

                    previewCell.appendChild(color);

                    break;
                  }
                }

                const variableValue = variable.valuesByMode[mode.id];

                const characters = isVariableAlias(variableValue)
                  ? ((await figma.variables.getVariableByIdAsync(variableValue.id))?.name ??
                    "Unknown")
                  : typeof variableValue === "object"
                    ? getHexString(variableValue)
                    : "Unknown";

                createTextNode(
                  {
                    characters,
                    fontName: FONT_FAMILIES.REGULAR,
                    fontSize: FONT_SIZES.BASE,
                    fills: textFills,
                  },
                  previewCell,
                );

                // Cell #3: Combinations

                if (matchedSwatches.length === 0) continue;

                const combinationsCell = createTableCell(
                  {
                    name: "Combinations",
                    layoutSizingHorizontal: "HUG",
                    layoutSizingVertical: "FILL",
                  },
                  variableRow,
                );

                for (const matchedSwatch of matchedSwatches) {
                  combinationsCell.appendChild(matchedSwatch.clone());
                }
              }

              break;
            }
            case "palette": {
              const paletteByShade = variableInfos.reduce(
                (acc, { variable }) => {
                  const hue = variable.name.split("/")[1].split("-")[0];
                  if (!acc[hue]) acc[hue] = [];

                  acc[hue].push(variable);
                  return acc;
                },
                {} as Record<string, Variable[]>,
              );

              for (const hue in paletteByShade) {
                const hueTable = createAutoLayout(
                  {
                    name: hue,
                    layoutMode: "VERTICAL",
                    layoutSizingHorizontal: "HUG",
                    layoutSizingVertical: "HUG",
                  },
                  prefixTable,
                );

                for (const scale of paletteByShade[hue]) {
                  const scaleRow = createAutoLayout(
                    {
                      name: scale.name,
                      layoutMode: "HORIZONTAL",
                      layoutSizingHorizontal: "FILL",
                      height: SIZES.CELL_HEIGHT,
                    },
                    hueTable,
                  );

                  const titleCell = createTableCell(
                    {
                      name: scale.name,
                      width: hue === "static" ? 240 : 170,
                      layoutSizingVertical: "FILL",
                    },
                    scaleRow,
                  );
                  titleCell.fills = fadedFills;

                  createTextNode(
                    {
                      characters: scale.name,
                      fontName: FONT_FAMILIES.REGULAR,
                      fontSize: FONT_SIZES.BASE,
                      fills: textFills,
                    },
                    titleCell,
                  );

                  const previewCell = createTableCell(
                    {
                      name: "Preview",
                      width: 150,
                      layoutSizingVertical: "FILL",
                    },
                    scaleRow,
                  );

                  const color = figma.createRectangle();
                  color.cornerRadius = 4;
                  color.resize(16, 16);
                  color.strokes = fadedFills;
                  color.fills = frameFills; // temporal
                  color.fills = [
                    figma.variables.setBoundVariableForPaint(
                      color.fills[0] as SolidPaint,
                      "color",
                      scale,
                    ),
                  ];

                  previewCell.appendChild(color);

                  const scaleValue = scale.valuesByMode[mode.id];

                  const characters = isVariableAlias(scaleValue)
                    ? ((await figma.variables.getVariableByIdAsync(scaleValue.id))?.name ??
                      "Unknown")
                    : typeof scaleValue === "object"
                      ? getHexString(scaleValue)
                      : "Unknown";

                  createTextNode(
                    {
                      characters,
                      fontName: FONT_FAMILIES.REGULAR,
                      fontSize: FONT_SIZES.BASE,
                      fills: textFills,
                    },
                    previewCell,
                  );
                }
              }

              break;
            }
          }
        }
      }
    }
  }
}

export function isVariableAlias(variableValue: VariableValue): variableValue is VariableAlias {
  return (
    typeof variableValue === "object" &&
    "type" in variableValue &&
    variableValue.type === "VARIABLE_ALIAS"
  );
}

export function isValidSwatch(node: SceneNode): node is FrameNode {
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

export function getHexString(color: RGB | RGBA): string {
  const componentToHex = (c: number): string => {
    if (c < 0 || c > 1) return "00";

    const hex = Math.round(c * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();

    return hex;
  };

  const { r, g, b } = color;

  const rHex = componentToHex(r);
  const gHex = componentToHex(g);
  const bHex = componentToHex(b);

  const aString = "a" in color && color.a !== 1 ? ` (${(color.a * 100).toFixed(0)}%)` : "";

  return `#${rHex}${gHex}${bHex}${aString}`;
}

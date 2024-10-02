import { FILLS, FONT_FAMILIES, FONT_SIZES, SIZES } from "./constants.mjs";
import { createAutoLayout, createTableCell, createTextNode } from "./node.mjs";

interface WriteVariablesParams {
  mainFrame: FrameNode;
  variableCollections: VariableCollection[];
  combinationFrameNames: {
    default: FrameNode["name"];
    dark: FrameNode["name"];
  };
  possibleSuffixes: string[];
}

export async function writeVariables({
  mainFrame,
  variableCollections,
  combinationFrameNames,
  possibleSuffixes,
}: WriteVariablesParams) {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  for (const key in FONT_FAMILIES) {
    await figma.loadFontAsync(FONT_FAMILIES[key as keyof typeof FONT_FAMILIES]);
  }

  for (const collection of variableCollections) {
    if (collection.name.toLowerCase().includes("color") === false) continue;

    const collectionFrame = createAutoLayout(
      {
        name: collection.name,
        layoutMode: "VERTICAL",
        layoutSizingHorizontal: "HUG",
        layoutSizingVertical: "HUG",
        itemSpacing: 24,
      },
      mainFrame
    );

    createTextNode(
      {
        characters: collection.name,
        fontName: FONT_FAMILIES.BOLD,
        fontSize: FONT_SIZES.XXL,
        fills: [FILLS.DARK],
      },
      collectionFrame
    );

    const modesFrame = createAutoLayout(
      {
        name: "Modes",
        layoutMode: "HORIZONTAL",
        layoutSizingHorizontal: "HUG",
        layoutSizingVertical: "HUG",
        itemSpacing: 32,
      },
      collectionFrame
    );

    for (const mode of collection.modes) {
      const isModeDark = mode.name.toLowerCase().includes("dark");
      const frameFills = [isModeDark ? FILLS.DARK : FILLS.LIGHT];
      const textFills = [isModeDark ? FILLS.LIGHT : FILLS.DARK];
      const fadedFills = [isModeDark ? FILLS.DARK_FADED : FILLS.LIGHT_FADED];

      const combinationsInputFrame = figma.currentPage.findOne(
        (node) =>
          node.name ===
          (isModeDark
            ? combinationFrameNames.dark
            : combinationFrameNames.default)
      );

      const swatches =
        combinationsInputFrame && combinationsInputFrame.type === "FRAME"
          ? combinationsInputFrame.children.filter(isValidSwatch)
          : [];

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
        modesFrame
      );
      modeFrame.cornerRadius = 16;
      modeFrame.fills = frameFills;
      modeFrame.setExplicitVariableModeForCollection(collection, mode.modeId);

      createTextNode(
        {
          characters: mode.name,
          fontName: FONT_FAMILIES.BOLD,
          fontSize: FONT_SIZES.XL,
          fills: textFills,
          opacity: 0.9,
        },
        modeFrame
      );

      const prefixesFrame = createAutoLayout(
        {
          name: "Prefixes",
          layoutMode: "VERTICAL",
          layoutSizingHorizontal: "HUG",
          layoutSizingVertical: "HUG",
          itemSpacing: 16,
        },
        modeFrame
      );

      const promises = collection.variableIds.map((id) =>
        figma.variables.getVariableByIdAsync(id)
      );

      const variables = await Promise.all(promises);

      const colorVariablesByPrefixes = (
        variables.filter(
          (variable) => variable && variable.resolvedType === "COLOR"
        ) as Variable[]
      ).reduce((acc, variable) => {
        const prefix = variable.name.split("/")[0];
        if (!acc[prefix]) acc[prefix] = [];

        acc[prefix].push(variable);
        return acc;
      }, {} as Record<string, Variable[]>);

      for (const prefix in colorVariablesByPrefixes) {
        const prefixFrame = createAutoLayout(
          {
            name: prefix,
            layoutMode: "VERTICAL",
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            itemSpacing: 8,
          },
          prefixesFrame
        );

        const prefixTitleContainer = createAutoLayout(
          {
            name: prefix,
            layoutMode: "HORIZONTAL",
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
            paddingX: 12,
          },
          prefixFrame
        );

        createTextNode(
          {
            characters: prefix,
            fontName: FONT_FAMILIES.BOLD,
            fontSize: FONT_SIZES.LG,
            fills: textFills,
            opacity: 0.8,
          },
          prefixTitleContainer
        );

        const prefixTable = createAutoLayout(
          {
            name: prefix,
            layoutMode: "VERTICAL",
            layoutSizingHorizontal: "HUG",
            layoutSizingVertical: "HUG",
          },
          prefixFrame
        );
        prefixTable.clipsContent = true;
        prefixTable.cornerRadius = 8;
        prefixTable.strokes = fadedFills;
        prefixTable.strokeWeight = 2;

        if (prefix.toLowerCase().includes("palette")) {
          prefixTable.layoutMode = "HORIZONTAL";

          const paletteVariables = colorVariablesByPrefixes[prefix];

          // names are "palette/gray-00", "palette/gray-100", ..., "palette/gray-900"

          const paletteByShade = paletteVariables.reduce((acc, variable) => {
            const hue = variable.name.split("/")[1].split("-")[0];
            if (!acc[hue]) acc[hue] = [variable];

            acc[hue].push(variable);
            return acc;
          }, {} as Record<string, Variable[]>);

          console.log(paletteByShade);

          for (const hue in paletteByShade) {
            const hueTable = createAutoLayout(
              {
                name: hue,
                layoutMode: "VERTICAL",
                layoutSizingHorizontal: "HUG",
                layoutSizingVertical: "HUG",
              },
              prefixTable
            );

            for (const scale of paletteByShade[hue]) {
              const scaleRow = createAutoLayout(
                {
                  name: scale.name,
                  layoutMode: "HORIZONTAL",
                  layoutSizingHorizontal: "FILL",
                  height: SIZES.CELL_HEIGHT,
                },
                hueTable
              );

              const titleCell = createTableCell(
                {
                  name: scale.name,
                  width: hue === "static" ? SIZES.CELL_WIDTH : 160,
                  layoutSizingVertical: "FILL",
                },
                scaleRow
              );
              titleCell.fills = fadedFills;

              createTextNode(
                {
                  characters: scale.name,
                  fontName: FONT_FAMILIES.MONO,
                  fontSize: FONT_SIZES.BASE,
                  fills: textFills,
                },
                titleCell
              );

              const previewCell = createTableCell(
                {
                  name: "Preview",
                  width: hue === "static" ? SIZES.CELL_WIDTH : 230,
                  layoutSizingVertical: "FILL",
                },
                scaleRow
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
                  scale
                ),
              ];

              previewCell.appendChild(color);

              const scaleValue = scale.valuesByMode[mode.modeId];

              const characters = isVariableAlias(scaleValue)
                ? (await figma.variables.getVariableByIdAsync(scaleValue.id))
                    ?.name ?? "Unknown"
                : typeof scaleValue === "object"
                ? `${getHexString(scaleValue)} / ${getRGBAString(scaleValue)}`
                : "Unknown";

              createTextNode(
                {
                  characters,
                  fontName: FONT_FAMILIES.MONO,
                  fontSize: FONT_SIZES.BASE,
                  fills: textFills,
                },
                previewCell
              );
            }
          }

          continue;
        }

        for (const variable of colorVariablesByPrefixes[prefix]) {
          const variableRow = createAutoLayout(
            {
              name: variable.name,
              layoutMode: "HORIZONTAL",
              layoutSizingHorizontal: "FILL",
              height: SIZES.CELL_HEIGHT,
            },
            prefixTable
          );

          // Cell #1: Variable Name

          const titleCell = createTableCell(
            {
              name: variable.name,
              width: SIZES.CELL_WIDTH,
              layoutSizingVertical: "FILL",
            },
            variableRow
          );
          titleCell.fills = fadedFills;

          const hasSuffix = possibleSuffixes.some((suffix) =>
            variable.name.endsWith(suffix)
          );

          createTextNode(
            {
              characters: hasSuffix ? `┗ ${variable.name}` : variable.name,
              fontName: FONT_FAMILIES.MONO,
              fontSize: FONT_SIZES.BASE,
              fills: textFills,
            },
            titleCell
          );

          // Cell #2: Preview

          const previewCell = createTableCell(
            {
              name: "Preview",
              width: SIZES.CELL_WIDTH,
              layoutSizingVertical: "FILL",
            },
            variableRow
          );

          switch (prefix) {
            case "fg": {
              createTextNode(
                {
                  characters: "Aa",
                  fontName: FONT_FAMILIES.BOLD,
                  fontSize: 16,
                  fills: [
                    figma.variables.setBoundVariableForPaint(
                      { type: "SOLID", color: { r: 1, g: 1, b: 1 } },
                      "color",
                      variable
                    ),
                  ],
                },
                previewCell
              );

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
                  variable
                ),
              ];
              color.strokeWeight = 2;

              previewCell.appendChild(color);

              break;
            }
            // biome-ignore lint/complexity/noUselessSwitchCase: <explanation>
            case "bg":
            default: {
              const color = figma.createRectangle();
              color.cornerRadius = 4;
              color.resize(16, 16);
              color.strokes = fadedFills;
              color.fills = frameFills; // temporal
              color.fills = [
                figma.variables.setBoundVariableForPaint(
                  color.fills[0] as SolidPaint,
                  "color",
                  variable
                ),
              ];

              previewCell.appendChild(color);

              break;
            }
          }

          const variableValue = variable.valuesByMode[mode.modeId];

          const characters = isVariableAlias(variableValue)
            ? (await figma.variables.getVariableByIdAsync(variableValue.id))
                ?.name ?? "Unknown"
            : typeof variableValue === "object"
            ? `${getHexString(variableValue)} / ${getRGBAString(variableValue)}`
            : "Unknown";

          createTextNode(
            {
              characters,
              fontName: FONT_FAMILIES.MONO,
              fontSize: FONT_SIZES.BASE,
              fills: textFills,
            },
            previewCell
          );

          // Cell #3: Combinations

          const matchedSwatches = swatches.filter((swatch) => {
            const nodeToCheck =
              prefix === "fg" ? (swatch.children[0] as TextNode) : swatch;

            if (
              nodeToCheck.fills === figma.mixed ||
              nodeToCheck.fills[0].type !== "SOLID"
            )
              return false;

            return (
              nodeToCheck.fills[0].boundVariables?.color?.id === variable.id
            );
          });

          if (matchedSwatches.length === 0) continue;

          const combinationsCell = createTableCell(
            {
              name: "Combinations",
              layoutSizingHorizontal: "HUG",
              layoutSizingVertical: "FILL",
            },
            variableRow
          );

          for (const matchedSwatch of matchedSwatches) {
            combinationsCell.appendChild(matchedSwatch.clone());
          }
        }
      }
    }
  }
}

export function isVariableAlias(
  variableValue: VariableValue
): variableValue is VariableAlias {
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
      (fill) =>
        fill.type === "SOLID" &&
        fill.boundVariables &&
        fill.boundVariables.color
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
  const aHex = "a" in color ? componentToHex(color.a) : "";

  return `#${rHex}${gHex}${bHex}${aHex === "FF" ? "" : aHex}`;
}

export function getRGBAString(color: RGB | RGBA) {
  const getRoundedString = (value: number) =>
    Math.round(value * 255).toString();

  const { r, g, b } = color;

  const rString = getRoundedString(r);
  const gString = getRoundedString(g);
  const bString = getRoundedString(b);
  const aString =
    "a" in color && color.a !== 1
      ? ` / ${Math.round(color.a * 100).toString()}%`
      : "";

  return `rgb(${rString} ${gString} ${bString}${aString})`;
}

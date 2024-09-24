import {
  FILLS,
  FONT_FAMILIES,
  FONT_SIZES,
  MAIN_FRAME_RELAUNCH_DATA,
  SIZES,
} from "./constants";

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
    // FIXME
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
        if (prefix === "palette") continue;

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
              name: "Color Chip",
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
            case "bg": {
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
          }

          const variableValue = variable.valuesByMode[mode.modeId];

          if (isVariableAlias(variableValue)) {
            createTextNode(
              {
                characters:
                  (await figma.variables.getVariableByIdAsync(variableValue.id))
                    ?.name ?? "Unknown",
                fontName: FONT_FAMILIES.MONO,
                fontSize: FONT_SIZES.BASE,
                fills: textFills,
              },
              previewCell
            );
          }

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

export function createMainFrame() {
  const frame = createAutoLayout({
    name: "Variables",
    layoutMode: "VERTICAL",
    layoutSizingHorizontal: "HUG",
    layoutSizingVertical: "HUG",
    itemSpacing: 8,
    paddingX: 64,
    paddingY: 64,
  });

  // FIXME
  // frame.locked = true;
  frame.fills = [{ type: "SOLID", color: { r: 0.93, g: 0.93, b: 0.95 } }];

  frame.setRelaunchData(MAIN_FRAME_RELAUNCH_DATA);

  return frame;
}

type CreateTextNodeParams = Pick<
  TextNode,
  "characters" | "fontName" | "fontSize" | "fills"
> &
  Partial<Pick<TextNode, "opacity">>;

export function createTextNode(
  { characters, fontName, fontSize, fills, opacity = 1 }: CreateTextNodeParams,
  parent?: FrameNode
) {
  const node = figma.createText();

  node.characters = characters;
  node.fontName = fontName;
  node.fontSize = fontSize;
  node.fills = fills;
  node.opacity = opacity;

  parent?.appendChild(node);

  return node;
}

type SizingParams = (
  | {
      width: FrameNode["width"];
      layoutSizingHorizontal?: never;
    }
  | {
      width?: never;
      layoutSizingHorizontal: Exclude<
        FrameNode["layoutSizingHorizontal"],
        "FIXED"
      >;
    }
) &
  (
    | {
        height: FrameNode["height"];
        layoutSizingVertical?: never;
      }
    | {
        height?: never;
        layoutSizingVertical: Exclude<
          FrameNode["layoutSizingVertical"],
          "FIXED"
        >;
      }
  );

type CreateAutoLayoutParams = Pick<FrameNode, "name" | "layoutMode"> &
  Partial<Pick<FrameNode, "itemSpacing">> &
  SizingParams & {
    paddingX?: FrameNode["paddingLeft"] & FrameNode["paddingRight"];
    paddingY?: FrameNode["paddingTop"] & FrameNode["paddingBottom"];
  };

export function createAutoLayout(
  {
    name,
    width,
    height,
    layoutSizingHorizontal,
    layoutSizingVertical,
    layoutMode,
    itemSpacing = 0,
    paddingX = 0,
    paddingY = 0,
  }: CreateAutoLayoutParams,
  parent?: FrameNode
) {
  const frame = figma.createFrame();

  frame.name = name;
  frame.fills = [];

  frame.layoutMode = layoutMode;
  frame.itemSpacing = itemSpacing;
  frame.paddingLeft = paddingX;
  frame.paddingRight = paddingX;
  frame.paddingTop = paddingY;
  frame.paddingBottom = paddingY;

  parent?.appendChild(frame);

  frame.resize(width ?? frame.width, height ?? frame.height);

  if (layoutSizingHorizontal)
    frame.layoutSizingHorizontal = layoutSizingHorizontal;
  if (layoutSizingVertical) frame.layoutSizingVertical = layoutSizingVertical;

  return frame;
}

type CreateTableCellParams = Pick<FrameNode, "name"> & SizingParams;

export function createTableCell(
  {
    name,
    width,
    height,
    layoutSizingHorizontal,
    layoutSizingVertical,
  }: CreateTableCellParams,
  parent?: FrameNode
) {
  const frame = figma.createFrame();

  frame.name = name;
  frame.fills = [];

  frame.layoutMode = "HORIZONTAL";
  frame.counterAxisAlignItems = "CENTER";

  frame.itemSpacing = 8;
  frame.counterAxisSpacing = 8;

  frame.paddingLeft = 16;
  frame.paddingRight = 16;
  frame.paddingTop = 8;
  frame.paddingBottom = 8;

  parent?.appendChild(frame);

  frame.resize(width ?? frame.width, height ?? frame.height);

  if (layoutSizingHorizontal)
    frame.layoutSizingHorizontal = layoutSizingHorizontal;
  if (layoutSizingVertical) frame.layoutSizingVertical = layoutSizingVertical;

  return frame;
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

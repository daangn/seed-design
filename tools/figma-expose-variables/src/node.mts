import { setRelaunchButton } from "@create-figma-plugin/utilities";

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

  frame.fills = [{ type: "SOLID", color: { r: 0.93, g: 0.93, b: 0.95 } }];

  setRelaunchButton(frame, "update", {
    description: "이 프리뷰 프레임을 Variable 변경 사항에 맞추어 업데이트해요",
  });

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

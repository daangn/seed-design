import { APCAcontrast, displayP3toY, sRGBtoY, fontLookupAPCA } from "apca-w3";

export type Pair = {
  key: string;
  bg: { r: number; g: number; b: number; name: string };
  fg: { r: number; g: number; b: number; name: string };
  contrast: number;
  fontSizes: {
    regular: number;
    medium: number;
    bold: number;
  };
};

export const calculateApcaScore = (
  fg: RGB,
  bg: RGB,
  colorSpace: "LEGACY" | "SRGB" | "DISPLAY_P3",
): number => {
  if (colorSpace === "DISPLAY_P3") {
    const fgY = displayP3toY([fg.r, fg.g, fg.b]);
    const bgY = displayP3toY([bg.r, bg.g, bg.b]);
    const contrast = APCAcontrast(fgY, bgY);

    return Math.abs(Math.round(Number(contrast)));
  }

  const fgDecimal = {
    r: fg.r * 255,
    g: fg.g * 255,
    b: fg.b * 255,
  };
  const bgDecimal = {
    r: bg.r * 255,
    g: bg.g * 255,
    b: bg.b * 255,
  };

  return Math.abs(
    Math.round(
      Number(
        APCAcontrast(
          sRGBtoY([fgDecimal.r, fgDecimal.g, fgDecimal.b]),
          sRGBtoY([bgDecimal.r, bgDecimal.g, bgDecimal.b]),
        ),
      ),
    ),
  );
};

export const getPairs = (props: {
  inputFrame: FrameNode;
  variableMap: Map<string, Variable>;
  colorSpace: "LEGACY" | "SRGB" | "DISPLAY_P3";
}): Pair[] => {
  const { inputFrame, variableMap, colorSpace } = props;

  const createPairData = (bgFrame: FrameNode, fgText: TextNode) => {
    const bgFills = bgFrame.fills as SolidPaint[];
    const bg = bgFills[0].color;
    const bgVariableId = bgFrame.boundVariables?.fills?.[0].id;
    const bgVariable = bgVariableId ? variableMap.get(bgVariableId) : undefined;
    const bgName = bgVariable?.name ?? "";

    const fgFills = fgText.fills as SolidPaint[];
    const fg = fgFills[0].color;
    const fgVariableId = fgText.boundVariables?.fills?.[0].id;
    const fgVariable = fgVariableId ? variableMap.get(fgVariableId) : undefined;
    const fgName = fgVariable?.name ?? "";

    const contrast = calculateApcaScore(fg, bg, colorSpace);

    const [, , , , regular, medium, , bold] = fontLookupAPCA(contrast);

    return {
      key: `${bgName} - ${fgName}`,
      bg: {
        r: bg.r,
        g: bg.g,
        b: bg.b,
        name: bgName,
      },
      fg: {
        r: fg.r,
        g: fg.g,
        b: fg.b,
        name: fgName,
      },
      contrast,
      fontSizes: {
        regular,
        medium,
        bold,
      },
    };
  };

  return inputFrame.children
    .map((child) => {
      if (child.type !== "FRAME") {
        return null;
      }

      const bgFrame = child as FrameNode;
      const fgText = child.children.find((x) => x.type === "TEXT");

      if (!bgFrame || !fgText) {
        return null;
      }

      return [bgFrame, fgText];
    })
    .filter((x): x is [FrameNode, TextNode] => x !== null)
    .map(([bgFrame, fgText]) => createPairData(bgFrame, fgText));
};

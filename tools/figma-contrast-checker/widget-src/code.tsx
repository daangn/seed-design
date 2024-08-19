import { APCAcontrast, displayP3toY, sRGBtoY, fontLookupAPCA } from "apca-w3";

const { widget } = figma;
const { AutoLayout, Fragment, Text, usePropertyMenu, useSyncedState, useEffect } = widget;

export const calculateApcaScore = (
  fg: RGB,
  bg: RGB,
  colorSpace: "LEGACY" | "SRGB" | "DISPLAY_P3",
): number => {
  if (colorSpace === "DISPLAY_P3") {
    const fgY = displayP3toY([fg.r, fg.g, fg.b]);
    const bgY = displayP3toY([bg.r, bg.g, bg.b]);
    const contrast = APCAcontrast(fgY, bgY);

    return Math.round(Number(contrast));
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

  return Math.round(
    Number(
      APCAcontrast(
        sRGBtoY([fgDecimal.r, fgDecimal.g, fgDecimal.b]),
        sRGBtoY([bgDecimal.r, bgDecimal.g, bgDecimal.b]),
      ),
    ),
  );
};

function Widget() {
  const [result, setResult] = useSyncedState<
    {
      bg: { r: number; g: number; b: number };
      fg: { r: number; g: number; b: number };
      contrast: number;
      fontSizes: {
        regular: number;
        medium: number;
        bold: number;
      };
    }[]
  >("result", []);

  function update() {
    const inputFrame = figma.currentPage.findChild((x) => x.name === "Input") as FrameNode | null;
    const colorSpace = figma.root.documentColorProfile;

    if (!inputFrame) {
      return <Text>Input frame not found</Text>;
    }

    const pairs = inputFrame.children
      .filter((x): x is FrameNode => x.type === "FRAME")
      .map((frame) => {
        const bgFills = frame.fills as SolidPaint[];
        const bg = bgFills[0].color;

        const text = frame.children.find((x): x is TextNode => x.type === "TEXT");
        if (!text) {
          return null;
        }

        const fgFills = text.fills as SolidPaint[];
        const fg = fgFills[0].color;

        const contrast = calculateApcaScore(fg, bg, colorSpace);

        const [, , , , regular, medium, , bold] = fontLookupAPCA(contrast);

        return {
          bg: {
            r: bg.r,
            g: bg.g,
            b: bg.b,
          },
          fg: {
            r: fg.r,
            g: fg.g,
            b: fg.b,
          },
          contrast,
          fontSizes: {
            regular,
            medium,
            bold,
          },
        };
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);

    setResult(pairs);
  }

  return (
    <AutoLayout
      onClick={update}
      fill="#FFFFFF"
      cornerRadius={4}
      direction="vertical"
      height="hug-contents"
      spacing={12}
      padding={12}
      width={720}
    >
      {result.map((pair, i) => (
        <AutoLayout key={i} verticalAlignItems="center" spacing={4} width="fill-parent">
          <AutoLayout
            width={48}
            height={48}
            verticalAlignItems="center"
            horizontalAlignItems="center"
            fill={{
              r: pair.bg.r,
              g: pair.bg.g,
              b: pair.bg.b,
              a: 1,
            }}
          >
            <Text
              fill={{
                r: pair.fg.r,
                g: pair.fg.g,
                b: pair.fg.b,
                a: 1,
              }}
            >
              Aa
            </Text>
          </AutoLayout>
          <Text>{Math.abs(pair.contrast).toFixed(2)}</Text>
          <Text>Regular: {pair.fontSizes.regular}px</Text>
          <Text>Medium: {pair.fontSizes.medium}px</Text>
          <Text>Bold: {pair.fontSizes.bold}px</Text>
        </AutoLayout>
      ))}
    </AutoLayout>
  );
}
widget.register(Widget);

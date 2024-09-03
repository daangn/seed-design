import { APCAcontrast, displayP3toY, sRGBtoY, fontLookupAPCA } from "apca-w3";

const { widget } = figma;
const {
  AutoLayout,
  Fragment,
  Text,
  Ellipse,
  Rectangle,
  usePropertyMenu,
  useSyncedState,
  useEffect,
} = widget;

const FRAME_PREFIX = "Input";

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

const rgbtoHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  return `#${Math.round(r * 255).toString(16)}${Math.round(g * 255).toString(16)}${Math.round(b * 255).toString(16)}`;
};

type Pair = {
  bg: { r: number; g: number; b: number; name: string };
  fg: { r: number; g: number; b: number; name: string };
  contrast: number;
  fontSizes: {
    regular: number;
    medium: number;
    bold: number;
  };
};

function Widget() {
  const [result, setResult] = useSyncedState<Pair[]>("result", []);
  const [inputFrames, setInputFrames] = useSyncedState<string[]>("inputFrames", []);
  const [selectedFrame, setSelectedFrame] = useSyncedState<string>("selectedFrame", "");

  usePropertyMenu(
    [{ itemType: "action", tooltip: "refresh", propertyName: "refresh" }],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "refresh") {
        loadInputFrames();
      }
    },
  );

  function loadInputFrames() {
    const inputFrames = figma.currentPage.children
      .filter((x) => x.name.startsWith(FRAME_PREFIX))
      .map((frame) => frame.name);
    console.log(inputFrames);
    inputFrames.length === 1
      ? updateResult(inputFrames[0])
      : inputFrames.length === 0
        ? setInputFrames([])
        : setInputFrames(inputFrames);
  }

  async function updateResult(frameName: string) {
    console.log("updateResult", frameName);
    setSelectedFrame(frameName);
    const inputFrame = figma.currentPage.findChild((x) => x.name === frameName) as FrameNode | null;
    const variableMap = new Map(
      (await figma.variables.getLocalVariablesAsync())
        .filter((x) => x.resolvedType === "COLOR")
        .map((x) => [x.id, x]),
    );
    // const inputFrame = figma.currentPage.findChild((x) => x.name === "Input") as FrameNode | null;
    const colorSpace = figma.root.documentColorProfile;

    if (!inputFrame) {
      return <Text>Input frame not found</Text>;
    }

    const pairs = inputFrame.children
      .filter((x): x is FrameNode => x.type === "FRAME")
      .map((frame) => {
        const bgFills = frame.fills as SolidPaint[];
        const bg = bgFills[0].color;
        const bgVariableId = frame.boundVariables?.fills?.[0].id;
        const bgVariable = bgVariableId ? variableMap.get(bgVariableId) : undefined;
        const bgName = bgVariable?.name ?? "";

        const text = frame.children.find((x): x is TextNode => x.type === "TEXT");
        if (!text) {
          return null;
        }

        const fgFills = text.fills as SolidPaint[];
        const fg = fgFills[0].color;
        const fgVariableId = text.boundVariables?.fills?.[0].id;
        const fgVariable = fgVariableId ? variableMap.get(fgVariableId) : undefined;
        const fgName = fgVariable?.name ?? "";

        const contrast = calculateApcaScore(fg, bg, colorSpace);

        const [, , , , regular, medium, , bold] = fontLookupAPCA(contrast);

        return {
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
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
    pairs.sort((a, b) => b.contrast - a.contrast);

    setResult(pairs);
  }

  const chunkResult = (pairs: Pair[]) => {
    const initial: Pair[][] = [[], [], [], [], [], []];

    return pairs.reduce((acc, current) => {
      if (current.contrast >= 90) {
        acc[0].push(current);
      } else if (current.contrast >= 75) {
        acc[1].push(current);
      } else if (current.contrast >= 60) {
        acc[2].push(current);
      } else if (current.contrast >= 45) {
        acc[3].push(current);
      } else if (current.contrast >= 30) {
        acc[4].push(current);
      } else {
        acc[5].push(current);
      }
      return acc;
    }, initial);
  };

  return (
    <AutoLayout
      fill="#FFFFFF"
      direction="vertical"
      height="hug-contents"
      spacing={16}
      padding={24}
      width="hug-contents"
      cornerRadius={16}
    >
      <Text fontSize={32} fontWeight={700} onClick={loadInputFrames}>
        APCA Contrast Check
      </Text>

      {inputFrames.length > 1 && (
        <AutoLayout spacing={8}>
          {inputFrames.map((frame, i) => (
            <AutoLayout
              key={i}
              onClick={() => updateResult(frame)}
              fill={selectedFrame === frame ? "#ECEDEF" : "#FFFFFF"}
            >
              <Text fontSize={16} fontWeight={400}>
                {frame}
              </Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      )}

      {chunkResult(result)[0].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <SectionTitle title="≥ 90" description="min for very thin text" />
          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkResult(result)[0].map((pair, i) => (
              <AutoLayout
                key={i}
                direction="vertical"
                width={280}
                spacing={32}
                padding={{ bottom: 24 }}
              >
                <ContrastScore pair={pair} />
                <AutoLayout spacing={10} direction="vertical" width="fill-parent">
                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <AutoLayout
                      fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
                      height={60}
                      width="fill-parent"
                      padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                      cornerRadius={6}
                    >
                      <Text
                        width="fill-parent"
                        fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
                        fontSize={pair.fontSizes.regular}
                        fontWeight={400}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                      </Text>
                    </AutoLayout>
                    <Text fontSize={12} fill="#4D5159">
                      {" "}
                      Regular: 최소 {pair.fontSizes.regular}px
                    </Text>
                  </AutoLayout>

                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <AutoLayout
                      fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
                      height={60}
                      width="fill-parent"
                      padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                      cornerRadius={6}
                    >
                      <Text
                        width="fill-parent"
                        fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
                        fontSize={pair.fontSizes.medium}
                        fontWeight={500}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                      </Text>
                    </AutoLayout>
                    <Text fontSize={12} fill="#4D5159">
                      {" "}
                      Medium: 최소 {pair.fontSizes.medium}px
                    </Text>
                  </AutoLayout>

                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <AutoLayout
                      fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
                      height={60}
                      width="fill-parent"
                      padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                      cornerRadius={6}
                    >
                      <Text
                        width="fill-parent"
                        fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
                        fontSize={pair.fontSizes.bold}
                        fontWeight={700}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                      </Text>
                    </AutoLayout>
                    <Text fontSize={12} fill="#4D5159">
                      {" "}
                      Bold: 최소 {pair.fontSizes.bold}px
                    </Text>
                  </AutoLayout>
                </AutoLayout>
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      )}

      {chunkResult(result)[1].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="≥ 75" description="min for readability-first text" />
          </AutoLayout>
          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkResult(result)[1].map((pair, i) => (
              <AutoLayout
                key={i}
                direction="vertical"
                width={280}
                spacing={32}
                padding={{ bottom: 24 }}
              >
                <ContrastScore pair={pair} />
                <AutoLayout spacing={10} direction="vertical" width="fill-parent">
                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <AutoLayout
                      fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
                      height={60}
                      width="fill-parent"
                      padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                      cornerRadius={6}
                    >
                      <Text
                        width="fill-parent"
                        fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
                        fontSize={pair.fontSizes.regular}
                        fontWeight={400}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                      </Text>
                    </AutoLayout>
                    <Text fontSize={12} fill="#4D5159">
                      {" "}
                      Regular: 최소 {pair.fontSizes.regular}px
                    </Text>
                  </AutoLayout>

                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <AutoLayout
                      fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
                      height={60}
                      width="fill-parent"
                      padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                      cornerRadius={6}
                    >
                      <Text
                        width="fill-parent"
                        fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
                        fontSize={pair.fontSizes.medium}
                        fontWeight={500}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                      </Text>
                    </AutoLayout>
                    <Text fontSize={12} fill="#4D5159">
                      {" "}
                      Medium: 최소 {pair.fontSizes.medium}px
                    </Text>
                  </AutoLayout>

                  <AutoLayout direction="vertical" spacing={4} width="fill-parent">
                    <AutoLayout
                      fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
                      height={60}
                      width="fill-parent"
                      padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
                      cornerRadius={6}
                    >
                      <Text
                        width="fill-parent"
                        fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
                        fontSize={pair.fontSizes.bold}
                        fontWeight={700}
                      >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut et massa mi.
                      </Text>
                    </AutoLayout>
                    <Text fontSize={12} fill="#4D5159">
                      {" "}
                      Bold: 최소 {pair.fontSizes.bold}px
                    </Text>
                  </AutoLayout>
                </AutoLayout>
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      )}

      {chunkResult(result)[2].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="≥ 60" description="min for body text" />
          </AutoLayout>

          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkResult(result)[2].map((pair, i) => (
              <AutoLayout
                key={i}
                direction="vertical"
                width={280}
                spacing={32}
                padding={{ bottom: 24 }}
              >
                <ContrastScore pair={pair} />
                <Examples pair={pair} />
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      )}

      {chunkResult(result)[3].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="≥ 45" description="min for large text / icon" />
          </AutoLayout>
          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkResult(result)[3].map((pair, i) => (
              <AutoLayout
                key={i}
                direction="vertical"
                width={280}
                spacing={32}
                padding={{ bottom: 24 }}
              >
                <ContrastScore pair={pair} />
                <Examples pair={pair} />
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      )}

      {chunkResult(result)[4].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle
              title="≥ 30"
              description="min placeholder, disabled text / understandable non-text element"
            />
          </AutoLayout>

          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkResult(result)[4].map((pair, i) => (
              <AutoLayout
                key={i}
                direction="vertical"
                width={280}
                spacing={32}
                padding={{ bottom: 24 }}
              >
                <ContrastScore pair={pair} />
                <Examples pair={pair} />
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      )}

      {chunkResult(result)[5].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="30 >" description="" />
          </AutoLayout>

          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkResult(result)[5].map((pair, i) => (
              <AutoLayout
                key={i}
                direction="vertical"
                width={280}
                spacing={32}
                padding={{ bottom: 24 }}
              >
                <ContrastScore pair={pair} />
                <Examples pair={pair} />
              </AutoLayout>
            ))}
          </AutoLayout>
        </AutoLayout>
      )}
    </AutoLayout>
  );
}

const ContrastScore = ({ pair }: { pair: Pair }) => (
  <AutoLayout spacing={12} verticalAlignItems="center" width="hug-contents">
    <AutoLayout
      minWidth={40}
      padding={4}
      height={40}
      verticalAlignItems="center"
      horizontalAlignItems="center"
      fill={{
        r: pair.bg.r,
        g: pair.bg.g,
        b: pair.bg.b,
        a: 1,
      }}
      cornerRadius={6}
    >
      <Text
        fill={{
          r: pair.fg.r,
          g: pair.fg.g,
          b: pair.fg.b,
          a: 1,
        }}
        fontSize={18}
        fontWeight={700}
      >
        {pair.contrast.toFixed()}
      </Text>
    </AutoLayout>
    <AutoLayout spacing={4} direction="vertical">
      <AutoLayout spacing={4} verticalAlignItems="center">
        <Ellipse
          fill={{
            r: pair.fg.r,
            g: pair.fg.g,
            b: pair.fg.b,
            a: 1,
          }}
          height={12}
          width={12}
        />
        <Text fontSize={14} fontWeight={400}>
          {pair.fg.name} ({rgbtoHex(pair.fg)})
        </Text>
      </AutoLayout>

      <AutoLayout spacing={4} verticalAlignItems="center">
        <Ellipse
          fill={{
            r: pair.bg.r,
            g: pair.bg.g,
            b: pair.bg.b,
            a: 1,
          }}
          height={12}
          width={12}
        />
        <Text fontSize={14} fontWeight={400}>
          {pair.bg.name}({rgbtoHex(pair.bg)})
        </Text>
      </AutoLayout>
    </AutoLayout>
  </AutoLayout>
);

const SectionTitle = ({ title, description }: { title: string; description: string }) => (
  <AutoLayout spacing={8} verticalAlignItems="baseline" width="hug-contents" padding={{ top: 24 }}>
    <Text fontSize={24} fontWeight={700}>
      {title}
    </Text>
    <Text fontSize={16} fontWeight={700}>
      {description}
    </Text>
  </AutoLayout>
);

const Examples = ({ pair }: { pair: Pair }) => (
  <AutoLayout spacing={10} direction="vertical" width="fill-parent">
    <AutoLayout direction="vertical" spacing={4} width="fill-parent">
      <AutoLayout
        fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
        height={42}
        width="fill-parent"
        padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
        verticalAlignItems="center"
        cornerRadius={6}
      >
        <Text
          width="fill-parent"
          fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
          fontSize={pair.fontSizes.regular}
          fontWeight={400}
        >
          Label
        </Text>
      </AutoLayout>
      <Text fontSize={12} fill="#4D5159">
        Regular: 최소 {pair.fontSizes.regular}px
      </Text>
    </AutoLayout>

    <AutoLayout direction="vertical" spacing={4} width="fill-parent">
      <AutoLayout
        fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
        height={42}
        width="fill-parent"
        padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
        verticalAlignItems="center"
        cornerRadius={6}
      >
        <Text
          width="fill-parent"
          fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
          fontSize={pair.fontSizes.medium}
          fontWeight={500}
        >
          Label
        </Text>
      </AutoLayout>
      <Text fontSize={12} fill="#4D5159">
        Medium: 최소 {pair.fontSizes.medium}px
      </Text>
    </AutoLayout>

    <AutoLayout direction="vertical" spacing={4} width="fill-parent">
      <AutoLayout
        fill={{ r: pair.bg.r, g: pair.bg.g, b: pair.bg.b, a: 1 }}
        height={42}
        width="fill-parent"
        padding={{ top: 8, bottom: 8, left: 12, right: 12 }}
        verticalAlignItems="center"
        cornerRadius={6}
      >
        <Text
          width="fill-parent"
          fill={{ r: pair.fg.r, g: pair.fg.g, b: pair.fg.b, a: 1 }}
          fontSize={pair.fontSizes.bold}
          fontWeight={700}
        >
          Label
        </Text>
      </AutoLayout>
      <Text fontSize={12} fill="#4D5159">
        Bold: 최소 {pair.fontSizes.bold}px
      </Text>
    </AutoLayout>
  </AutoLayout>
);

widget.register(Widget);

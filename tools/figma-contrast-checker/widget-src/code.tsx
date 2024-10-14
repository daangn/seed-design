import { type Pair, getPairs } from "./logic";

const { widget } = figma;
const { AutoLayout, Text, Ellipse, Rectangle, usePropertyMenu, useSyncedState } = widget;

const FRAME_PREFIX = "Input";

const rgbtoHex = (rgb: RGB): string => {
  const { r, g, b } = rgb;
  return `#${Math.round(r * 255).toString(16)}${Math.round(g * 255).toString(16)}${Math.round(b * 255).toString(16)}`;
};

function Widget() {
  const [result, setResult] = useSyncedState<Pair[]>("result", []);
  const [inputFrames, setInputFrames] = useSyncedState<string[]>("inputFrames", []);
  const [selectedFrame, setSelectedFrame] = useSyncedState<string>("selectedFrame", "");

  usePropertyMenu(
    [{ itemType: "action", tooltip: "refresh", propertyName: "refresh" }],
    ({ propertyName }) => {
      if (propertyName === "refresh") {
        handleRefresh();
      }
    },
  );

  function loadInputFrames() {
    const inputFrames = figma.currentPage.children
      .filter((x) => x.name.startsWith(FRAME_PREFIX))
      .map((frame) => frame.name);

    setInputFrames(inputFrames);
  }

  async function updateResult(frameName: string) {
    const inputFrame = figma.currentPage.findChild((x) => x.name === frameName) as FrameNode | null;
    const variableMap = new Map(
      (await figma.variables.getLocalVariablesAsync())
        .filter((x) => x.resolvedType === "COLOR")
        .map((x) => [x.id, x]),
    );
    const colorSpace = figma.root.documentColorProfile;

    if (!inputFrame) {
      figma.notify("Input frame not found");
      return;
    }

    const pairs = getPairs({
      inputFrame,
      variableMap,
      colorSpace,
    }).sort((a, b) => b.contrast - a.contrast);

    setResult(pairs);
  }

  function handleRefresh() {
    loadInputFrames();

    if (inputFrames.length > 0 && !selectedFrame) {
      setSelectedFrame(inputFrames[0]);
    }

    if (selectedFrame) {
      updateResult(selectedFrame);
    }
  }

  function handleSelectFrame(frameName: string) {
    setSelectedFrame(frameName);
    updateResult(frameName);
  }

  const chunkedResult = [
    result.filter((pair) => pair.contrast >= 90),
    result.filter((pair) => pair.contrast >= 75 && pair.contrast < 90),
    result.filter((pair) => pair.contrast >= 60 && pair.contrast < 75),
    result.filter((pair) => pair.contrast >= 45 && pair.contrast < 60),
    result.filter((pair) => pair.contrast >= 30 && pair.contrast < 45),
    result.filter((pair) => pair.contrast < 30),
  ];

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
      <Text fontSize={32} fontWeight={700} onClick={handleRefresh}>
        APCA Contrast Check
      </Text>

      {inputFrames.length > 1 && (
        <AutoLayout spacing={8}>
          {inputFrames.map((frame, i) => (
            <AutoLayout
              // biome-ignore lint/suspicious/noArrayIndexKey: Intentional use of index as key
              key={i}
              onClick={() => handleSelectFrame(frame)}
              fill={selectedFrame === frame ? "#ECEDEF" : "#FFFFFF"}
            >
              <Text fontSize={16} fontWeight={400}>
                {frame}
              </Text>
            </AutoLayout>
          ))}
        </AutoLayout>
      )}

      {chunkedResult[0].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <SectionTitle title="≥ 90" description="min for very thin text" />
          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkedResult[0].map((pair) => (
              <AutoLayout
                key={pair.key}
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

      {chunkedResult[1].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="≥ 75" description="min for readability-first text" />
          </AutoLayout>
          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkedResult[1].map((pair) => (
              <AutoLayout
                key={pair.key}
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

      {chunkedResult[2].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="≥ 60" description="min for body text" />
          </AutoLayout>

          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkedResult[2].map((pair) => (
              <AutoLayout
                key={pair.key}
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

      {chunkedResult[3].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="≥ 45" description="min for large text / icon" />
          </AutoLayout>
          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkedResult[3].map((pair) => (
              <AutoLayout
                key={pair.key}
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

      {chunkedResult[4].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle
              title="≥ 30"
              description="min placeholder, disabled text / understandable non-text element"
            />
          </AutoLayout>

          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkedResult[4].map((pair) => (
              <AutoLayout
                key={pair.key}
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

      {chunkedResult[5].length > 0 && (
        <AutoLayout width="hug-contents" direction="vertical" spacing={16}>
          <AutoLayout direction="vertical" width="fill-parent">
            <Rectangle height={1} width="fill-parent" fill="#ECEDEF" />
            <SectionTitle title="30 >" description="" />
          </AutoLayout>

          <AutoLayout spacing={24} wrap={true} maxWidth={1800} width="hug-contents">
            {chunkedResult[5].map((pair) => (
              <AutoLayout
                key={pair.key}
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

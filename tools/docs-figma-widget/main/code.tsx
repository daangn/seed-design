/**
 * @see https://yuanqing.github.io/create-figma-plugin/utilities/
 */
import { emit, type EventHandler } from "@create-figma-plugin/utilities";
import "@figmazing/resizable/main";

/**
 * @see https://www.figma.com/widget-docs/api/api-reference/
 */
const { widget } = figma;
const { AutoLayout, Text, Input, SVG, useSyncedState, usePropertyMenu } = widget;

export interface OpenHandler extends EventHandler {
  name: "OPEN";
  handler: ({ url }: { url: string }) => void;
}

const ShevronRight = `
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M11.5756 20.4241C11.3413 20.1898 11.3413 19.8099 11.5756 19.5756L18.5513 12.5999H3.99985C3.66848 12.5999 3.39985 12.3312 3.39985 11.9999C3.39985 11.6685 3.66848 11.3999 3.99985 11.3999H18.5513L11.5756 4.42412C11.3413 4.1898 11.3413 3.8099 11.5756 3.57559C11.8099 3.34127 12.1898 3.34127 12.4241 3.57559L20.4241 11.5756C20.6584 11.8099 20.6584 12.1898 20.4241 12.4241L12.4241 20.4241C12.1898 20.6584 11.8099 20.6584 11.5756 20.4241Z" fill="#212124"/>
  </svg>
`;

const Widget = () => {
  const [url, setUrl] = useSyncedState("url", "");
  const [open, setOpen] = useSyncedState("open", false);

  usePropertyMenu(
    [
      {
        itemType: "toggle",
        isToggled: open,
        propertyName: "open",
        tooltip: "주소 변경하기",
      },
    ],
    ({ propertyName, propertyValue }) => {
      if (propertyName === "open") {
        setOpen(!open);
      }
    },
  );

  const handleTextEditEnd = (event: TextEditEvent) => {
    setUrl(event.characters);
  };

  const openPluginWithUrl = () => {
    figma.showUI(__html__, { width: 500, height: 500 });
    emit<OpenHandler>("OPEN", { url });
  };

  return (
    <AutoLayout direction="vertical" verticalAlignItems="center">
      <AutoLayout
        direction="horizontal"
        horizontalAlignItems="center"
        verticalAlignItems="center"
        padding={8}
        onClick={() =>
          new Promise(() => {
            openPluginWithUrl();
          })
        }>
        <Text
          fontSize={20}
          textDecoration="underline"
          fontFamily="Noto Sans KR"
          fontWeight={400}
        >
          피그마에서 가이드라인 보기
        </Text>
        <SVG src={ShevronRight} />
      </AutoLayout>

      {open && (
        <AutoLayout direction="vertical">
          <Input value={url} placeholder="seed design url" onTextEditEnd={handleTextEditEnd} fontSize={14} />
        </AutoLayout>
      )}
    </AutoLayout>
  );
};

widget.register(Widget);

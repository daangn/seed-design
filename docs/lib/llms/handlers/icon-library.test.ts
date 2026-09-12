import { describe, expect, it } from "bun:test";
import { renderWithHandler } from "../render-test-utils";
import { type RawIconData, createIconLibraryHandler } from "./icon-library";

// 실제 `@karrotmarket/icon-data` 대신 쓰는 합성 아이콘. 아이콘이 추가되거나 키워드가 바뀌어도
// 이 표는 흔들리지 않고, 표에 찍힌 값이 어디서 왔는지 파일 안에서 다 보인다.
const monochrome: RawIconData[] = [
  {
    name: "icon_zebra",
    metadatas: ["얼룩말", "zebra", "service:community", "tag:animal", "얼룩말"],
    figma: { name: "🟢 icon_zebra" },
  },
  {
    name: "icon_apple_pie",
    metadatas: ["사과", "apple"],
  },
];

const multicolor: RawIconData[] = [
  {
    name: "icon_balloon",
    metadatas: ["tag:event", "service:market", "service:market"],
    figma: { name: "🔵 icon_balloon" },
  },
];

const header = "| Icon Name | React Component Name | Figma Name | Keywords | Services | Tags |";
const separator = "| --- | --- | --- | --- | --- | --- |";

const render = (mdx: string) =>
  renderWithHandler(createIconLibraryHandler(monochrome, multicolor), mdx);

describe("icon library handler", () => {
  it("writes one table per icon set, sorted by icon name", async () => {
    expect(await render("<IconLibrary />")).toBe(
      [
        "## Monochrome Icons",
        "",
        header,
        separator,
        "| icon_apple_pie | IconApplePie |  | 사과, apple |  |  |",
        "| icon_zebra | IconZebra | 🟢 icon_zebra | 얼룩말, zebra | community | animal |",
        "",
        "## Multicolor Icons",
        "",
        header,
        separator,
        "| icon_balloon | IconBalloon | 🔵 icon_balloon |  | market | event |",
      ].join("\n"),
    );
  });

  it("keeps surrounding prose around the tables", async () => {
    const actual = await render("앞 문단\n\n<IconLibrary />\n\n뒤 문단");

    expect(actual.startsWith("앞 문단\n\n## Monochrome Icons")).toBe(true);
    expect(actual.endsWith("뒤 문단")).toBe(true);
  });

  it("keeps the tag when both sets are empty", async () => {
    const empty = createIconLibraryHandler([], []);

    expect(await renderWithHandler(empty, "<IconLibrary />")).toBe("<IconLibrary />");
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<SomethingElse />")).toBe("<SomethingElse />");
  });
});

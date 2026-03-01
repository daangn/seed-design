import { describe, expect, it } from "bun:test";
import { extractIconToolPayload, toIconComponentName } from "./tool-icon-result";

describe("tool-icon-result", () => {
  it("converts snake-case icon name to component name", () => {
    expect(toIconComponentName("icon_arrow_left_line")).toBe("IconArrowLeftLine");
    expect(toIconComponentName("icon_shoppingbag_items")).toBe("IconShoppingbagItems");
  });

  it("parses list_icons structured content", () => {
    const payload = extractIconToolPayload("list_icons", {
      structuredContent: {
        totalCount: 120,
        returnedCount: 2,
        icons: [
          {
            name: "icon_arrow_left_line",
            type: "monochrome",
            variant: "line",
          },
          {
            name: "icon_shoppingbag_items",
            type: "multicolor",
            service: "중고거래",
          },
        ],
      },
    });

    expect(payload?.toolName).toBe("list_icons");
    expect(payload?.icons).toHaveLength(2);
    expect(payload?.icons[0]?.type).toBe("monochrome");
    expect(payload?.icons[1]?.type).toBe("multicolor");
    expect(payload?.totalCount).toBe(120);
  });

  it("parses search_icons JSON text fallback", () => {
    const payload = extractIconToolPayload("search_icons", {
      content: [
        {
          type: "text",
          text: JSON.stringify({
            query: "arrow",
            searchUrl: "https://seed-design.io/docs/foundation/iconography/library?search=arrow",
            results: [
              {
                name: "icon_arrow_left_line",
                type: "monochrome",
                variant: "line",
                matchedKeywords: ["arrow"],
                allKeywords: ["arrow", "left"],
              },
            ],
          }),
        },
      ],
    });

    expect(payload?.toolName).toBe("search_icons");
    expect(payload?.query).toBe("arrow");
    expect(payload?.icons).toHaveLength(1);
    expect(payload?.icons[0]?.name).toBe("icon_arrow_left_line");
  });

  it("parses read_icon not-found payload with suggestions", () => {
    const payload = extractIconToolPayload("read_icon", {
      structuredContent: {
        icon: null,
        suggestions: ["icon_arrow_left_line", "icon_arrow_right_line"],
        error: "Icon 'icon_arrow' not found.",
      },
    });

    expect(payload?.toolName).toBe("read_icon");
    expect(payload?.icons).toHaveLength(0);
    expect(payload?.suggestions).toContain("icon_arrow_left_line");
    expect(payload?.error).toContain("not found");
  });
});

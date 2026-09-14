import { describe, expect, it } from "bun:test";
import { buildDocsIndex } from "./build";
import { addressesOf, createDocsSearch } from "./search";

/**
 * Indexed through the same builder the documentation site publishes with, so what these
 * assert is the round trip a reader actually makes rather than a fixture that agrees with
 * itself: built under the site's rules, queried under the CLI's.
 *
 * The split between those two rules rests on zbsearch naming the property it is indexing and
 * naming nothing when it splits a query, which is its behaviour rather than its contract.
 * Should a release change that, the glued spelling below is what stops answering.
 */
const indexOf = (pages: { url: string; title: string; chunks: string[] }[]) =>
  buildDocsIndex(
    pages.map(({ url, title, chunks }) => ({
      id: url,
      url,
      title,
      structuredData: { headings: [], contents: chunks.map((content) => ({ content })) },
    })),
  );

const CORPUS = [
  {
    url: "/components/action-button",
    title: "Action Button",
    chunks: [
      "명확한 액션을 수행하도록 돕는 컴포넌트입니다.",
      "ActionButton 은 variant 를 받습니다.",
    ],
  },
  {
    url: "/components/bottom-sheet",
    title: "Bottom Sheet",
    chunks: ["화면 아래에서 올라오는 표면입니다."],
  },
  {
    url: "/react/updates/changelog",
    title: "Changelog",
    chunks: [
      "ActionButton 의 loading prop 을 추가했습니다.",
      "Bottom Sheet 의 snap point 를 고쳤습니다.",
    ],
  },
];

const search = async (query: string) =>
  addressesOf(
    await createDocsSearch(await indexOf(CORPUS)).search(query, {
      limit: 200,
      maxResultsPerPage: 1,
    }),
  ).map((address) => address.split("#")[0]);

describe("createDocsSearch", () => {
  it("reaches a page written as two words from every spelling of its name", async () => {
    for (const query of ["Action Button", "ActionButton", "action-button", "action_button"]) {
      expect((await search(query))[0]).toBe("/components/action-button");
    }
  });

  it("reaches it from the glued spelling too, which only the indexed side carries", async () => {
    expect(await search("actionbutton")).toContain("/components/action-button");
  });

  it("puts the page the query names above one that only mentions it", async () => {
    expect((await search("Bottom Sheet"))[0]).toBe("/components/bottom-sheet");
  });

  it("still names it when the query asks about something on that page", async () => {
    expect((await search("bottom sheet snap point"))[0]).toBe("/components/bottom-sheet");
  });

  it("still splits Korean on whitespace alone", async () => {
    expect(await search("액션 수행")).toContain("/components/action-button");
  });

  it("hands back the breadcrumbs the index stores without indexing them", async () => {
    const docs = createDocsSearch(
      await buildDocsIndex([
        {
          id: "/react/components/action-button",
          url: "/react/components/action-button",
          title: "Action Button",
          breadcrumbs: ["React", "Components"],
          structuredData: {
            headings: [],
            contents: [{ content: "ActionButton takes a variant." }],
          },
        },
      ]),
    );

    expect(
      (await docs.search("variant")).map(({ type, breadcrumbs }) => [type, breadcrumbs]),
    ).toEqual([
      ["page", ["React", "Components"]],
      ["text", ["React", "Components"]],
    ]);
  });
});

describe("whenToRead", () => {
  type Page = Parameters<typeof buildDocsIndex>[0][number];

  const layout: Page = {
    id: "/foundations/layout",
    url: "/foundations/layout",
    title: "Layout",
    description: "화면을 나누는 기준입니다.",
    structuredData: { headings: [], contents: [{ content: "화면을 컬럼 단위로 나눕니다." }] },
  };
  const WHEN_TO_READ = "그리드의 컬럼·거터·마진을 정할 때 읽는다.";

  const cli = async (pages: Page[], query: string) =>
    addressesOf(
      await createDocsSearch(await buildDocsIndex(pages)).search(query, {
        limit: 200,
        maxResultsPerPage: 1,
      }),
    );

  it("reaches a page by a word only its whenToRead holds", async () => {
    expect(await cli([{ ...layout, whenToRead: WHEN_TO_READ }], "거터")).toEqual([
      "/foundations/layout",
    ]);
  });

  it("hands the line back as its own type, for a caller that lists rows to leave out", async () => {
    const docs = createDocsSearch(await buildDocsIndex([{ ...layout, whenToRead: WHEN_TO_READ }]));

    expect(
      (await docs.search("거터")).map(({ type, content, url }) => [type, content, url]),
    ).toEqual([
      ["page", "Layout", "/foundations/layout"],
      ["when-to-read", WHEN_TO_READ, "/foundations/layout"],
    ]);
  });

  it("adds no row to a page without one", async () => {
    const docs = createDocsSearch(await buildDocsIndex([layout]));

    expect((await docs.search("컬럼")).map(({ type, content }) => [type, content])).toEqual([
      ["page", "Layout"],
      ["text", "화면을 컬럼 단위로 나눕니다."],
    ]);
  });

  it("leaves two pages that share a name in the order it found them without the line", async () => {
    const spec: Page = {
      id: "/components/segmented-control",
      url: "/components/segmented-control",
      title: "Segmented Control",
      structuredData: { headings: [], contents: [{ content: "보기를 전환하는 컨트롤입니다." }] },
    };
    const react: Page = {
      id: "/react/components/segmented-control",
      url: "/react/components/segmented-control",
      title: "Segmented Control",
      structuredData: { headings: [], contents: [{ content: "SegmentedControl 을 씁니다." }] },
    };

    expect(await cli([spec, react], "segmented control")).toEqual([spec.url, react.url]);
    // The React line repeats the name three times over; beside the title it would win the tie.
    expect(
      await cli(
        [
          { ...spec, whenToRead: "보기 전환에 Segmented Control을 쓸지 정할 때 읽는다." },
          {
            ...react,
            whenToRead:
              "React에서 SegmentedControl·SegmentedControlItem으로 SegmentedControl 값을 바꿀 때 읽는다.",
          },
        ],
        "segmented control",
      ),
    ).toEqual([spec.url, react.url]);
  });
});

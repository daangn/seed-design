import { describe, expect, it } from "bun:test";
import { create, insertMultiple, save } from "zbsearch";
import { addressesOf, createDocsSearch } from "./search";
import { koreanTokenizer } from "./tokenizer";

/**
 * Built the way the documentation site builds it — one `page` row carrying the title, then a
 * row per chunk — so what these assert is the round trip a reader actually makes: indexed
 * under the site's rules, queried under the CLI's.
 *
 * The split between those two rules rests on zbsearch naming the property it is indexing and
 * naming nothing when it splits a query, which is its behaviour rather than its contract.
 * Should a release change that, the glued spelling below is what stops answering.
 */
async function indexOf(pages: { url: string; title: string; chunks: string[] }[]) {
  const db = create({
    schema: {
      content: "string",
      page_id: "string",
      type: "string",
      url: "string",
      breadcrumbs: "string[]",
      tags: "enum[]",
    },
    components: { tokenizer: koreanTokenizer },
  });

  await insertMultiple(
    db,
    pages.flatMap(({ url, title, chunks }) => [
      { id: url, page_id: url, type: "page", content: title, url, breadcrumbs: [], tags: [] },
      ...chunks.map((content, index) => ({
        id: `${url}-${index}`,
        page_id: url,
        type: "text",
        content,
        url,
        breadcrumbs: [],
        tags: [],
      })),
    ]),
  );

  return save(db);
}

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

  it("leaves a name that is one word of a longer question where the engine put it", async () => {
    // "Changelog" is a whole title inside this query, but one word out of five: promoting it
    // would put it over the page the rest of the query is actually about.
    expect((await search("액션을 수행하도록 돕는 changelog 컴포넌트"))[0]).not.toBe(
      "/react/updates/changelog",
    );
  });

  it("still splits Korean on whitespace alone", async () => {
    expect(await search("액션 수행")).toContain("/components/action-button");
  });
});

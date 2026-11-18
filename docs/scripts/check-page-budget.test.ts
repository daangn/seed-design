import { describe, expect, test } from "bun:test";
import { checkPage, NAV_PROPS_MAX_BYTES } from "./check-page-budget";

const island = (name: string, client: string, attrs = "", inner = "") =>
  `<astro-island component-export="${name}" client="${client}" opts="{&quot;name&quot;:&quot;${name}&quot;}" ${attrs}>${inner}</astro-island>`;
/** 문서 셸이 늘 그리는 persist 두 요소(PERSISTED). `docsNav`로 DocsNav island를 바꿔 끼운다. */
const persisted = (docsNav = "") =>
  `${docsNav || island("DocsNav", "load", 'data-astro-transition-persist="docs-nav" data-astro-transition-persist-props="true"')}<div id="docs-nav-portal" data-astro-transition-persist="docs-nav-portal"></div>`;
const shell = (body: string, head = "", docsNav = "") =>
  `<!doctype html><html><head>${head}</head><body><div id="nd-notebook-layout">${body}${persisted(docsNav)}</div></body></html>`;
const rules = async (html: string) => (await checkPage(html)).violations.map((v) => v.rule).sort();

describe("check-page-budget", () => {
  test("허용된 문서 셸 페이지는 통과한다", async () => {
    const html = shell(
      island("ExamplePreview", "visible"),
      '<script type="module" src="/_astro/page.AbC123.js"></script><script type="module" src="/_astro/DocsShell.astro_astro_type_script_index_0_lang.x-Y1.js"></script><script type="module" src="/_astro/ClientRouter.astro_astro_type_script_index_0_lang.cRm.js"></script>',
    );
    expect(await rules(html)).toEqual([]);
  });

  test("O-1 허용 목록 밖 client:load island", async () => {
    expect(await rules(shell(island("ExamplePreview", "load")))).toEqual(["O-1"]);
  });

  test("O-2 PERSISTED 밖 persist 요소, 빠진 persist 요소, 문서 셸 밖 persist 요소", async () => {
    const extra = island("SiteHeader", "load", 'data-astro-transition-persist="header"');
    expect(await rules(shell(extra))).toEqual(["O-2"]);
    expect(
      await rules(
        shell("", "", island("DocsNav", "load", 'data-astro-transition-persist="docs-nav"')),
      ),
    ).toEqual(["O-2"]);
    expect(await rules(`<html><body>${extra}</body></html>`)).toEqual(["O-2"]);
  });

  test("O-3 persist island 안의 slot", async () => {
    const html = shell(
      "",
      "",
      island(
        "DocsNav",
        "load",
        'data-astro-transition-persist="docs-nav" data-astro-transition-persist-props="true"',
        "<astro-slot>본문</astro-slot>",
      ),
    );
    expect(await rules(html)).toEqual(["O-3"]);
  });

  test("O-4 DocsNav props·#docs-nav-data 크기", async () => {
    const big = "x".repeat(NAV_PROPS_MAX_BYTES + 1);
    expect(
      await rules(
        shell(
          "",
          "",
          island(
            "DocsNav",
            "load",
            `data-astro-transition-persist="docs-nav" data-astro-transition-persist-props="true" props="${big}"`,
          ),
        ),
      ),
    ).toEqual(["O-4"]);
    expect(
      await rules(shell(`<script type="application/json" id="docs-nav-data">${big}</script>`)),
    ).toEqual(["O-4"]);
  });

  test("O-5 허용 목록 밖 module script", async () => {
    expect(
      await rules(
        shell("", '<script type="module" src="/_astro/Extra.astro_astro_type_script.js"></script>'),
      ),
    ).toEqual(["O-5"]);
  });
});

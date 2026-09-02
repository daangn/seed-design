import { describe, expect, it } from "bun:test";
import index from "@seed-design/rootage-artifacts/index.json" with { type: "json" };
import { renderWithHandler } from "../render-test-utils";
import { componentSpecBlockHandler, createComponentSpecBlockHandler } from "./component-spec-block";

// 실제 rootage 아티팩트 인덱스 대신 쓰는 합성 리소스 목록. 컴포넌트가 추가되거나 이름이
// 바뀌어도 이 테스트는 흔들리지 않는다.
const handler = createComponentSpecBlockHandler([
  "/components/fixture-widget.json",
  "/collections.json",
]);

const render = (mdx: string) => renderWithHandler(handler, mdx);

describe("componentSpecBlock handler", () => {
  it("replaces the spec block with the rootage JSON url", async () => {
    const actual = await render('# Fixture Widget\n\n<ComponentSpecBlock id="fixture-widget" />');

    expect(actual).toBe(
      "# Fixture Widget\n\nComponent spec (JSON): /rootage/components/fixture-widget.json",
    );
  });

  it("ignores every prop but id", async () => {
    const actual = await render(
      '<ComponentSpecBlock\n  id="fixture-widget"\n  headingComponent="h4"\n  variants={["textStyle=screenTitle"]}\n/>',
    );

    expect(actual).toBe("Component spec (JSON): /rootage/components/fixture-widget.json");
  });

  it("keeps the tag for an id with no spec behind it", async () => {
    const actual = await render('# Unknown\n\n<ComponentSpecBlock id="does-not-exist" />');

    expect(actual).toBe('# Unknown\n\n<ComponentSpecBlock id="does-not-exist" />');
  });

  // 컴포넌트가 아닌 리소스는 `/components/`가 아니라 최상단에 있다. 접두사를 안 보고
  // 이름만 맞춰 보면 이런 항목이 컴포넌트 스펙으로 둔갑한다.
  it("does not match a resource outside the components directory", async () => {
    expect(await render('<ComponentSpecBlock id="collections" />')).toBe(
      '<ComponentSpecBlock id="collections" />',
    );
  });

  it("keeps the tag when id is missing", async () => {
    expect(await render("<ComponentSpecBlock />")).toBe("<ComponentSpecBlock />");
  });

  // The kept tag is fumadocs' own rewrite of the source, which flattens an expression
  // attribute into a string one — `id={componentId}` comes back quoted.
  it("keeps the tag when id is an expression rather than a string", async () => {
    expect(await render("<ComponentSpecBlock id={componentId} />")).toBe(
      '<ComponentSpecBlock id="componentId" />',
    );
  });

  it("leaves other JSX alone", async () => {
    expect(await render("<Callout>유지됩니다</Callout>")).toContain("<Callout>");
  });
});

// 합성 목록만 보면 기본 핸들러가 빈 인덱스를 물고 있어도 전부 통과한다. 어느 컴포넌트가
// 있는지가 아니라 인덱스가 실제로 연결됐는지만 본다.
describe("componentSpecBlockHandler", () => {
  it("ships with the rootage artifact index wired in", async () => {
    const someId = index.resources
      .map((resource) => resource.path.match(/^\/components\/(.+)\.json$/)?.[1])
      .find((id): id is string => Boolean(id));
    expect(someId).toBeDefined();

    expect(
      await renderWithHandler(componentSpecBlockHandler, `<ComponentSpecBlock id="${someId}" />`),
    ).toBe(`Component spec (JSON): /rootage/components/${someId}.json`);
  });
});

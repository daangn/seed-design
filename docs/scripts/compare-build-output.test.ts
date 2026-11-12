import { expect, it } from "bun:test";
import { normalizeHtml } from "./compare-build-output";

const lines = (html: string) => normalizeHtml(html, { side: "baseline", path: "page.html" }).lines;

it("useId 값을 처음 나온 순서의 자리표시자로 바꾸고 참조 관계는 유지한다", () => {
  const next = lines(
    `<html><body><button id="tabs:React:_R_5u_:trigger" aria-controls="_R_5u_">a</button><div id="_R_5u_"></div><input name="_R_5uH1_"><a href="#_R_9k_">b</a></body></html>`,
  );
  const astro = lines(
    `<html><body><button id="tabs:React:_r11R_1c_:trigger" aria-controls="_r11R_1c_">a</button><div id="_r11R_1c_"></div><input name="_r11R_1cH1_"><a href="#_r11R_2d_">b</a></body></html>`,
  );

  expect(next).toEqual([
    "<html>",
    "<body>",
    '<button aria-controls="«id:1»" id="tabs:React:«id:1»:trigger">',
    '"a"',
    "</button>",
    '<div id="«id:1»">',
    "</div>",
    '<input name="«id:2»">',
    '<a href="#«id:3»">',
    '"b"',
    "</a>",
    "</body>",
  ]);
  expect(astro).toEqual(next);
});

it("다른 요소를 가리키는 useId 참조는 다르게 정규화된다", () => {
  const first = `<html><body><label for="_R_1_">a</label><input id="_R_1_"><input id="_R_2_"></body></html>`;
  const second = `<html><body><label for="_R_2_">a</label><input id="_R_1_"><input id="_R_2_"></body></html>`;

  expect(lines(first)).not.toEqual(lines(second));
});

it("스트리밍 세그먼트를 경계 자리로 옮기고 프레임워크 흔적을 걷어낸다", () => {
  const next = lines(
    `<!DOCTYPE html><html lang="ko"><head><meta name="description" content="A &amp; B"/><title>T</title><link rel="stylesheet" href="/_next/static/chunks/a.css"/></head><body><main><!--$?--><template id="B:0"></template><p>loading</p><!--/$--></main><p class=" a  b " hidden="">x<!-- -->y</p><div hidden id="S:0"><section><template id="P:1"></template></section></div><div hidden id="S:1"><b>done</b></div><script>$RS("S:1","P:1")</script><script>$RC("B:0","S:0")</script></body></html>`,
  );
  const astro = lines(
    `<!doctype html><html lang="ko"><head><title>T</title><meta content="A &#38; B" name="description"></head><body>
      <main><astro-island uid="1" data-astro-cid-x><section data-astro-cid-x><b>done</b></section><!--astro:end--></astro-island></main>
      <p hidden class="a b">xy</p>
    </body></html>`,
  );

  expect(next).toEqual([
    '<html lang="ko">',
    '[head] <meta content="A & B" name="description">',
    '[head] <title> "T" </title>',
    "<body>",
    "<main>",
    "<section>",
    "<b>",
    '"done"',
    "</b>",
    "</section>",
    "</main>",
    '<p class="a b" hidden="">',
    '"xy"',
    "</p>",
    "</body>",
  ]);
  expect(astro).toEqual(next);
});

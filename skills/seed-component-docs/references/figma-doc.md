# Figma SEED-Docs 페이지 작성

Figma 파일 "SEED Docs"의 컴포넌트 페이지를 `use_figma`로 만들거나 고치는 절차다. 텍스트는 [guide-doc.md](guide-doc.md)로 확정한 가이드 MDX 본문을 그대로 옮긴다. 기준 페이지는 `❖ Pagination`과 `❖ Table Pagination`이다.

파일 키·노드 ID는 이 문서에 적지 않는다. Figma MCP에는 파일을 이름으로 찾는 도구가 없으므로 "SEED Docs" 파일 URL은 사용자·대화 맥락에서 받아 fileKey를 추출하고, 파일 안의 페이지·템플릿·기준 페이지는 아래 스크립트처럼 이름으로 찾는다.

## 작업 순서

1. `figma-use` Skill을 읽고 `create_session`을 호출한다. `figma-use`가 시각 변경에 함께 요구하는 `figma-generate-design`은 로드해 `skillNames`에 적되, 그 Skill의 화면 캡처·Code Connect 절차는 문서 페이지에 쓰지 않는다. 디자인 시스템 탐색은 아래 [라이브러리 컴포넌트](#라이브러리-컴포넌트)로 충분하다. 대상이 원본 파일이면 사용자가 지정한 페이지·브랜치만 쓴다.
2. 대상 파일에서 `Docs Components` 페이지와 `.Document / *` 템플릿을 이름으로 찾는다. 있으면 [템플릿 경로](#템플릿-경로), 없으면 [직접 만들기](#직접-만들기)로 같은 규격을 만든다.

   ```js
   const docs = figma.root.children.find(p => p.name === "Docs Components");
   if (!docs) return { templates: null };
   await figma.setCurrentPageAsync(docs);
   return { templates: docs.children.filter(n => (n.type === "COMPONENT" || n.type === "COMPONENT_SET") && n.name.startsWith(".Document / ")).map(n => ({ id: n.id, name: n.name })), referencePage: (figma.root.children.find(p => p.name === "❖ Pagination") || {}).id };
   ```
3. 페이지 → Spec 프레임 → Header → Title Section → 절 단위(Sub Title, Spec 섹션) 순서로 한 호출에 묶을 수 있는 만큼 만든다. 호출마다 만든 노드 ID를 반환하고 다음 호출에 문자열로 넘긴다.
4. Visual 프레임에 컴포넌트 인스턴스·라벨·Do/Don't·표를 채운다. 시각 자료를 채울 수 없으면 빈 Visual을 남기고 결과에 적는다.
5. [검사](#검사) 스크립트와 스크린샷으로 확인하고, 어긋난 부분만 고친다.

## 페이지 구조

- 페이지 이름은 `❖ <Component Name>`. 작업 중 페이지는 `In Progress` 구분선 아래에 두고 완성되면 `Components` 구분선 아래 알파벳 순으로 옮긴다(페이지 순서는 Figma UI에서 사용자가 옮긴다).
- 페이지 최상위에는 `Spec` 프레임 하나(폭 1500, 세로 HUG, 흰 배경, VERTICAL). 구형 페이지의 `Spec`·`Component Guide` 분리는 새 페이지에 쓰지 않는다.
- `Spec` 자식 순서: `Header` → `Title Section` → `Spec / Anatomy` → `Sub Title · Properties` → `Spec / <속성>`… → `Sub Title · Guidelines` → `Spec / <규칙>`… → `Spec / <A> vs. <B>`. MDX의 `##`가 Sub Title, `###`가 Spec 섹션에 대응한다.
- 절 단위 프레임
  - `Header`: 좌우 패딩 32, 안쪽 `HeaderWrapper` HORIZONTAL gap 8 상하 패딩 20, 텍스트 `SEED V3`·`Spec` 15 Semi Bold.
  - `Title Section`: VERTICAL gap 24, 패딩 56/32/88/32. `Title Description`(gap 4: 제목 34 Bold, 설명 17 Regular) + `Platform Status`(gap 8, 칩 React·iOS·Android. Lynx 구현 여부와 무관하게 세 칩을 유지한다). 칩의 가용 여부는 문서 사이트 컴포넌트 페이지 헤더의 플랫폼 상태와 같게 하고, 확인할 수 없으면 사용자에게 묻는다.
  - `Sub Title · <Name>`: 패딩 32 사방, 텍스트 26 Bold.
  - `Spec / <Title>`: HORIZONTAL gap 80, 패딩 0/32/56/32. 왼쪽 `Title Description`(폭 420 고정, VERTICAL gap 12, 위 패딩 8: 제목 18 Semi Bold, 본문 14 Regular 행간 160% 폭 420 높이 자동) + 오른쪽 `Visual / <Title>`(936×560, 배경 245,245,245) 또는 `Image Stack`(VERTICAL gap 16, 폭 936)에 Visual 여러 장.
- 본문 텍스트는 노드 하나다. Anatomy·State처럼 MDX에서 `- **Name:** 역할` 목록인 내용은 Figma 불릿 목록(`setRangeListOptions` UNORDERED)으로 쓰고 줄마다 `Name`만 Bold 구간으로 둔다. 단락 사이는 빈 줄 하나.
- 폰트는 전부 `Figma Only iOS Text`(Bold·Semi Bold·Medium·Regular). 텍스트 스타일·변수는 쓰지 않는다. 색은 본문 0,0,0, 라벨 보라 137,105,234, 칩 파랑 33,124,249.
- Visual 규칙: 오른쪽 Visual·Image 프레임에 stroke를 두지 않는다. 문서 대상 컴포넌트가 neutral 톤이면 그 페이지의 모든 Visual·Image 프레임 배경을 비운다(`fills = []`). 회색 컴포넌트가 회색(245) 배경에 묻히기 때문이다. Visual 안의 흰 카드(`Frame` 흰 배경 radius 8)는 화면 맥락을 보여줄 때만 쓴다.
- 보조 요소
  - Anatomy 라벨: `.Document / Directional Text`(Direction ↑↓→←, Aligment Start|Center). 직접 만들 때는 보라 텍스트 13 Regular + 1px 선.
  - 속성 라벨 칩: `.Document / Prop`(Label 회색 + Prop Name 파란 칩). 상태 비교 셀마다 아래에 둔다.
  - Do/Don't: 폭 460 카드(이미지 460×536 회색 radius 8 + Callout). Do는 배경 237,250,246 글자 7,84,69, Don't는 253,240,240 / 146,23,8. 짝은 HORIZONTAL gap 16으로 936을 채운다.
  - 비교 표: `Spec / <A> vs. <B>` 섹션의 오른쪽에만 둔다. Guidelines의 Do/Don't 아래에는 표를 두지 않는다. 흰 배경, 외곽 stroke 검정 10%, radius 8. 첫 열 140 고정, 나머지 FILL. 셀 높이 60 패딩 10, stroke 검정 8%. 헤더 행과 첫 열은 Bold, 나머지 Medium, 헤더 배경 240,240,240.

## 템플릿 경로

`Docs Components` 페이지의 템플릿. 이름 끝의 "Detach 후 사용"대로 인스턴스를 만든 뒤 detach해 내용을 바꾼다. 이름 접두사로 찾는다.

| 템플릿 이름 | 용도 |
| --- | --- |
| `.Document / Header` | Header |
| `.Document / Title Section` | 제목·설명·Platform Status(Status 인스턴스 4개 중 Lynx 칩은 지운다) |
| `.Document / Sub Title Section` | `Sub Title · <Name>` |
| `.Document / Content Section` | 구형 섹션. 기존 구형 페이지를 고칠 때만 |
| `.Document / Image` | 936×536 Visual. 안의 `Element.Example`·라벨 샘플은 지운다 |
| `.Document / Do` / `.Document / Don't` | Do/Don't 카드 |
| `.Document / Table` | 비교 표(3열 × 7행 샘플) |
| `.Document / Directional Text` (set) | Anatomy 라벨 |
| `.Document / Range Text` (set) | 범위 표시 라벨 |
| `.Document / Prop` | 속성 라벨 칩 |
| `.Document / Status` (set, `Available=True\|False`) | Platform Status 칩 |

아래 스크립트는 원본 파일에 샘플 페이지를 만들어 확인했다. 섹션 프레임(`Spec / X`)은 템플릿이 없으므로 [직접 만들기](#직접-만들기)의 `section`·`sectionShell`과 같은 규격으로 만들고, 그 안의 Visual·라벨·칩·Do/Don't·표만 템플릿에서 가져온다. 공통 도우미(`text`·`bodyText`)는 [직접 만들기](#직접-만들기)와 같다.

```js
// 템플릿을 이름 접두사로 찾는다 (페이지 전환 없이 동작)
const docs = figma.root.children.find(p => p.name === "Docs Components");
const tplByName = (prefix) => docs.children.find(n => (n.type === "COMPONENT" || n.type === "COMPONENT_SET") && n.name.startsWith(prefix));
const T = { header: ".Document / Header", title: ".Document / Title Section", subTitle: ".Document / Sub Title Section", image: ".Document / Image", directional: ".Document / Directional Text", prop: ".Document / Prop", do: ".Document / Do ", dont: ".Document / Don't", table: ".Document / Table" };
const tpl = async (key) => tplByName(T[key]);
// 인스턴스 → 부모에 붙임 → detach. 반환값은 FRAME
async function detached(key, parent) { const inst = (await tpl(key)).createInstance(); parent.appendChild(inst); return inst.detachInstance(); }

// Header: 두 번째 텍스트 "Component Guide" → "Spec"
const header = await detached("header", spec); header.layoutSizingHorizontal = "FILL";
header.findAll(n => n.type === "TEXT" && n.characters === "Component Guide").forEach(t => { t.characters = "Spec"; });

// Title Section: 제목·설명 교체, Links 제거, Status 칩은 React·iOS·Android 3개만
const title = await detached("title", spec); title.layoutSizingHorizontal = "FILL";
title.findOne(n => n.type === "TEXT" && n.name === "Title").characters = "Sample Component";
title.findOne(n => n.type === "TEXT" && n.name === "Description").characters = "컴포넌트 역할 한 문장.";
const links = title.findOne(n => n.name === "Links"); if (links) links.remove();
const status = title.findOne(n => n.name === "Platform Status"); while (status.children.length > 3) status.children[status.children.length - 1].remove();
// 칩 가용 여부: status.children[i].setProperties({ Available: "False" })

// Sub Title
async function subTitle(name) { const st = await detached("subTitle", spec); st.layoutSizingHorizontal = "FILL"; st.name = "Sub Title · " + name; st.findOne(n => n.type === "TEXT").characters = name; return st; }

// Visual: .Document / Image 인스턴스를 detach하고 샘플 요소를 비운다 (936×536, 배경 245)
async function visual(parent, name) { const v = await detached("image", parent); v.name = "Visual / " + name; for (const c of [...v.children]) c.remove(); v.strokes = []; return v; }

// Anatomy 라벨: Directional Text 변형 인스턴스. direction ↑↓→←, align Center|Start
async function label(chars, direction, align) {
  const set = await tpl("directional");
  const inst = set.children.find(c => c.name === `Direction=${direction}, Aligment=${align}`).createInstance();
  inst.findOne(n => n.type === "TEXT").characters = chars; return inst;
}
// 속성 칩: 컴포넌트 속성 키(`Label#…`, `Prop Name#…`)는 정의에서 찾는다
async function propChip(labelChars, value) {
  const comp = await tpl("prop"); const inst = comp.createInstance();
  const keys = Object.keys(comp.componentPropertyDefinitions); const props = {};
  props[keys.find(k => k.startsWith("Label"))] = labelChars; props[keys.find(k => k.startsWith("Prop Name"))] = value;
  inst.setProperties(props); return inst;
}
// 실제 컴포넌트 인스턴스: search_design_system 결과의 componentSetKey / componentKey로 가져온다 (아래 「라이브러리 컴포넌트」)
const set = await figma.importComponentSetByKeyAsync("<componentSetKey>");
const sample = (set.children.find(c => c.name === "Viewport=≥480, Selected Index=Middle") || set.defaultVariant).createInstance();
anatomyVisual.appendChild(sample); sample.x = Math.round((936 - sample.width) / 2); sample.y = 248;

// Do/Don't: detach 후 "Do"/"Don’t"가 아닌 텍스트가 body
for (const [key, body] of [["do", "~합니다."], ["dont", "~하지 않습니다. 이유."]]) {
  const card = await detached(key, pair);
  card.findAll(n => n.type === "TEXT").find(t => !/^(Do|Don[’']t)$/.test(t.characters)).characters = body;
}

// 비교 표: 3열 × 7행 샘플에서 필요한 행만 남기고 텍스트 교체. 열이 더 필요하면 Column 프레임을 clone한다
const table = await detached("table", right); table.layoutSizingHorizontal = "FILL";
const columns = [["", "사용 맥락", "핵심 컨트롤"], ["Sample", "검색 결과", "Page Link"], ["Other", "데이터 테이블", "Rows Per Page"]];
table.findOne(n => n.name === "Table").children.forEach((col, i) => {
  while (col.children.length > columns[i].length) col.children[col.children.length - 1].remove();
  col.children.forEach((cell, j) => { cell.findOne(n => n.type === "TEXT").characters = columns[i][j]; });
});
```

Component set은 변형을 골라 인스턴스를 만든다: `set.children.find(c => c.name === "Available=True").createInstance()`. 템플릿은 비공개 컴포넌트라 이 경로는 원본 파일에서만 동작한다. 다른 파일에서는 [직접 만들기](#직접-만들기)를 쓴다.

## 직접 만들기

아래 스크립트는 새 파일에서 실행해 결과를 확인했다. 공통 도우미는 호출마다 다시 선언한다(호출 사이에 상태가 남지 않는다).

```js
// 공통 도우미. 모든 호출 맨 위에 둔다.
const FAMILY = "Figma Only iOS Text";
for (const s of ["Bold", "Semi Bold", "Medium", "Regular"]) await figma.loadFontAsync({ family: FAMILY, style: s });
const F = (style) => ({ family: FAMILY, style });
const solid = (r, g, b, a) => [{ type: "SOLID", color: { r: r / 255, g: g / 255, b: b / 255 }, opacity: a === undefined ? 1 : a }];
function text(chars, style, size, lhPercent, fill) {
  const t = figma.createText(); t.fontName = F(style); t.characters = chars; t.fontSize = size;
  t.lineHeight = { unit: "PERCENT", value: lhPercent }; t.fills = solid(...(fill || [0, 0, 0])); return t;
}
// 본문 420 고정 폭. parts = [{ name, body }] 이면 "Name: body" 줄마다 name만 Bold, 문자열이면 그대로
function bodyText(parts) {
  const t = figma.createText(); t.fontName = F("Regular");
  const list = typeof parts === "string" ? [{ body: parts }] : parts;
  t.characters = list.map(p => (p.name ? p.name + ": " : "") + p.body).join("\n");
  t.fontSize = 14; t.lineHeight = { unit: "PERCENT", value: 160 }; t.fills = solid(0, 0, 0);
  let offset = 0;
  for (const p of list) {
    if (p.name) t.setRangeFontName(offset, offset + p.name.length, F("Bold"));
    offset += (p.name ? p.name.length + 2 : 0) + p.body.length + 1;
  }
  if (list.some(p => p.name)) t.setRangeListOptions(0, t.characters.length, { type: "UNORDERED" }); // Name: 역할 목록은 불릿
  t.resize(420, t.height); t.textAutoResize = "HEIGHT"; return t;
}
```

### 페이지, Spec, Header, Title Section

```js
// (공통 도우미 선언 뒤)
const page = figma.createPage(); page.name = "❖ Sample Component";
await figma.setCurrentPageAsync(page);

const spec = figma.createAutoLayout("VERTICAL", { name: "Spec", itemSpacing: 0 });
spec.fills = solid(255, 255, 255); page.appendChild(spec);
spec.resize(1500, 100); spec.primaryAxisSizingMode = "AUTO"; spec.counterAxisSizingMode = "FIXED";

const header = figma.createAutoLayout("VERTICAL", { name: "Header", paddingLeft: 32, paddingRight: 32 });
spec.appendChild(header); header.layoutSizingHorizontal = "FILL";
const hw = figma.createAutoLayout("HORIZONTAL", { name: "HeaderWrapper", itemSpacing: 8, paddingTop: 20, paddingBottom: 20 });
hw.counterAxisAlignItems = "CENTER"; header.appendChild(hw); hw.layoutSizingHorizontal = "FILL";
hw.appendChild(text("SEED V3", "Semi Bold", 15, 150)); hw.appendChild(text("Spec", "Semi Bold", 15, 150));

const title = figma.createAutoLayout("VERTICAL", { name: "Title Section", itemSpacing: 24, paddingTop: 56, paddingRight: 32, paddingBottom: 88, paddingLeft: 32 });
spec.appendChild(title); title.layoutSizingHorizontal = "FILL";
const td = figma.createAutoLayout("VERTICAL", { name: "Title Description", itemSpacing: 4 });
title.appendChild(td); td.layoutSizingHorizontal = "FILL";
td.appendChild(text("Sample Component", "Bold", 34, 150));
td.appendChild(text("여러 페이지로 나뉜 콘텐츠를 탐색할 수 있도록 돕는 네비게이션 컴포넌트입니다.", "Regular", 17, 150));
const status = figma.createAutoLayout("HORIZONTAL", { name: "Platform Status", itemSpacing: 8 });
status.counterAxisAlignItems = "CENTER"; title.appendChild(status); status.layoutSizingHorizontal = "FILL";
for (const [label, available] of [["React", true], ["iOS", false], ["Android", false]]) {
  const chip = figma.createAutoLayout("HORIZONTAL", { name: "Status / " + label, itemSpacing: 4, paddingTop: 4, paddingBottom: 4, paddingLeft: 8, paddingRight: 8, cornerRadius: 6 });
  chip.counterAxisAlignItems = "CENTER"; chip.fills = available ? solid(7, 145, 113) : solid(176, 179, 186);
  const t = text(label, "Medium", 12, 0, [255, 255, 255]); t.lineHeight = { unit: "PIXELS", value: 16 };
  chip.appendChild(t); status.appendChild(chip);
}
return { pageId: page.id, specId: spec.id };
```

### Sub Title과 Spec 섹션

```js
// (공통 도우미 선언 뒤) 이전 호출의 ID를 문자열로 넣는다
const page = await figma.getNodeByIdAsync("<PAGE_ID>"); await figma.setCurrentPageAsync(page);
const spec = await figma.getNodeByIdAsync("<SPEC_ID>");

function subTitle(name) {
  const st = figma.createAutoLayout("VERTICAL", { name: "Sub Title · " + name, paddingTop: 32, paddingRight: 32, paddingBottom: 32, paddingLeft: 32 });
  st.fills = solid(255, 255, 255); spec.appendChild(st); st.layoutSizingHorizontal = "FILL";
  st.appendChild(text(name, "Bold", 26, 150)); return st;
}
// 섹션 = Title Description(420) + Visual(936). 대상 컴포넌트가 neutral 톤이면 모든 섹션에 opts.neutral을 줘 배경을 비운다
function section(title, parts, opts = {}) {
  const sec = figma.createAutoLayout("HORIZONTAL", { name: "Spec / " + title, itemSpacing: 80, paddingRight: 32, paddingBottom: 56, paddingLeft: 32 });
  spec.appendChild(sec); sec.layoutSizingHorizontal = "FILL";
  const td = figma.createAutoLayout("VERTICAL", { name: "Title Description", itemSpacing: 12, paddingTop: 8 });
  sec.appendChild(td); td.resize(420, 10); td.layoutSizingHorizontal = "FIXED"; td.layoutSizingVertical = "FILL";
  td.appendChild(text(title, "Semi Bold", 18, 150)); td.appendChild(bodyText(parts));
  const visual = figma.createFrame(); visual.name = "Visual / " + title;
  visual.resize(936, opts.height || 560); visual.fills = opts.neutral ? [] : solid(245, 245, 245); visual.strokes = [];
  sec.appendChild(visual);
  return { sec, visual };
}
// Anatomy 라벨(Directional Text 대체): 보라 텍스트 + 1px 선. direction은 선이 붙는 쪽
function label(chars, direction) {
  const vertical = direction === "↑" || direction === "↓";
  const wrap = figma.createAutoLayout(vertical ? "VERTICAL" : "HORIZONTAL", { name: "Label / " + chars, itemSpacing: 4 });
  wrap.fills = []; wrap.counterAxisAlignItems = "CENTER";
  const t = text(chars, "Regular", 13, 130, [137, 105, 234]);
  const line = figma.createRectangle(); line.fills = solid(137, 105, 234); line.resize(vertical ? 1 : 60, vertical ? 42 : 1);
  if (direction === "↑" || direction === "←") { wrap.appendChild(line); wrap.appendChild(t); } else { wrap.appendChild(t); wrap.appendChild(line); }
  return wrap;
}
// 속성 라벨 칩(.Document / Prop 대체): 회색 라벨 + 파란 칩
function propChip(labelChars, value) {
  const wrap = figma.createAutoLayout("HORIZONTAL", { name: "Prop / " + value, itemSpacing: 6 });
  wrap.fills = []; wrap.counterAxisAlignItems = "CENTER";
  wrap.appendChild(text(labelChars, "Regular", 13, 130, [85, 93, 109]));
  const chip = figma.createAutoLayout("HORIZONTAL", { name: "Prop", paddingTop: 2, paddingBottom: 2, paddingLeft: 4, paddingRight: 4, cornerRadius: 6 });
  chip.fills = solid(33, 124, 249);
  const v = text(value, "Bold", 12, 0, [255, 255, 255]); v.lineHeight = { unit: "PIXELS", value: 16 };
  chip.appendChild(v); wrap.appendChild(chip);
  return wrap;
}

const anatomy = section("Anatomy", [
  { name: "Root", body: "전체 컴포넌트를 감싸는 최상위 컨테이너입니다." },
  { name: "Label", body: "현재 값을 나타내는 텍스트입니다." },
]);
// Visual 안에는 라이브러리 컴포넌트 인스턴스를 놓는다. 여기서는 자리표시 카드
const sample = figma.createAutoLayout("HORIZONTAL", { name: "Sample", paddingTop: 10, paddingBottom: 10, paddingLeft: 16, paddingRight: 16, cornerRadius: 8 });
sample.strokes = solid(0, 0, 0); sample.strokeWeight = 1; sample.appendChild(text("Label", "Bold", 14, 150));
anatomy.visual.appendChild(sample); sample.x = 400; sample.y = 260;
const l1 = label("Root", "↑"); anatomy.visual.appendChild(l1); l1.x = 420; l1.y = 300;
const l2 = label("Label", "↓"); anatomy.visual.appendChild(l2); l2.x = 410; l2.y = 200;

subTitle("Properties");
const state = section("State", [
  { name: "Enabled", body: "기본 상태입니다." },
  { name: "Pressed", body: "누르고 있는 동안의 상태입니다." },
], { neutral: true });
return { createdNodeIds: [anatomy.sec.id, state.sec.id], anatomyVisualId: anatomy.visual.id, stateVisualId: state.visual.id };
```

### Do/Don't와 비교 표

```js
// (공통 도우미, page·spec 로드 뒤)
function subTitle(name) { /* 위와 같다 */ }
// 오른쪽을 Visual 대신 Image Stack(폭 936, 세로 HUG)으로 돌려주는 섹션 뼈대
function sectionShell(title, body) {
  const sec = figma.createAutoLayout("HORIZONTAL", { name: "Spec / " + title, itemSpacing: 80, paddingRight: 32, paddingBottom: 56, paddingLeft: 32 });
  spec.appendChild(sec); sec.layoutSizingHorizontal = "FILL";
  const td = figma.createAutoLayout("VERTICAL", { name: "Title Description", itemSpacing: 12, paddingTop: 8 });
  sec.appendChild(td); td.resize(420, 10); td.layoutSizingHorizontal = "FIXED"; td.layoutSizingVertical = "FILL";
  td.appendChild(text(title, "Semi Bold", 18, 150)); td.appendChild(bodyText(body));
  const right = figma.createAutoLayout("VERTICAL", { name: "Image Stack", itemSpacing: 16 });
  right.fills = []; sec.appendChild(right); right.resize(936, 10); right.layoutSizingHorizontal = "FIXED"; right.layoutSizingVertical = "HUG";
  return { sec, right };
}
function doDont(kind, body) {
  const isDo = kind === "Do";
  const card = figma.createAutoLayout("VERTICAL", { name: kind, itemSpacing: 8 });
  card.fills = []; card.resize(460, 10); card.primaryAxisSizingMode = "AUTO"; card.counterAxisSizingMode = "FIXED";
  const img = figma.createFrame(); img.name = "Image"; img.resize(460, 536); img.fills = solid(245, 245, 245); img.cornerRadius = 8;
  card.appendChild(img); img.layoutSizingHorizontal = "FILL";
  const callout = figma.createAutoLayout("HORIZONTAL", { name: "Callout", itemSpacing: 12, paddingTop: 14, paddingRight: 14, paddingBottom: 14, paddingLeft: 14, cornerRadius: 10 });
  callout.fills = isDo ? solid(237, 250, 246) : solid(253, 240, 240);
  card.appendChild(callout); callout.layoutSizingHorizontal = "FILL";
  const col = figma.createAutoLayout("VERTICAL", { name: "Text", itemSpacing: 2 });
  col.fills = []; callout.appendChild(col); col.layoutSizingHorizontal = "FILL";
  const color = isDo ? [7, 84, 69] : [146, 23, 8];
  const h = text(isDo ? "Do" : "Don’t", "Bold", 14, 0, color); h.lineHeight = { unit: "PIXELS", value: 19 };
  const b = text(body, "Regular", 14, 0, color); b.lineHeight = { unit: "PIXELS", value: 19 };
  col.appendChild(h); col.appendChild(b); b.layoutSizingHorizontal = "FILL"; b.textAutoResize = "HEIGHT";
  return card;
}
// columns = [{ header, cells[] }]. 첫 열은 비교 축(헤더 빈 문자열), 폭 140 고정
function table(columns) {
  const wrap = figma.createAutoLayout("VERTICAL", { name: "Table", cornerRadius: 8 });
  wrap.fills = solid(255, 255, 255); wrap.strokes = solid(0, 0, 0, 0.1); wrap.strokeWeight = 1;
  wrap.resize(936, 10); wrap.counterAxisSizingMode = "FIXED"; wrap.primaryAxisSizingMode = "AUTO"; // resize가 세로도 FIXED로 만들므로 다시 HUG
  const row = figma.createAutoLayout("HORIZONTAL", { name: "Columns" });
  wrap.appendChild(row); row.layoutSizingHorizontal = "FILL";
  columns.forEach((c, i) => {
    const col = figma.createAutoLayout("VERTICAL", { name: "Column" });
    row.appendChild(col);
    if (i === 0) { col.resize(140, col.height); col.layoutSizingHorizontal = "FIXED"; } else { col.layoutSizingHorizontal = "FILL"; }
    [c.header, ...c.cells].forEach((chars, j) => {
      const cell = figma.createAutoLayout("HORIZONTAL", { name: "Cell", paddingTop: 10, paddingRight: 10, paddingBottom: 10, paddingLeft: 10 });
      cell.counterAxisAlignItems = "CENTER"; cell.strokes = solid(0, 0, 0, 0.08); cell.strokeWeight = 1;
      if (j === 0) cell.fills = solid(240, 240, 240);
      col.appendChild(cell); cell.layoutSizingHorizontal = "FILL"; cell.resize(cell.width, 60); cell.layoutSizingVertical = "FIXED";
      cell.appendChild(text(chars, j === 0 || i === 0 ? "Bold" : "Medium", 14, 150));
    });
  });
  return wrap;
}

subTitle("Guidelines");
const g = sectionShell("Label 작성하기", "Label은 2~6자 이내의 명사형으로 짧고 명확하게 작성합니다.");
const pair = figma.createAutoLayout("HORIZONTAL", { name: "Image Stack", itemSpacing: 16 });
pair.fills = []; g.right.appendChild(pair);
pair.appendChild(doDont("Do", "Label은 명사형으로 짧고 명확하게 작성합니다."));
pair.appendChild(doDont("Don't", "문장형 Label을 사용하지 않습니다. 선택지 비교가 어려워집니다."));

const c = sectionShell("Sample vs. Other", "데이터 테이블에서는 Sample 대신 Other를 사용합니다.");
c.right.appendChild(table([
  { header: "", cells: ["사용 맥락", "핵심 컨트롤"] },
  { header: "Sample", cells: ["검색 결과, 게시판", "Page Link"] },
  { header: "Other", cells: ["데이터 테이블", "Rows Per Page"] },
]));
return { createdNodeIds: [g.sec.id, c.sec.id] };
```

함정:

- `resize()`는 두 축의 sizing을 FIXED로 되돌린다. 폭만 고정하고 세로를 내용에 맞추려면 resize 뒤에 `primaryAxisSizingMode = "AUTO"`(VERTICAL 프레임)를 다시 준다. 빠뜨리면 표·흰 카드가 높이 10으로 접힌다.
- `figma.createAutoLayout()`은 흰 배경으로 생긴다. 회색 Visual 위에 놓는 라벨·Image Stack·Callout 안쪽 컬럼은 `fills = []`로 비운다.
- `FILL`은 부모에 붙인 뒤에만 설정된다. 표처럼 중첩된 FILL은 바깥 래퍼를 `resize(936)` + `counterAxisSizingMode = "FIXED"`로 고정한 뒤 안쪽부터 FILL을 준다. 래퍼가 HUG인 채로 안쪽에 FILL을 주면 셀이 접힌다.
- 본문 텍스트는 `resize(420, h)` 뒤 `textAutoResize = "HEIGHT"` 순서다. 반대로 하면 폭이 0으로 접힌다.

## 라이브러리 컴포넌트

Visual에 놓는 실제 SEED 컴포넌트는 `search_design_system`으로 찾아 key로 가져온다. 어느 파일에서든 같은 방식이다.

1. `search_design_system`에 `{ "entity": "component", "query": "Pagination" }`처럼 컴포넌트 이름을 묻는다. 결과에서 `libraryName`이 `SEED Components`인 항목의 `componentSetKey`(variant가 있는 set) 또는 `componentKey`를 쓴다.
2. `use_figma`에서 set은 `figma.importComponentSetByKeyAsync(key)` 뒤 `set.children.find(c => c.name === "<Variant=Value, …>")` 또는 `set.defaultVariant`, 단일 컴포넌트는 `figma.importComponentByKeyAsync(key)`로 가져와 `createInstance()`한다.
3. 인스턴스는 Visual 프레임에 붙인 뒤 `x`·`y`로 가운데에 둔다. key를 문서나 스크립트에 하드코딩하지 않는다.

## 검사

```js
const FAMILY = "Figma Only iOS Text";
const page = await figma.getNodeByIdAsync("<PAGE_ID>"); await figma.setCurrentPageAsync(page);
const spec = await figma.getNodeByIdAsync("<SPEC_ID>");
const outline = spec.children.map(c => { const t = c.findOne ? c.findOne(n => n.type === "TEXT") : null; return `${c.name}${t ? " :: " + t.characters.slice(0, 40) : ""} (h=${Math.round(c.height)})`; });
const texts = spec.findAllWithCriteria({ types: ["TEXT"] });
const wrongFont = texts.filter(t => t.fontName === figma.mixed ? t.getStyledTextSegments(["fontName"]).some(s => s.fontName.family !== FAMILY) : t.fontName.family !== FAMILY).map(t => t.id + " " + t.characters.slice(0, 20));
const visuals = spec.findAll(n => n.type === "FRAME" && /^(Visual \/|Image|\.Document \/ Image)/.test(n.name));
const visualIssues = visuals.flatMap(v => { const i = []; if (Array.isArray(v.strokes) && v.strokes.length) i.push("stroke"); if (!("children" in v) || v.children.length === 0) i.push("empty"); if ("children" in v && v.children.some(c => c.x < 0 || c.y < 0 || c.x + c.width > v.width + 1 || c.y + c.height > v.height + 1)) i.push("overflow"); return i.length ? [`${v.id} ${v.name}: ${i.join(",")}`] : []; });
const collapsed = spec.findAll(n => n.type === "FRAME" && n.layoutMode !== "NONE" && n.height <= 10 && n.children.length).map(n => n.id + " " + n.name);
return { width: spec.width, height: spec.height, outline, wrongFont, visualIssues, collapsed };
```

- `width`는 1500, `outline`은 MDX 제목 순서와 같다. `wrongFont`는 비어 있다. `visualIssues`의 `stroke`는 제거하고, `empty`는 채우거나 결과에 미완성으로 적고, `overflow`는 안쪽 배치를 936×560 안으로 옮긴다. `collapsed`(높이 10 이하로 접힌 프레임)는 위 함정의 sizing을 다시 준다.
- 구성이 끝나면 `get_screenshot`(Spec 프레임, `maxDimension` 2400 안팎)으로 한 번 확인한다. 잘린 텍스트, 접힌 표, 흰 상자로 남은 보조 프레임을 찾아 고친 뒤 한 번 더 찍는다.

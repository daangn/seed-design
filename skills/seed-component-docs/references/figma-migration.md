# Figma 페이지에서 가이드 MDX 이관

기존 Figma SEED-Docs 페이지의 텍스트·이미지를 근거로 `docs/content/components/<id>.mdx`를 만들거나 갱신한다. 작성 규칙은 [guide-doc.md](guide-doc.md)를 따르고, 이 문서는 추출과 이미지 ID 대응만 다룬다.

## 입력

- Figma 노드 URL. 없고 다른 문맥에서도 찾을 수 없으면 이 값만 사용자에게 요청한다. URL의 `node-id=123-456`은 `123:456`, `/branch/<branchKey>/`가 있으면 branchKey를 fileKey로 쓴다.
- 파일명은 사용자가 준 이름, 대상 MDX 경로, 기존 컴포넌트 id에서 정한다. 모호할 때만 묻는다.
- 기존 문서의 국소 수정이면 대상 절과 필요한 Figma 노드만 읽고 전체를 다시 추출하지 않는다.

## 1. 추출

`figma-use` Skill을 읽고 `create_session` 뒤 읽기 전용 `use_figma`로 Spec 프레임을 절 단위로 구조화한다. 페이지가 다르면 `setCurrentPageAsync`로 한 번 전환한다. 읽기만 하고 원본은 바꾸지 않는다.

```js
const page = await figma.getNodeByIdAsync("<PAGE_ID>"); await figma.setCurrentPageAsync(page);
const root = await figma.getNodeByIdAsync("<SPEC_FRAME_ID>");
// Bold 구간을 **로 감싼다(Semi Bold 제목은 제외)
const md = (t) => t.getStyledTextSegments(["fontName"]).map(s => /Bold/.test(s.fontName.style) && !/Semi/.test(s.fontName.style) ? "**" + s.characters + "**" : s.characters).join("");
const IMG = /^(\.Document \/ Image|Visual \/|docs\/components\/|Image$)/;
// 자신이나 조상(섹션 아래)이 숨겨진 노드는 제외한다
const shown = (n, top) => { for (let c = n; c && c !== top; c = c.parent) if (c.visible === false) return false; return true; };
return root.children.map(sec => {
  const td = sec.findOne(n => (n.name === "Title Description" || n.name === "Description") && shown(n, sec)) || sec; // 샘플 콘텐츠 안의 "Title" 텍스트를 피한다
  const titles = td.findAll(n => n.type === "TEXT" && n.name === "Title" && shown(n, sec)).map(t => t.characters);
  const descs = td.findAll(n => n.type === "TEXT" && n.name !== "Title" && n.name !== "Figma Only" && shown(n, sec)).map(md);
  const images = sec.findAll(n => (n.type === "FRAME" || n.type === "INSTANCE") && IMG.test(n.name) && !(n.parent && IMG.test(n.parent.name)) && shown(n, sec)).map(n => ({ id: n.id, name: n.name, w: Math.round(n.width), h: Math.round(n.height) }));
  const callouts = sec.findAll(n => n.type === "TEXT" && /^(Do|Don[’']t)$/.test(n.characters) && shown(n, sec)).map(n => {
    const b = n.parent.children.find(c => c.type === "TEXT" && c !== n);
    // Do/Don't 카드(이미지 + Callout)를 조상에서 찾고, 그 안의 이미지 프레임을 이름으로 고른다
    let card = n.parent; while (card && card !== sec && !card.children.some(c => IMG.test(c.name))) card = card.parent;
    const img = card && card !== sec ? card.children.find(c => IMG.test(c.name)) : null;
    return { kind: n.characters, body: b ? md(b) : "", imageId: img ? img.id : null };
  });
  return { id: sec.id, name: sec.name, titles, descs, images, callouts };
});
```

- `Sub Title · X`는 `## X`, `Spec / X`와 구형 `Content Section`은 `### X`가 된다. 구형 페이지는 `Spec`과 `Component Guide` 프레임을 따로 읽어 순서대로 잇는다.
- 한 절의 Visual이 바깥 Image 안에 여러 장 중첩돼 있으면(`Pagination VS Table Pagination`) 바깥 노드의 `children`을 다시 조회해 MDX에 쓸 안쪽 이미지를 고른다.
- 표(`.Document / Table`)는 `Column > Cell > TEXT`를 열 순서로 읽어 Markdown 표로 옮긴다. 첫 열이 비교 축이다.
- 본문 텍스트에 `Alert`(빨간 경고문)가 보이면 Guidelines 규칙으로 옮긴다. 숨겨진(`visible === false`) 노드와 그 자손은 위 `shown`이 걸러 낸다. `imageId`가 `null`인 callout은 3단계에서 `images`의 순서로 대응한다.

## 2. MDX 작성

- Figma 본문 내용만 쓴다. 설명·표 항목을 보태거나 의미를 바꾸지 않는다. 문체·절 구조·MDX 컴포넌트는 [guide-doc.md](guide-doc.md)대로 맞춘다.
- `**bold**`는 추출한 Bold 구간을 그대로 옮기되 소제목 대용 볼드는 `- **Name:**` 목록이나 `####`로 바꾼다.
- 실제 다른 컴포넌트를 언급하면 해당 페이지로 링크한다.
- 이미지 ID는 이 단계에서 `id=""`·`figmaId=""`로 두고 다음 단계에서 채운다.

## 3. 이미지 ID 대응

1단계 결과의 `images`와 `callouts.imageId`를 문서 흐름 순서대로 placeholder에 넣는다. 절 안에 이미지가 여럿이면 본문의 순서(기본 → 좁은 화면, Do → Don't)를 따른다.

개수가 맞지 않거나 여러 대응이 가능하면 부모·순서를 더 조사한 뒤에도 남는 선택만 사용자에게 묻는다. 임의로 배정하지 않는다. 빈 `id=""`는 문서 빌드 오류다.

## 4. 범위 검토

변경한 MDX와 새·변경된 요소에만 [guide-doc.md 끝내기 전 확인](guide-doc.md#끝내기-전-확인)을 적용한다. Figma가 Web/React, iOS, Android 같은 플랫폼별 내용을 언급하면 발견 사실과 문서 반영 범위를 사용자에게 알린다.

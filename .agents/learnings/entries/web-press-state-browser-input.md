---
id: web-press-state-browser-input
description: React 웹 컴포넌트의 눌림 상태(`:active` 기반 배경·scale feedback, `[data-active]`)를 Playwright·Chrome DevTools로 눌러 둔 채 측정할 때 읽는다. 터치 에뮬레이션에서 CDP `Input.dispatchTouchEvent`나 합성 PointerEvent로 누르면 `[data-active]`는 붙지만 `:active`는 붙지 않아 ActionButton 등이 줄지 않는 것처럼 보이는 경우, 그리고 전체 행 `::after` 때문에 Playwright `tap()`이 `intercepts pointer events`로 멈추는 경우에 해당한다. 상태별 입력 수단 선택과 판정 기준을 다룬다. Lynx 기기 검증에는 적용하지 않는다.
scope: ["packages/react/**", "packages/qvism-preset/src/recipes/**", "examples/stackflow-spa/**", "docs/stories/**"]
status: active
related: ["browser-focus-order-verification"]
verified_at: "2026-11-06"
---

# 눌림 상태는 상태를 만드는 입력 수단으로 측정한다

## 교훈과 다음 행동

- `[data-active]`로 켜지는 스타일(NextList item의 root·layout 등)은 터치 에뮬레이션에서 CDP `Input.dispatchTouchEvent`의 `touchStart`를 보내고 기다린 뒤 측정한다. React `onPointerDown`이 실행되어 속성이 붙는다.
- `:active`로 켜지는 스타일(ActionButton 등 대부분의 Recipe `active`·`engaged`)은 headless Chromium의 CDP 터치나 `dispatchEvent(new PointerEvent(...))`로 재현되지 않는다 → 데스크톱 context에서 `page.mouse.down()`으로 누른 채 측정한다. 터치에서 `:active`가 실제로 켜지는지는 iOS·Android 기기 검사 Skill로 따로 확인한다.
- 터치 측정 결과에서 `:active`가 false라는 이유로 컴포넌트 회귀라고 판정하지 않는다. 같은 하네스에서 단독 ActionButton을 눌러 기준값을 먼저 얻는다.
- 행 전체를 덮는 `::after`(NextList·List content의 터치 영역)가 있으면 Playwright `tap()`·`click()`이 title이나 mark에서 `intercepts pointer events`로 재시도하다 시간 초과된다. content 영역(title·detail·mark)은 행의 label·button이 받는 것이 의도이지만, prefix·suffix 안의 `a`·`button`·`input` 등 시맨틱 컨트롤은 `::after` 위로 올라가 자기 이벤트를 받는다. `{ force: true }`나 좌표 `touchscreen.tap(x, y)`를 쓰기 전에 `document.elementFromPoint`로 그 좌표의 hit 대상이 의도한 요소인지 먼저 확인한다.

## 발생 근거와 적용 조건

- DES-1435(2026-11-06): stackflow-spa `/next-list-item-button`에서 Playwright(Chromium, `hasTouch`·`isMobile`)로 suffix ActionButton에 CDP `touchStart`를 보내고 450ms 뒤 측정하자 `matches(":active")`가 false, `scale`이 1이었다. 같은 조건에서 `/action-button`의 단독 ActionButton도 false·1이었다. 데스크톱 context의 `mouse.down()`에서는 suffix 버튼이 50ms에 0.9775, 150ms 뒤 0.9375로 줄고 행의 `data-active`는 붙지 않았다.
- 같은 터치 입력으로 NextList ButtonItem 행은 `data-active`가 붙고 layout `scale`이 0.979487이 되었다. Checkbox item의 Checkmark 좌표에서 `elementFromPoint`는 content 슬롯을 반환했고, 좌표 tap으로 정상 토글되었다.
- 피할 패턴: 합성 이벤트·CDP 터치 결과만으로 `:active` 기반 피드백이 없다고 보고하는 것.

## 변경 이력

- 2026-11-06: DES-1435 NextList 브라우저 검증에서 확인한 입력 수단별 차이와 tap 가로막힘 대응을 기록했다.
- 2026-11-09: "행 안 어디를 눌러도 같은 label·button이 받는다"는 일반화를 content 영역으로 좁혔다. `/next-list-item-button`에서 suffix ActionButton 중심의 `elementFromPoint`가 그 버튼이었고, 클릭하면 행 동작 없이 버튼 핸들러만 실행되었다.

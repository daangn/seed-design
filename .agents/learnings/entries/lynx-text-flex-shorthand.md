---
id: lynx-text-flex-shorthand
description: "Lynx 문서 예제·inline style에서 row 방향 flex 컨테이너 안의 `<text>`에 남은 폭을 채우게 하거나, native 화면에서 text가 한두 글자만 보이고 옆 요소와 겹칠 때 읽는다. `flex: 1` 축약형 대신 쓸 속성과 기기 확인 기준을 다룬다. `display: \"flex\"` 누락으로 자식이 세로로 쌓이는 문제나 SEED Recipe className이 레이아웃을 정하는 styled 컴포넌트에는 적용하지 않는다."
scope: ["docs/examples/lynx/**", "examples/lynx-spa/**"]
status: active
---

# row 안의 text가 남은 폭을 채우게 할 때 `flex: 1` 대신 `flexGrow`·`flexShrink`를 쓴다

## 교훈과 다음 행동

- row 컨테이너의 `<text>`에는 `flex: 1` 대신 `flexGrow: 1, flexShrink: 1`을 쓴다. 기준 폭을 text 내용으로 두고 남은 공간만 채운다.
- inline style로 레이아웃을 직접 짠 예제는 build·typecheck 통과로 끝내지 않고 PlayLynx screenshot으로 text가 잘리지 않았는지 확인한다.

## 발생 근거와 적용 조건

- DES-2615의 `docs/examples/lynx/callout/headless.tsx`에서 `display: "flex"`·`flexDirection: "row"` view 안의 `<text>`에 `flex: 1`을 주었다. iOS PlayLynx(iOS 26.6)에서 text가 첫 한두 글자만 보이고, 같은 row의 닫기 버튼이 text 위치에 겹쳤다.
- 같은 build 조건에서 `flexGrow: 1, flexShrink: 1`로 바꾸자 세 row의 문구가 모두 보이고 닫기 버튼이 오른쪽 끝에 놓였다. `docs:test`의 `typecheck:lynx-examples`는 두 경우 모두 통과했다.
- Web preview의 결과와 원인(`flex-basis: 0`에서의 native text 측정)은 확인하지 않았다.
- 피할 패턴: CSS 관례대로 `flex: 1`을 text에 쓰고 native 화면을 확인하지 않는 것.
- 위험: 문서 예제가 실제 기기에서 읽을 수 없는 화면으로 배포된다.

## 변경 이력

- 2026-09-29: DES-2615 Callout headless 예제의 기기 확인 결과를 기록했다.

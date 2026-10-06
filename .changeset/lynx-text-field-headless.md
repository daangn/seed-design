---
"@seed-design/lynx-react-text-field": minor
"@seed-design/lynx-react": patch
---

Lynx TextField를 SEED 스타일 없이 조합할 수 있는 `@seed-design/lynx-react-text-field`를 추가합니다. `useTextField`·`TextField.Root`는 controlled/uncontrolled 값과 `required`·`disabled`·`readOnly`·`invalid`를 관리하며, `FieldRoot` 안에서는 생략한 상태를 Field에서 읽고 focus를 Field에 알립니다. `useTextFieldInput`과 무스타일 `TextField.Input`·`TextField.Textarea`는 controlled 값의 `setValue` 재동기화(늦게 도착한 blur가 최신 값을 덮어쓰지 않음), 범위 선택 교체·composition 중 삽입 상한 해제, disabled·readOnly 입력 차단과 readOnly `<text>` 렌더링, KeyboardAvoidingScrollView 등록을 제공합니다. Context는 React와 같이 `useTextFieldContext({ strict })`로 읽고, `useTextFieldWithGraphemes`도 이 패키지로 옮겼습니다. `@seed-design/lynx-react` TextField와 `useTextFieldWithGraphemes`는 사용법과 렌더링 결과를 유지하며 이 패키지를 사용합니다.

`default-value`를 지원하지 않는 Lynx 4.0 미만 엔진(3.9.1 제외)에서 `value`·`defaultValue`로 준 초기 값이 TextField에 표시되지 않던 문제를 고칩니다. 입력이 mount되면 native 값을 읽고, 초기 값과 다를 때만 `setValue`로 채웁니다.

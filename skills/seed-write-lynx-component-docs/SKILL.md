---
name: seed-write-lynx-component-docs
description: SEED Design의 Lynx 컴포넌트 문서와 실행 예제를 작성·수정한다. docs/content/lynx, docs/examples/lynx, Lynx Engine·XElement 호환 frontmatter, LynxComponentExample, WebLynx 미리보기, QR·Explorer 실행 주소, 네이티브 전용 동작 안내를 다룰 때 사용한다. 실제 Lynx client/session 검증은 seed-verify-lynx-example로 분리한다.
---

# Lynx 컴포넌트 문서 작성

## 목표

Lynx 컴포넌트 문서와 실행 가능한 예제를 저장소 규칙에 맞게 작성한다. 웹 문서 미리보기와 실제 Lynx 앱 환경의 차이를 숨기지 않고, 문서 작업과 런타임 구현 변경의 경계를 지킨다.

## 시작하기

1. 저장소 루트와 작업 경로에 적용되는 `AGENTS.md`를 모두 읽는다.
2. 문서 페이지를 수정하면 `docs/AGENTS.md`를 읽는다.
3. 실행 예제를 수정하면 `docs/examples/lynx/AGENTS.md`를 읽는다.
4. 미리보기 빌드나 매니페스트를 수정하면 `docs/scripts/lynx-examples/AGENTS.md`를 읽는다.
5. [`seed-component-map`](../seed-component-map/SKILL.md)으로 대상의 문서, Lynx 예제, package export를 찾고 경로를 직접 읽는다.
6. 같은 컴포넌트의 React 문서와 예제를 찾아 섹션 구성, 시나리오, 사용자에게 보여줄 동작을 기준점으로 삼는다.
7. React와 Lynx 공개 API 차이를 설명해야 하면 [`seed-api-parity`](../seed-api-parity/SKILL.md)의 결과를 근거로 사용한다.
8. 기존 Lynx 문서·예제와 가까운 Lynx 컴포넌트를 비교해 플랫폼 변환 방식을 결정한다.

## 범위 판단

작업 전에 문제를 다음 셋 중 하나로 분류한다.

- **문서 문제**: 설명, 코드 노출, 콜아웃, 탭 구성처럼 문서 표현만 잘못됐다.
- **예제·미리보기 문제**: 예제 엔트리, 스타일 등록 순서, 번들 URL, 매니페스트처럼 문서 실행 환경이 잘못됐다.
- **컴포넌트·런타임 문제**: 실제 호스트 앱에서도 같은 API와 사용 패턴으로 재현된다.

문서 문제와 예제 문제는 `docs/` 안에서 해결한다. 웹 미리보기의 제약만으로 배포 컴포넌트를 바꾸지 않는다. 실제 호스트 앱에서도 재현되는 문제는 문서용 예외를 추가하지 말고 컴포넌트 작업으로 분리한다.

## 작업 흐름

1. 같은 컴포넌트의 React 문서·예제와 Lynx 공개 API를 함께 확인한다.
2. 컴포넌트 소스에서 사용하는 Lynx API·구문·CSS·엘레먼트를 조사하고, 공식 Lynx API 문서와 호환성 데이터로 Engine 최소 버전과 사용 XElement를 확정한다.
3. [작성 규칙](references/authoring.md)에 따라 호환성 frontmatter, MDX, 예제 엔트리를 작성한다.
4. WebLynx는 실제 문서 개발 서버와 `docs/out`의 `LynxComponentExample`에서만 확인한다.
5. 웹과 네이티브 결과가 다르면 [미리보기와 런타임](references/preview-runtime.md)에 따라 원인을 분류한다.
6. 실제 Lynx 동작을 주장해야 할 때만 [`seed-verify-lynx-example`](../seed-verify-lynx-example/SKILL.md)로 정확한 예제와 런타임 근거를 확인한다. 기기나 세션이 없으면 우회 구현 없이 환경 차단으로 보고한다.
7. [검증 절차](references/verification.md)를 수행하고 확인한 환경과 남은 제약을 보고한다.

## 핵심 원칙

- 예제는 실제 호스트 앱에서 권장하는 사용 패턴을 그대로 보여준다.
- `@seed-design/lynx-react`의 공개 export만 사용한다.
- 지원하지 않는 기능을 문서 예제에서 흉내 내지 않는다.
- Lynx 컴포넌트 문서를 작성하거나 수정할 때 Engine·XElement 호환성 frontmatter를 함께 확인한다. 버전은 [공식 Lynx API 문서](https://lynxjs.org/api/index.html)와 [Lynx Compatibility Data](https://github.com/lynx-family/lynx-website/tree/main/packages/lynx-compat-data)에서 확인하며 추정하지 않는다.
- 일반적인 문서 작성에서 독립 HTML, 별도 Vite 앱, 임시 React 페이지로 WebLynx 예제를 옮기지 않는다.
- 독립 재현 환경은 사용자가 문서 런타임 진단을 요청했거나 프로덕션 문서에서도 재현되는 경우에만 고려한다. 시작 전에 작업 범위가 넓어짐을 알린다.
- 웹 미리보기에서 표현할 수 없는 네이티브 동작은 짧은 콜아웃으로 안내한다.
- QR 코드에는 직접 접근 가능한 `.lynx.bundle` HTTP(S) 주소를 넣는다. `lynx://` 딥 링크는 Explorer 실행 버튼에만 사용한다.
- 상태 출력에서 `false`, `null`, `0`처럼 JSX가 그대로 표시하지 않을 수 있는 값은 `JSON.stringify`로 직렬화한다.
- 공유 스타일은 컴포넌트보다 먼저 등록한다. 컴포넌트가 소유한 recipe CSS를 예제에서 다시 가져오지 않는다.
- 문서와 예제 작성 규칙은 이 스킬에 남긴다. client/session 선택과 런타임 근거 수집 절차는 `seed-verify-lynx-example`에서만 관리한다.

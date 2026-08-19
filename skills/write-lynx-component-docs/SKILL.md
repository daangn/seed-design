---
name: write-lynx-component-docs
description: SEED Design의 Lynx 컴포넌트 문서와 실행 예제를 작성·수정·디버깅한다. docs/content/lynx, docs/examples/lynx, LynxComponentExample, WebLynx 미리보기, QR·Explorer 실행 주소, 네이티브 전용 동작 안내를 다룰 때 사용한다. 문서 미리보기와 Lynx Explorer·PlayLynx 결과가 다르거나 예제 변경이 실제 배포 컴포넌트에 영향을 주는지 판단해야 할 때도 사용한다.
---

# Lynx 컴포넌트 문서 작성

## 목표

Lynx 컴포넌트 문서와 실행 가능한 예제를 저장소 규칙에 맞게 작성한다. 웹 문서 미리보기와 실제 Lynx 앱 환경의 차이를 숨기지 않고, 문서 작업과 런타임 구현 변경의 경계를 지킨다.

## 시작하기

1. 저장소 루트와 작업 경로에 적용되는 `AGENTS.md`를 모두 읽는다.
2. 문서 페이지를 수정하면 `docs/AGENTS.md`를 읽는다.
3. 실행 예제를 수정하면 `docs/examples/lynx/AGENTS.md`를 읽는다.
4. 미리보기 빌드나 매니페스트를 수정하면 `docs/scripts/lynx-examples/AGENTS.md`를 읽는다.
5. 같은 컴포넌트와 가까운 컴포넌트의 기존 문서·예제를 먼저 비교한다.

## 범위 판단

작업 전에 문제를 다음 셋 중 하나로 분류한다.

- **문서 문제**: 설명, 코드 노출, 콜아웃, 탭 구성처럼 문서 표현만 잘못됐다.
- **예제·미리보기 문제**: 예제 엔트리, 스타일 등록 순서, 번들 URL, 매니페스트처럼 문서 실행 환경이 잘못됐다.
- **컴포넌트·런타임 문제**: 실제 호스트 앱에서도 같은 API와 사용 패턴으로 재현된다.

문서 문제와 예제 문제는 `docs/` 안에서 해결한다. 웹 미리보기의 제약만으로 배포 컴포넌트를 바꾸지 않는다. 실제 호스트 앱에서도 재현되는 문제는 문서용 예외를 추가하지 말고 컴포넌트 작업으로 분리한다.

## 작업 흐름

1. 대상 문서의 현재 구조와 공개 API를 확인한다.
2. [작성 규칙](references/authoring.md)에 따라 MDX와 예제 엔트리를 작성한다.
3. 웹과 네이티브 결과가 다르면 [미리보기와 런타임](references/preview-runtime.md)에 따라 원인을 분류한다.
4. 네이티브 전용 동작은 실제 Lynx Explorer 또는 PlayLynx에서 확인한다.
5. [검증 절차](references/verification.md)를 수행하고 확인한 환경과 남은 제약을 보고한다.

## 핵심 원칙

- 예제는 실제 호스트 앱에서 권장하는 사용 패턴을 그대로 보여준다.
- `@seed-design/lynx-react`의 공개 export만 사용한다.
- 지원하지 않는 기능을 문서 예제에서 흉내 내지 않는다.
- 웹 미리보기에서 표현할 수 없는 네이티브 동작은 짧은 콜아웃으로 안내한다.
- QR 코드에는 직접 접근 가능한 `.lynx.bundle` HTTP(S) 주소를 넣는다. `lynx://` 딥 링크는 Explorer 실행 버튼에만 사용한다.
- 상태 출력에서 `false`, `null`, `0`처럼 JSX가 그대로 표시하지 않을 수 있는 값은 `JSON.stringify`로 직렬화한다.
- 공유 스타일은 컴포넌트보다 먼저 등록한다. 컴포넌트가 소유한 recipe CSS를 예제에서 다시 가져오지 않는다.
- 새로 확인한 반복 가능한 규칙은 이 스킬의 해당 reference에 반영한다.

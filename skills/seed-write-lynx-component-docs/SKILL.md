---
name: seed-write-lynx-component-docs
description: SEED의 Lynx 컴포넌트 문서와 실행 예제를 작성하거나 수정할 때 React 문서와 시나리오를 맞추고, Registry 또는 package 배포 경로에 맞는 import, Lynx Engine·XElement 호환성, 브라우저 미리보기와 실제 Lynx 확인 범위를 정한다.
---

# Lynx 컴포넌트 문서 작성

Lynx 문서와 예제는 같은 컴포넌트의 React 문서를 기준으로 작성한다. 지원되는 기능은 섹션 순서, 예제 제목, 시나리오, 사용자가 보는 결과를 가능한 한 같게 유지한다. Lynx 런타임 때문에 달라지는 부분만 바꾸고 이유를 적는다.

## 시작하기

1. 저장소 루트부터 수정 경로까지 적용되는 `AGENTS.md`를 읽는다.
2. 문서는 `docs/AGENTS.md`, 예제는 `docs/examples/lynx/AGENTS.md`, 미리보기 빌드나 매니페스트는 `docs/scripts/lynx-examples/AGENTS.md`를 추가로 읽는다.
3. [`seed-component-map`](../seed-component-map/SKILL.md)으로 대상의 package export, Registry, React·Lynx 문서, 예제를 찾고 결과 경로를 직접 읽는다.
4. React와 Lynx 공개 API 차이가 문서 구성에 영향을 주면 [`seed-api-parity`](../seed-api-parity/SKILL.md)를 사용한다. 플랫폼 제약으로 의도한 차이와 보완할 누락을 구분한다.

## 배포 경로를 먼저 정하기

`seed-component-map`의 Registry와 package export 결과로 문서와 예제의 소비 경로를 확정한다.

| 배포 방식 | Installation·Usage·실행 예제 |
| --- | --- |
| Registry 배포 | Registry 설치 방법과 설치된 경로를 사용한다. `docs/examples/lynx`와 vendored 앱 예제도 같은 Registry wrapper를 사용한다. |
| package-only | `@seed-design/lynx-react`의 실제 공개 export를 직접 사용한다. 존재하지 않는 Registry 설치 단계를 만들지 않는다. |
| package + Registry | 기본 사용법과 실행 예제는 Registry 경로를 사용한다. 저수준 package API는 사용자가 직접 조합해야 하는 내용을 설명할 때만 별도 예시로 둔다. |

Registry 파일이 있다는 사실만으로 배포 방식을 추정하지 않는다. Registry 등록 정보, 현재 문서의 설치 방법, 예제 소비 경로를 함께 확인한다.

## React 문서와 맞추기

작업 전에 다음 대응표를 만든다. 결과에 포함할 수 있는 짧은 메모면 충분하다.

| React 섹션·시나리오 | Lynx 처리 | 근거 |
| --- | --- | --- |
| 같은 기능 지원 | 제목, 순서, 사용자 결과를 유지 | 대응 공개 API·예제 경로 |
| Lynx식 변환 필요 | 사용자 결과를 유지하고 이벤트·element·접근성 속성만 변환 | 플랫폼 차이 근거 |
| 지원하지 않음 | 실행 예제를 만들지 않고 차이와 대안을 설명 | 런타임 또는 공개 API 근거 |

React 문서에서 지원하는 시나리오를 이유 없이 빼거나 이름을 바꾸지 않는다. Lynx에만 필요한 설치, 실행, 호환성 안내는 공통 섹션 흐름을 깨지 않는 위치에 추가한다. React 대응 문서가 없으면 가장 가까운 Lynx 문서 구조와 대상 컴포넌트의 실제 공개 API를 기준으로 삼는다.

## 작업 흐름

1. React 문서의 섹션, 예제 제목, 시나리오 파일과 사용자 결과를 수집한다.
2. 각 시나리오를 동일 지원, Lynx식 변환, 미지원으로 분류한다.
3. 컴포넌트가 쓰는 Lynx API·CSS·element를 조사한다. `find-refer`로 로컬 공식 자료 스냅샷을 먼저 찾고, API와 Engine 호환성은 `lynx-api-docs`, CSS 지원은 `lynx-check-css-support`로 확인한다.
4. [작성 규칙](references/authoring.md)에 따라 frontmatter, MDX, 예제 엔트리를 작성한다.
5. 실제 문서 개발 서버나 `docs/out`의 `LynxComponentExample`에서 브라우저 미리보기를 확인한다.
6. 브라우저와 실제 Lynx 결과가 다르면 [미리보기와 런타임](references/preview-runtime.md)에 따라 문서 문제, 미리보기 문제, 컴포넌트·런타임 문제로 나눈다.
7. 네이티브 결과를 새로 주장하거나 예제 동작을 바꿨다면 사용 가능한 Lynx 호스트 앱이나 `examples/lynx-spa`에서 직접 확인한다. 환경이 없으면 확인하지 못한 범위를 보고하고 우회 구현을 추가하지 않는다.
8. [검증 절차](references/verification.md)를 수행하고 확인한 환경과 남은 제한을 보고한다.

## 작업 경계

- 설명이나 코드 노출만 잘못된 경우 `docs/` 안에서 고친다.
- 예제 엔트리, 스타일 등록 순서, bundle URL, 매니페스트 문제는 문서 실행 환경에서 고친다.
- 실제 호스트 앱에서도 재현되는 API나 동작 문제는 컴포넌트 작업으로 분리한다.
- 브라우저 미리보기의 한계만으로 배포 컴포넌트를 바꾸지 않는다.
- 지원하지 않는 기능을 문서 예제에서 작동하는 것처럼 흉내 내지 않는다.

## 작성 원칙

- 실행 예제는 실제 호스트 앱에서 권장하는 소비 경로와 사용 패턴을 보여준다.
- Registry 배포 컴포넌트는 Registry를 사용한다. package-only 컴포넌트만 `@seed-design/lynx-react`에서 직접 import한다.
- 같은 기능을 지원하면 React 문서의 섹션 순서, 예제 제목, 시나리오, 문구와 사용자 결과를 가능한 한 유지한다.
- Engine·XElement 호환성은 `find-refer`와 `lynx-api-docs`로 공식 자료를 확인한다. CSS 속성·값은 `lynx-check-css-support`를 함께 사용한다. Context7이나 일반 웹 검색으로 우회하지 않으며 버전을 추정하지 않는다.
- 일반적인 문서 작업에서 독립 HTML, 별도 Vite 앱, 임시 React 페이지를 만들지 않는다.
- 브라우저 미리보기에서 표현할 수 없는 네이티브 동작은 관련 예제 가까이에 짧게 안내한다.
- QR 코드에는 직접 접근 가능한 `.lynx.bundle` HTTP(S) 주소를 넣는다. `lynx://` 딥 링크는 Explorer 실행 버튼에만 사용한다.
- `false`, `null`, `0`처럼 JSX가 그대로 표시하지 않을 수 있는 값은 `JSON.stringify`로 직렬화한다.
- 공유 스타일은 컴포넌트보다 먼저 등록한다. 컴포넌트가 소유한 Recipe CSS를 예제에서 다시 가져오지 않는다.

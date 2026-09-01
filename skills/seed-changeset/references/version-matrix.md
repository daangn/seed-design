# SEED 버전 전파 매트릭스

패키지 버전은 공개 출력의 변화로 정한다. 먼저 변경한 패키지의 bump를 분류하고, 그 변화가 역의존 패키지의 공개 표면까지 전달되는지 따로 확인한다.

## 기본 규칙

모든 공개 패키지에 표준 SemVer를 적용한다. 현재 버전이 `0.x`인 Lynx 패키지도 예외가 아니다.

| 공개 영향 | bump | 판단 기준 |
| --- | --- | --- |
| 기존 소비 코드, 타입 검사, 렌더 결과 또는 접근성 동작이 깨진다 | `major` | 사용자가 마이그레이션해야 한다 |
| 기존 동작을 유지하면서 새 API나 기능을 추가한다 | `minor` | 기존 사용자는 바꿀 필요가 없다 |
| 의도와 달랐던 동작을 고치거나 호환되는 내부 변경을 배포한다 | `patch` | 기존 계약을 복구하거나 유지한다 |
| 문서, 테스트, 스킬처럼 npm 공개 패키지에 영향이 없다 | changeset 없음 | 릴리스할 공개 패키지가 없다 |

새 CSS 산출물 없이 스타일만 바꾼다면 단순 버그 수정과 미세 조정은 `patch`, 의도된 시각 변경은 `minor`다. 이때 React나 Headless의 로직과 공개 API가 그대로라면 해당 패키지는 bump하지 않는다. React 로직이나 공개 출력까지 바뀌었다면 스타일 전용 변경이 아니므로 해당 행을 따로 적용한다.

버전 숫자나 플랫폼으로 규칙을 바꾸지 않는다. Lynx 패키지의 breaking change를 `minor`로 낮춰 잡지 않는다.

새 공개 패키지는 플랫폼과 관계없이 `1.0.0`에서 시작한다. 기존 패키지에 하위 호환 컴포넌트나 API를 추가하는 경우에는 해당 패키지를 `minor`로 올린다.

## 공개 표면 분류

| 변경 | bump | 조건 |
| --- | --- | --- |
| prop, 타입, export 경로, 슬롯, variant 이름 또는 값을 제거·변경 | `major` | 기존 사용 코드가 깨진다 |
| 새 prop, 슬롯, variant 값, export 또는 컴포넌트 추가 | `minor` | 기존 동작을 보존한다 |
| `defaultVariants` 또는 기본 렌더 결과 변경 | `major` | 소비자가 코드를 바꾸지 않아도 결과가 달라진다 |
| 타입 유니온 축소, 필수 prop 추가 | `major` | 런타임이 같아도 타입 검사가 깨진다 |
| deprecation 안내만 추가 | `minor` | 기존 API는 계속 동작한다 |
| 잘못된 스타일, 상호작용, 접근성 속성 수정 | `patch` | 기존 계약을 복구한다 |
| 외부 peer 요구 버전 상향 | `major` | 이전에 동작하던 설치 조합이 제외된다 |
| 의존성 변경을 내부에서 흡수해 공개 출력이 같다 | `patch` | 패키지 배포는 필요하지만 공개 계약은 유지한다 |

DOM 또는 Lynx native element 구조와 styling 전용 `data-*`는 자동으로 공개 계약이 되지 않는다. 문서나 API에서 소비자 사용을 보장했다면 공개 표면으로 본다. 공개하지 않은 내부 배선 변경은 최종 렌더 결과와 접근성 동작으로 bump를 판단한다.

`@seed-design/css/vars/component/*`와 대응하는 Lynx 생성 값은 기본적으로 Recipe 구현용 내부 산출물이다. 직접 사용을 문서로 보장한 export는 예외다. `typography`처럼 직접 소비하도록 안내한 값도 공개 표면으로 취급한다.

## 대표 변경 매트릭스

`없음`은 해당 패키지의 공개 출력이 변하지 않았다는 뜻이다. 실제 코드가 표와 다르면 코드의 공개 출력을 우선한다.

| 변경 | CSS 계열 | React/Lynx React 계열 | Headless |
| --- | --- | --- | --- |
| 새 산출물 없는 스타일 버그 수정·미세 조정 | `patch` | 없음 | 없음 |
| 새 산출물 없는 의도된 시각 변경 | `minor` | 없음 | 없음 |
| 기존 패키지에 새 컴포넌트·하위 컴포넌트와 Recipe/vars 추가 | `minor` | 공개 컴포넌트를 추가하면 `minor` | 새 공개 API를 추가하면 `minor` |
| 기존 variant에 값 추가 | `minor` | 해당 값을 prop으로 노출하면 `minor` | 해당 값을 제공하면 `minor` |
| 컴포넌트와 무관한 새 토큰 추가 | `minor` | 그 토큰을 사용한 새 공개 기능이 없으면 없음 | 없음 |
| 하위 호환 Headless 기능 추가 | 없음 | 기능을 공개하거나 내부에서 사용하면 `minor` | `minor` |
| Headless 기능과 대응 스타일 추가 | `minor` | 기능을 공개하면 `minor` | `minor` |
| React/Lynx React 로직으로 새 스타일 상태 제공 | `minor` | `minor` | 상태를 제공하면 `minor` |
| styling용 새 상태 속성으로 기능 제공 | `minor` | 기능을 노출하면 `minor` | 속성을 출력하면 `minor` |
| 공개 토큰, CSS 변수, Recipe, 슬롯 또는 variant 이름 변경·삭제 | `major` | 해당 계약을 소비하면 `major` | 해당 계약을 노출하면 `major` |

CSS 계열의 `major`는 그 CSS를 사용하는 React 계열에도 `major`로 전파한다. `@seed-design/css`의 breaking change에는 `@seed-design/react`의 `major`가 따라온다. 같은 원칙으로 `@seed-design/lynx-css`의 breaking change에는 `@seed-design/lynx-react`의 `major`가 따라온다.

## Headless 변경 전파

Headless 패키지의 bump와 이를 감싼 React 패키지의 bump는 따로 판단한다.

| Headless 변화가 wrapper에 미치는 영향 | wrapper bump |
| --- | --- |
| wrapper가 해당 기능을 사용하지 않고 공개하지 않는다 | 없음 |
| wrapper 내부에서 차이를 흡수해 공개 API와 결과를 유지한다 | `patch` |
| wrapper가 새 하위 호환 기능을 공개한다 | `minor` |
| wrapper가 breaking API를 그대로 재노출한다 | `major` |

`export *` 같은 재노출은 내부 사용 여부와 관계없이 공개 표면을 확장한다. 따라서 재노출한 Headless breaking change는 wrapper에서도 `major`다.

## 실제 소비 패키지 판단

역의존 목록은 후보를 찾는 자료일 뿐이다. 다음 질문에 하나라도 해당할 때만 소비 패키지의 changeset을 검토한다.

- 새 토큰이나 Recipe를 그 패키지가 실제로 import하거나 생성 결과에 포함하는가?
- 새 Headless 기능을 wrapper가 prop, 타입, 상태 또는 이벤트로 노출하는가?
- 변경된 CSS 계약이 그 패키지의 렌더 결과에 반드시 필요한가?
- codegen 또는 snippet 출력이 특정 새 API를 생성하는가?

해당하지 않으면 의존 관계만으로 동반 bump하지 않는다. 해당하더라도 소비 패키지의 bump는 그 패키지의 공개 영향으로 다시 분류한다.

## peer dependency 후속 처리

현재 기능 작업과 changeset 작성 과정에서는 peer dependency 하한이나 상한을 수정하지 않는다.

계획 스크립트의 `versionChangesReviewCandidates`와 실제 소비 여부를 최종 보고에 남긴다. Version Changes PR에서 필요한 하한을 수동으로 올린다. 이때 새 기능을 실제로 소비하는 패키지만 대상으로 삼고, 상한은 바꾸지 않는다.

이 정책은 현재 PR에서 peer range를 편집하라는 지시가 아니다. changeset 파일 작성과 Version Changes PR의 버전 범위 정리를 분리한다.

## 특수 범위

- `.changeset/config.json`의 `linked` 그룹은 릴리스 시 버전을 맞춘다. 실제 변경된 패키지만 changeset에 넣고, 연결 결과는 Version Changes PR에서 확인한다.
- `updateInternalDependencies: "patch"`가 만든 자동 dependency bump를 위해 같은 내용을 수동 changeset으로 중복 작성하지 않는다.
- private 패키지와 `packages/archive/*`는 changeset 후보에서 제외한다.
- `cli`, `figma`, `mcp`, codegen 도구는 각각의 명령, 생성 코드, 공개 타입과 프로토콜을 기준으로 독립적으로 분류한다.

## Registry snippet

Registry snippet은 사용자의 저장소로 복사된 코드이므로 snippet 자체에 npm 버전은 없다. Registry 파일만 바뀌었다면 changeset을 만들지 않는다.

- snippet이 새 공개 패키지 기능을 소비한다면 그 공개 패키지의 실제 API 영향으로 bump를 정한다.
- 이미 복사된 snippet은 자동으로 갱신되지 않는다. 최신 snippet 재설치가 필요하다는 사실만으로 npm `major`를 선택하지 않는다.
- 기존 소비자를 깨는 공개 패키지 계약 변경이 있을 때만 해당 패키지를 `major`로 분류한다. 설치 안내는 changeset 메시지에 함께 적을 수 있다.

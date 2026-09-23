# SEED 버전 전파 매트릭스

패키지 버전은 공개 출력의 변화로 정한다. 변경한 패키지의 bump를 먼저 분류하고, 그 변화가 역의존 패키지의 공개 표면까지 전달되는지 따로 확인한다. 실제 코드가 아래 분류와 다르면 코드의 공개 출력을 우선한다.

## 기본 규칙

- `major`: 기존 소비 코드, 타입 검사, 렌더 결과, 접근성 동작이 깨진다. 사용자가 마이그레이션해야 한다.
- `minor`: 기존 동작을 유지하며 새 API나 기능을 추가한다. 기존 사용자는 바꿀 필요가 없다.
- `patch`: 의도와 달랐던 동작을 고치거나 호환되는 내부 변경을 배포한다. 기존 계약을 복구하거나 유지한다.
- changeset 없음: 문서, 테스트, Skill처럼 npm 공개 패키지에 영향이 없다.

새 CSS 산출물 없이 스타일만 바꾸면 버그 수정·미세 조정은 `patch`, 의도된 시각 변경은 `minor`다. React나 Headless의 로직과 공개 API가 그대로면 그 패키지는 bump하지 않는다. React 로직이나 공개 출력까지 바뀌었으면 스타일 전용 변경이 아니므로 해당 항목을 따로 적용한다.

### Lynx `0.x`

- Lynx 공개 패키지(`@seed-design/lynx-react`, `@seed-design/lynx-css`, `@seed-design/lynx-react-*`)는 안정화 전까지 `0.x`를 유지한다.
- 이 기간에는 기능 추가와 breaking change를 `minor`, 호환되는 버그 수정을 `patch`로 배포한다. 이 문서의 `major`도 `0.x`인 동안에는 `minor`로 적용한다. breaking change의 변경 내용과 마이그레이션 안내는 그대로 쓴다.
- `1.0.0` 전환은 따로 명시적으로 결정한다.

### 새 패키지·새 API

- 새 Lynx 공개 패키지는 manifest를 `0.0.0`으로 두고 첫 `minor` changeset으로 `0.1.0`에서 시작한다.
- 그 밖의 새 공개 패키지는 `1.0.0`에서 시작한다.
- 기존 패키지에 하위 호환 컴포넌트나 API를 추가하면 그 패키지를 `minor`로 올린다.

## 공개 표면 분류

- prop, 타입, export 경로, 슬롯, variant 이름·값을 제거하거나 변경 → `major`. 기존 사용 코드가 깨진다.
- 새 prop, 슬롯, variant 값, export, 컴포넌트 추가 → `minor`. 기존 동작을 보존한다.
- `defaultVariants`나 기본 렌더 결과 변경 → `major`. 소비자가 코드를 바꾸지 않아도 결과가 달라진다.
- 타입 유니온 축소, 필수 prop 추가 → `major`. 런타임이 같아도 타입 검사가 깨진다.
- deprecation 안내만 추가 → `minor`. 기존 API는 계속 동작한다.
- 잘못된 스타일, 상호작용, 접근성 속성 수정 → `patch`. 기존 계약을 복구한다.
- 외부 peer 요구 버전 상향 → `major`. 이전에 동작하던 설치 조합이 빠진다.
- 의존성 변경을 내부에서 흡수해 공개 출력이 같음 → `patch`. 배포는 필요하지만 공개 계약은 유지된다.

DOM이나 Lynx native element 구조와 styling 전용 `data-*`는 자동으로 공개 계약이 되지 않는다. 문서나 API가 소비자 사용을 보장했으면 공개 표면으로 본다. 공개하지 않은 내부 배선 변경은 최종 렌더 결과와 접근성 동작으로 bump를 정한다.

`@seed-design/css/vars/component/*`와 대응하는 Lynx 생성 값은 기본적으로 Recipe 구현용 내부 산출물이다. 문서로 직접 사용을 보장한 export와, `typography`처럼 직접 소비하라고 안내한 값은 공개 표면으로 본다.

## 대표 변경 매트릭스

각 줄은 `CSS 계열 / React·Lynx React 계열 / Headless` 순서다. `없음`은 그 패키지의 공개 출력이 변하지 않았다는 뜻이다.

- 새 산출물 없는 스타일 버그 수정·미세 조정 → `patch` / 없음 / 없음
- 새 산출물 없는 의도된 시각 변경 → `minor` / 없음 / 없음
- 기존 패키지에 새 컴포넌트·하위 컴포넌트와 Recipe·vars 추가 → `minor` / 공개 컴포넌트를 추가하면 `minor` / 새 공개 API를 추가하면 `minor`
- 기존 variant에 값 추가 → `minor` / 그 값을 prop으로 노출하면 `minor` / 그 값을 제공하면 `minor`
- 컴포넌트와 무관한 새 토큰 추가 → `minor` / 그 토큰을 쓰는 새 공개 기능이 없으면 없음 / 없음
- 하위 호환 Headless 기능 추가 → 없음 / 기능을 공개하거나 내부에서 쓰면 `minor` / `minor`
- Headless 기능과 대응 스타일 추가 → `minor` / 기능을 공개하면 `minor` / `minor`
- React·Lynx React 로직으로 새 스타일 상태 제공 → `minor` / `minor` / 상태를 제공하면 `minor`
- styling용 새 상태 속성으로 기능 제공 → `minor` / 기능을 노출하면 `minor` / 속성을 출력하면 `minor`
- 공개 토큰, CSS 변수, Recipe, 슬롯, variant 이름 변경·삭제 → `major` / 그 계약을 소비하면 `major` / 그 계약을 노출하면 `major`

CSS 계열의 `major`는 그 CSS를 쓰는 React 계열에도 `major`로 전파한다. `@seed-design/css`의 breaking change에는 `@seed-design/react`의 `major`가, `@seed-design/lynx-css`의 breaking change에는 `@seed-design/lynx-react`의 `major`가 따라온다.

## Headless 변경 전파

Headless 패키지의 bump와 그것을 감싼 wrapper 패키지의 bump는 따로 정한다.

- wrapper가 그 기능을 쓰지도 공개하지도 않음 → wrapper bump 없음
- wrapper가 내부에서 차이를 흡수해 공개 API와 결과를 유지 → `patch`
- wrapper가 새 하위 호환 기능을 공개 → `minor`
- wrapper가 breaking API를 그대로 재노출 → `major`

`export *` 같은 재노출은 내부 사용 여부와 관계없이 공개 표면을 넓힌다. 재노출한 Headless breaking change는 wrapper에서도 `major`다.

## 실제 소비 패키지 판단

역의존 목록(`reverseDependencies`)은 후보를 찾는 자료일 뿐이다. 다음 가운데 하나라도 해당할 때만 소비 패키지의 changeset을 검토한다.

- 새 토큰이나 Recipe를 그 패키지가 실제로 import하거나 생성 결과에 포함하는가?
- 새 Headless 기능을 wrapper가 prop, 타입, 상태, 이벤트로 노출하는가?
- 바뀐 CSS 계약이 그 패키지의 렌더 결과에 반드시 필요한가?
- codegen이나 snippet 출력이 특정 새 API를 생성하는가?

해당하지 않으면 의존 관계만으로 동반 bump하지 않는다. 해당하더라도 소비 패키지의 bump는 그 패키지의 공개 영향으로 다시 분류한다.

## peer dependency 후속 처리

기능 작업과 changeset 작성 중에는 peer dependency 하한·상한을 고치지 않는다 → 계획 스크립트의 `versionChangesReviewCandidates`와 실제 소비 여부를 최종 보고에 남긴다.

- 하한 조정은 Version Changes PR(`changeset-release/dev` head, 제목 `release: version packages`)에서 한다. 새 기능을 실제로 소비하는 패키지만 대상으로 하고, 상한은 바꾸지 않는다.
- `@seed-design/react`의 `@seed-design/css` peer와 `@seed-design/lynx-react`의 `@seed-design/lynx-css` peer는 그 PR에 OWNER·MEMBER·COLLABORATOR가 `/bump-peer-deps` 댓글을 남기면 `.github/workflows/bump-peer-deps.yml`이 맞춘다. `.github/workflows/version-peer-deps-merge-blocker.yml`이 두 범위를 검사한다.
- 그 밖의 peer 범위는 Version Changes PR에서 수동으로 올린다.

## 특수 범위

- `.changeset/config.json`의 `linked` 그룹은 릴리스 때 버전을 맞춘다. 실제 변경된 패키지만 changeset에 넣고, 연결 결과는 Version Changes PR에서 확인한다.
- `updateInternalDependencies: "patch"`가 만드는 자동 dependency bump를 수동 changeset으로 중복 작성하지 않는다.
- private 패키지와 `packages/archive/*`는 changeset 후보에서 뺀다.
- `cli`, `figma`, `mcp`, codegen 도구는 각자의 명령, 생성 코드, 공개 타입, 프로토콜을 기준으로 따로 분류한다.

## Registry snippet

snippet은 사용자 저장소로 복사된 코드라 npm 버전이 없다. Registry 파일만 바뀌었으면 changeset을 만들지 않는다.

- snippet이 새 공개 패키지 기능을 쓰면 그 공개 패키지의 실제 API 영향으로 bump를 정한다.
- 이미 복사된 snippet은 자동으로 갱신되지 않는다. 최신 snippet 재설치가 필요하다는 사실만으로 `major`를 고르지 않는다.
- 기존 소비자를 깨는 공개 패키지 계약 변경이 있을 때만 그 패키지를 `major`로 분류한다. 설치 안내는 changeset 메시지에 함께 쓸 수 있다([patterns.md](patterns.md)「Registry snippet」).

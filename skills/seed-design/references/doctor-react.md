# React Doctor 프로필

`references/doctor.md`가 `framework: react` 프로젝트를 진단할 때 사용하는 플랫폼 입력입니다. 이 파일을 읽은 뒤 아래 적용 룰만 실행합니다.

## 패키지

| 역할 | 패키지 |
|---|---|
| 구현 | `@seed-design/react` |
| 스타일·토큰 | `@seed-design/css` |
| 선택적 화면 전환 | `@seed-design/stackflow` |

React 패키지 조합의 호환 기준은 `@seed-design/react` 버전 라인을 기준으로 정합니다. 직접 선언한 다른 `@seed-design/*` 패키지는 `outdated-version`의 최신 버전 비교 대상에 포함하되, React 업그레이드 가이드를 그 패키지의 버전 번호로 선택하지 않습니다.

## 문서와 registry

| 지식 | 위치 |
|---|---|
| React 구현 인덱스 | `https://seed-design.io/react/llms.txt` |
| React 구현 API | 공통 컴포넌트 문서의 Platform 표에 있는 React 링크를 우선하고, 없거나 비어 있으면 React 구현 인덱스에서 찾기 |
| canonical registry | `https://seed-design.io/__registry__/react/{registryId}/index.json` |
| 개별 스니펫 | `https://seed-design.io/__registry__/react/{registryId}/{itemId}.json` |
| 설치 세대 registry | `https://v1-0.seed-design.io`, `https://v1-1.seed-design.io`, `https://v1-2.seed-design.io` |
| React 1 업그레이드·호환표 | `https://seed-design.io/llms/react/updates/upgrade/v1.txt` |
| React 2 업그레이드 | `https://seed-design.io/llms/react/updates/upgrade/v2.txt` |
| changelog | `react/updates/changelog/{packageSlug}/{version}` |

아카이브 registry는 `v1-0`, `v1-1`, `v1-2` 세 개만 존재합니다. `v2-0` 같은 주소는 아이템 부재가 아니라 도메인 조회 실패이므로 "registry에 없음"의 근거로 사용하지 않습니다. 설치본이 2.x 이상이면 패키지 export와 현재 registry만으로 판정하고 그 한계를 근거에 밝힙니다.

registry 인덱스와 개별 아이템의 URL 형태가 다릅니다. 개별 아이템은 `{itemId}/index.json`이 아니라 `{itemId}.json`입니다.

## 컴포넌트 id 매핑

공통 컴포넌트 문서의 Platform 표를 먼저 사용합니다. 다음 불일치는 Doctor에서 자주 쓰이는 알려진 매핑입니다.

| 공통 문서 id | React registry·구현 id |
|---|---|
| `attachment-input` | `attachment-field`, `attachment-display-field` 및 각 `-reorderable` 변형 |
| `text-input` | registry `text-field`; API `text-field-input`, `text-field-textarea` |
| `radio` | `radio-group` |
| `input-button` | `field-button` |
| `top-navigation` | `app-screen` |

코드 식별자 검색에서 사용할 추가 매핑:

| 공통 문서 id | React 식별자 |
|---|---|
| `floating-action-button` | `Fab`, `ExtendedFab`, `FloatingActionButton` |
| `text-input` | `TextField`, `TextInput`, `Textarea` |

표에 없는 이름이 없다고 바로 결론내리지 않습니다. 공통 문서의 Platform 표 → React 구현 인덱스 → registry 전체 인덱스 → 패키지 export 순으로 확인합니다. Platform 표가 `Not Planned`라면 React 구현이 없는 것입니다.

패키지 export는 `lib/index.d.ts` 한 파일만 grep하지 말고 재export를 따라 `lib/components/index.d.ts`까지 확인합니다. 진입점 barrel만 보고 export가 없다고 판정하면 안 됩니다.

## 업그레이드 정책

버전 기준 패키지는 `@seed-design/react`입니다.

- 설치본이 1.2 미만이면 React 1 가이드로 1.2까지 올린 뒤 React 2 가이드를 따릅니다. 1.x 패키지 조합은 React 1 호환표를 실제로 확인합니다.
- 설치본이 1.2 이상 2.0 미만이면 React 2 가이드를 따릅니다.
- changelog 카테고리는 항상 `react`이고, 패키지 slug는 `@seed-design/`을 제거한 값입니다.
- 특정 버전 이후 변경사항은 `npx @seed-design/cli@latest docs react/updates/changelog/{packageSlug}/{version} --raw`로 조회합니다.

## 적용 룰

다음 네 파일만 React Doctor에서 실행합니다.

1. `../rules/outdated-version.md`
2. `../rules/snippet-generation.md`
3. `../rules/no-deprecated-component.md`
4. `../rules/component-guidelines.md`

각 룰에서 말하는 "선택된 플랫폼 프로필"은 이 파일의 패키지·문서·registry·id 매핑을 뜻합니다.

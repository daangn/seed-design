# Dev Figma V3 Migration Plugin

`tools/figma-v3-migration`은 SEED V2 컴포넌트 인스턴스를 V3로 치환하는 Figma 플러그인이다. 이 문서는 치환 매핑(`src/main/mapping/`)과 그 타입의 원천인 컴포넌트 메타데이터(`src/main/data/`)를 다룬다. 명령은 모두 `tools/figma-v3-migration`에서 실행한다.

## 검증

- 매핑 또는 메타데이터를 바꿨다 → `bun run typecheck:main`
- `src/ui/`나 `src/shared/`도 바꿨다 → `bun run typecheck` (`typecheck:main`과 `typecheck:ui`를 모두 실행)

`ComponentMapping` 타입이 메타데이터에서 허용 값을 끌어오므로, 컴포넌트 이름·속성 키·variant 값이 틀리면 이 타입 검사가 실패한다. 테스트는 없다.

## 작업 절차

1. 대상 V2·V3 메타데이터에서 컴포넌트 `name`, 속성 키, `variantOptions`를 확인한다.
   - V2: `src/main/data/__generated__/v2-component-sets/<component>.d.ts`
   - V3: `src/main/data/__generated__/v3-component-sets/<component>.d.ts`
   - 이름이 `.`으로 시작하는 컴포넌트: `src/main/data/v2-component-sets-private.d.ts`, `src/main/data/v3-component-sets-private.d.ts`
2. 필요한 속성이 메타데이터에 없을 때만 [메타데이터 추출](#메타데이터-추출)을 먼저 한다.
3. 관련 `src/main/mapping/<component>.ts`만 고친다. 새 컴포넌트면 가장 가까운 기존 매핑 파일에 추가하거나 새 파일을 만든다.
4. 새 최상위 매핑 객체를 추가했으면 `src/main/mapping/index.ts`에서 import하고 default export 배열(`[...] as const`)에 넣는다. `childrenMappings`에 넣는 자식 매핑은 `index.ts`에 따로 추가하지 않는다.
5. [검증](#검증)의 명령을 실행하고 변경 파일과 남은 위험을 보고한다.

## 메타데이터 규칙

- 매핑 타입은 V2 = `__generated__/v2-component-sets` + `v2-component-sets-private`, V3 = `__generated__/v3-component-sets` + `v3-component-sets-private`를 합쳐 만든다(`src/main/mapping/types.ts`).
- `__generated__/`에는 `v2-component-sets/`, `v3-component-sets/` 외에 `v2-app-pattern/`, `v2-compat-component-sets/`, `v2-styles/`, `v3-styles/`가 있고 파일마다 `.d.ts`와 `.mjs` 한 쌍이다.
- `__generated__/` 아래는 생성물이다(`git check-attr linguist-generated`가 `set`). 손으로 고치지 않는다 → `bun extract`로 다시 만든다.
- 이름이 `.`으로 시작하는 Figma 컴포넌트(예: `.Item / Menu Item`, `.handle`)는 extractor가 감지하지 못한다 → `*-component-sets-private.d.ts`와 짝 `.mjs`에 같은 내용을 손으로 적는다.
- Figma 이름·값은 문자 그대로 일치해야 한다. 예: `.Item / Menu Item`의 `Layout` 옵션 `"\bText Only"`는 앞에 backspace 문자(`\b`)가 실제로 들어 있다(`action-sheet.ts`). 기존 매핑의 이상한 문자열을 정리하지 않는다 → 메타데이터 값과 대조해 그대로 둔다.

## 메타데이터 추출

현재 메타데이터가 요청한 V3 컴포넌트·속성을 설명하지 못할 때만 추출한다.

1. 의존성이 없으면 저장소 루트에서 `bun install`을 실행한다(`tools/*`는 workspace다).
2. `FIGMA_PERSONAL_ACCESS_TOKEN`과 `FIGMA_FILE_KEY`(V3 컴포넌트 라이브러리 파일 key)가 환경에 있어야 한다. `figma-extractor.config.ts`에 `fileKey`가 없으므로 `FIGMA_FILE_KEY`가 없으면 추출이 실패한다. 변수 목록은 `tools/figma-v3-migration/.env.example`에 있다. `.env`는 읽거나 만들지 않는다 → 값이 없으면 사용자에게 설정을 요청한다. token은 Figma Settings > Account > Personal access tokens에서 만든다.
3. `bun extract`를 실행한다.
4. 출력 위치를 `git status`로 확인한다. 현재 extractor(`ecosystem/figma-extractor/src/pipeline/writers.ts`)는 pipeline 이름을 하위 경로로 붙이므로 `v3-component-sets/component-sets/`에 쓸 수 있다. 기존 파일과 `types.ts`의 import는 `v3-component-sets/` 바로 아래다. 새 하위 디렉터리가 생겼으면 파일을 임의로 옮기지 않고 사용자에게 알린다.
5. 대상 컴포넌트의 생성 파일만 `git diff`로 읽어 새로 생기거나 바뀐 속성을 확인한다.

- `bun extract`는 V3 component set만 다시 쓴다. V2 메타데이터를 갱신하는 script는 `package.json`에 없다 → V2 쪽 갱신이 필요하면 원천 Figma 파일과 방법을 사용자에게 확인한다.
- token·file key 오류 → 두 환경 변수가 설정됐는지, token이 만료되지 않았는지 사용자에게 확인한다.
- `figma-extractor`를 찾지 못하거나 명령은 성공했는데 파일이 그대로다 → bin은 `ecosystem/figma-extractor` 빌드 산출물이다. 루트 `AGENTS.md`「생성」대로 `bun ecosystem:build && bun install` 후 다시 실행한다.

## 매핑 작성

매핑 하나는 `ComponentMapping<"V2 이름", "V3 이름">` 타입의 객체다.

```typescript
import type { ComponentMapping, NewComponentProperties } from "./types";

export const exampleMapping: ComponentMapping<"Old Component Name", "New Component Name"> = {
  oldComponent: "Old Component Name", // V2 메타데이터의 name과 일치
  newComponent: "New Component Name", // V3 메타데이터의 name과 일치
  variantMap: {
    // "VariantName:OldValue": "VariantName:NewValue"
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"New Component Name"> = {};
    return newProperties;
  },
};
```

필드 규칙:

- `oldComponent`·`newComponent`: 메타데이터의 `name`과 이모지·공백·`v2` 접미사까지 같아야 한다(예: `"✅ Box Button v2"`, `"🟢 Action Button"`).
- `variantMap`: 키와 값은 `"<Variant 이름>:<옵션>"` 문자열이고, 각 값은 해당 메타데이터의 `variantOptions`에 있어야 한다. V2 variant 값이 V3 variant 값으로 1:1 대응할 때 쓴다. 속성 이름이 달라도 된다(예: `"Type:Destructive": "Tone:Critical"`).
- `calculateProperties(oldProperties, oldComponentStructure?)`: V2 속성 값(`oldProperties["<키>"].value`)을 읽어 V3 속성 객체를 반환한다. 조건부 variant 결정, TEXT·BOOLEAN·INSTANCE_SWAP 값 복사를 여기서 한다. 자식 노드의 텍스트가 필요하면 두 번째 인자를 쓴다(`snackbar.ts`의 `snackbarMapping`).
- `childrenMappings`: 부모 인스턴스 안의 자식 컴포넌트도 치환해야 할 때 자식 매핑 배열을 넣는다(`action-sheet.ts`의 `actionSheetMapping`).
- `swappableVariants`: 타입과 `src/main/services/swap-component.ts`가 지원하지만 현재 매핑에서는 모두 주석 처리돼 있다(`buttons.ts`, `inline-alerts.ts`).

속성 키와 값 타입:

- 키: TEXT·BOOLEAN·INSTANCE_SWAP은 `"PropertyName#NodeId"`(예: `"Label#5987:61"`), VARIANT는 이름만(예: `Layout`)이다. 메타데이터의 `componentPropertyDefinitions` 키를 그대로 복사한다.
- `VARIANT`: `variantOptions` 중 하나
- `TEXT`: `string`
- `BOOLEAN`: `boolean`
- `INSTANCE_SWAP`: `string`. 메타데이터의 `defaultValue`는 `12:42` 같은 node ID 형식이다.

기존 예:

- 조건부 Layout 결정과 icon 복사 → `src/main/mapping/buttons.ts`의 `boxButtonMapping`
- 부모·자식 매핑 → `src/main/mapping/action-sheet.ts`의 `actionSheetMapping`, `itemMenuGroupMapping`, `itemMenuItemMapping`

## 타입 오류

- `Property does not exist` → 속성 이름이나 `#NodeId`가 메타데이터와 다르다. 대상 `.d.ts`(또는 private 파일)에서 정확한 키를 복사한다.
- `Type is not assignable` → variant 값이 `variantOptions`에 없다. 같은 파일에서 허용 값을 확인한다.
- 컴포넌트 이름 자체가 거부됨 → 메타데이터에 그 컴포넌트가 없다. `.` 접두 컴포넌트면 private 파일에 추가하고, 아니면 [메타데이터 추출](#메타데이터-추출)이 필요한지 확인한다.

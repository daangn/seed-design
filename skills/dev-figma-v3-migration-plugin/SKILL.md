---
name: dev-figma-v3-migration-plugin
description: Develop and maintain the Figma V3 migration plugin, including metadata extraction, mapping updates, and type-safe property conversion. Use when updating V2 to V3 migration mappings in tools/figma-v3-migration.
---

# Dev Figma V3 Migration Plugin

V2 컴포넌트를 V3로 안전하게 치환하기 위한 매핑과 생성 메타데이터를 관리합니다.

## Quick Start

1. `tools/figma-v3-migration`에서 `bun extract`로 최신 메타데이터를 동기화합니다.
2. 변경된 `__generated__`를 기준으로 `src/main/mapping/*`를 수정합니다.
3. `bun run typecheck:main`으로 매핑 타입 안정성을 검증합니다.
4. 신규 패턴은 기존 매핑(`buttons.ts`, `action-sheet.ts`) 스타일과 동일하게 맞춥니다.

## 목차

- 개요/구조: `## 개요`, `### 디렉토리 구조`
- 운영 절차: `## 환경 설정`, `## 매핑 최신화 프로세스`
- 구현 패턴: `## 매핑 파일 작성 가이드`, `## 타입 시스템`
- 장애 대응: `## 트러블슈팅`

## 개요

Figma V3 Migration 플러그인은 SEED Design System V2 컴포넌트를 V3로 마이그레이션하는 Figma 플러그인입니다.

### 디렉토리 구조

```
tools/figma-v3-migration/
├── src/main/
│   ├── mapping/                    # 매핑 정의 파일들
│   │   ├── types.ts                # 타입 정의
│   │   ├── index.ts                # 모든 매핑 export
│   │   ├── buttons.ts              # 버튼 컴포넌트 매핑
│   │   ├── action-sheet.ts         # Action Sheet 매핑
│   │   └── [component].ts          # 기타 컴포넌트별 매핑
│   ├── data/
│   │   └── __generated__/          # 자동 생성된 메타데이터
│   │       ├── v2-component-sets/  # V2 컴포넌트 메타데이터
│   │       └── v3-component-sets/  # V3 컴포넌트 메타데이터
│   └── services/                   # Figma API 서비스
├── figma-extractor.config.ts       # 추출 설정
└── package.json
```

## 환경 설정

### 1. 환경변수 설정

```bash
export FIGMA_PERSONAL_ACCESS_TOKEN="your-figma-token"
```

Figma Personal Access Token은 Figma Settings > Account > Personal access tokens에서 생성할 수 있습니다.

### 2. 의존성 설치

```bash
cd tools/figma-v3-migration
bun install
```

## 매핑 최신화 프로세스

### 1. 메타데이터 추출

```bash
cd tools/figma-v3-migration
bun extract
```

이 명령어는 Figma API에서 V3 컴포넌트 메타데이터를 추출하여 `src/main/data/__generated__/v3-component-sets/` 디렉토리에 `.d.ts` 파일로 저장합니다.

### 2. 변경된 파일 확인

```bash
git status
git diff src/main/data/__generated__/
```

### 3. 매핑 파일 업데이트 워크플로우

1. **변경된 Generated 파일 분석**: 새로 추가되거나 변경된 컴포넌트 확인
2. **관련 매핑 파일 수정**: `src/main/mapping/` 디렉토리의 해당 컴포넌트 매핑 업데이트
3. **index.ts 업데이트**: 새 매핑 추가 시 export 목록에 추가
4. **타입 체크**: `bun run typecheck:main`으로 매핑 파일 타입 에러 확인

## 매핑 파일 작성 가이드

### 기본 구조

매핑 파일은 `ComponentMapping<OldComponentName, NewComponentName>` 타입을 사용합니다.

```typescript
import type { ComponentMapping, NewComponentProperties } from "./types";

export const exampleMapping: ComponentMapping<"Old Component Name", "New Component Name"> = {
  oldComponent: "Old Component Name",    // V2 컴포넌트 이름 (Generated 파일의 name과 일치)
  newComponent: "New Component Name",    // V3 컴포넌트 이름
  variantMap: {
    // Variant 값 매핑
  },
  calculateProperties(oldProperties) {
    // 프로퍼티 변환 로직
    const newProperties: NewComponentProperties<"New Component Name"> = {};
    return newProperties;
  },
};
```

### 실제 예제: buttons.ts

```typescript
// tools/figma-v3-migration/src/main/mapping/buttons.ts

import type { ComponentMapping, NewComponentProperties } from "./types";

export const boxButtonMapping: ComponentMapping<"✅ Box Button v2", "🟢 Action Button"> = {
  oldComponent: "✅ Box Button v2",
  newComponent: "🟢 Action Button",

  // 1. variantMap: Variant 값 매핑
  variantMap: {
    // 형식: "VariantName:OldValue": "VariantName:NewValue"
    "Size:XSmall": "Size:Small",
    "Size:Small": "Size:Small",
    "Size:Medium": "Size:Medium",
    "Size:Large": "Size:Large",
    "Size:XLarge": "Size:Large",
    "State:Enabled": "State:Enabled",
    "State:Disabled": "State:Disabled",
    "State:Loading": "State:Loading",
    "State:Pressed": "State:Pressed",
    "Variant:Primary": "Variant:Neutral Solid",
    "Variant:Primary low": "Variant:Neutral Weak",
    "Variant:Secondary": "Variant:Neutral Weak",
    "Variant:Danger": "Variant:Critical Solid",
  },

  // 2. calculateProperties: 프로퍼티 변환 로직
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Action Button"> = {
      // TEXT 프로퍼티 매핑: "PropertyName#NodeId"
      "Label#5987:61": oldProperties["Label#28272:77"].value,
    };

    // BOOLEAN 프로퍼티 읽기
    const prefixIcon = oldProperties["Prefix icon#28272:78"].value;
    const suffixIcon = oldProperties["Suffix icon#28272:76"].value;

    // 조건부 로직으로 Layout 설정
    if (prefixIcon && suffixIcon) {
      newProperties.Layout = "Icon Last";
      newProperties["Prefix Icon#5987:305"] = oldProperties["↳Icons#28292:0"].value;
    } else if (prefixIcon) {
      newProperties.Layout = "Icon First";
      newProperties["Prefix Icon#5987:305"] = oldProperties["↳Icons#28292:0"].value;
    } else if (suffixIcon) {
      newProperties.Layout = "Icon Last";
    } else {
      newProperties.Layout = "Text Only";
    }

    return newProperties;
  },
};
```

### 중첩 컴포넌트 처리: action-sheet.ts

부모 컴포넌트 내부에 자식 컴포넌트가 있는 경우 `childrenMappings`를 사용합니다.

```typescript
// tools/figma-v3-migration/src/main/mapping/action-sheet.ts

import type { ComponentMapping, NewComponentProperties } from "./types";

// 자식 컴포넌트 매핑 정의
const itemMenuGroupMapping: ComponentMapping<"Action button group", ".Item / Menu Group"> = {
  oldComponent: "Action button group",
  newComponent: ".Item / Menu Group",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Menu Group"> = {
      "Action Count":
        oldProperties["Action count"].value === "8 (Max)"
          ? "8"
          : oldProperties["Action count"].value,
    };
    return newProperties;
  },
};

const itemMenuItemMapping: ComponentMapping<"Action button", ".Item / Menu Item"> = {
  oldComponent: "Action button",
  newComponent: ".Item / Menu Item",
  variantMap: {
    "State:Default": "State:Enabled",
    "State:Pressed": "State:Pressed",
    "Type:Destructive": "Tone:Critical",
    "Type:Enabled": "Tone:Neutral",
    "Prefix icon:True": "Layout:Text with Icon",
    "Prefix icon:False": "Layout:\bText Only",
  },
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<".Item / Menu Item"> = {
      "Label#55905:8": oldProperties["🅃 Action label#55905:8"].value,
    };

    const hasPrefixIcon = oldProperties["Prefix icon"].value === "True";
    if (hasPrefixIcon) {
      newProperties["Show Prefix Icon#17043:5"] = true;
      newProperties["Prefix Icon#55948:0"] = oldProperties["Icon#55948:0"].value;
    }

    return newProperties;
  },
};

// 부모 컴포넌트 매핑 (childrenMappings 포함)
export const actionSheetMapping: ComponentMapping<"✅ Action Sheet v2", "🟢 Menu Sheet"> = {
  oldComponent: "✅ Action Sheet v2",
  newComponent: "🟢 Menu Sheet",
  variantMap: {},
  calculateProperties(oldProperties) {
    const newProperties: NewComponentProperties<"🟢 Menu Sheet"> = {
      Layout: "Text Only",
      "Show Safe Area#25531:15": true,
      "Menu Group Count": "1",
    };

    const hasTitle = oldProperties.Title.value === "True";
    if (hasTitle) {
      newProperties["Show Header#17043:12"] = true;
    }

    return newProperties;
  },
  // 자식 컴포넌트 매핑 배열
  childrenMappings: [itemMenuGroupMapping, itemMenuItemMapping],
};
```

### 새 매핑 추가 시 체크리스트

1. **Generated 파일 확인**
   - V2: `src/main/data/__generated__/v2-component-sets/[component].d.ts`
   - V3: `src/main/data/__generated__/v3-component-sets/[component].d.ts`

2. **매핑 파일 생성/수정**
   - `src/main/mapping/[component].ts` 파일 생성 또는 기존 파일에 추가

3. **index.ts 업데이트**
   ```typescript
   // src/main/mapping/index.ts
   import { newComponentMapping } from "./new-component";

   export default [
     // ... 기존 매핑들
     newComponentMapping,
   ] as const;
   ```

4. **타입 체크**
   ```bash
   cd tools/figma-v3-migration
   bun run typecheck:main  # 매핑 파일 타입 체크
   bun run typecheck       # 전체 타입 체크 (main + ui)
   ```

## 타입 시스템

### Generated 메타데이터 구조

```typescript
// src/main/data/__generated__/v3-component-sets/action-button.d.ts
export declare const metadata: {
  "name": "🟢 Action Button",
  "key": "450ede9d0bf42fc6ef14345c77e6e407d6d5ee89",
  "componentPropertyDefinitions": {
    "Label#5987:61": {
      "type": "TEXT",
      "defaultValue": "라벨"
    },
    "Size": {
      "type": "VARIANT",
      "defaultValue": "XSmall",
      "variantOptions": ["XSmall", "Small", "Medium", "Large"]
    },
    "Layout": {
      "type": "VARIANT",
      "defaultValue": "Text Only",
      "variantOptions": ["Text Only", "Icon First", "Icon Last", "Icon Only"]
    },
    "Prefix Icon#5987:305": {
      "type": "INSTANCE_SWAP",
      "defaultValue": "37665:153410",
      "preferredValues": []
    }
  }
};
```

### 프로퍼티 타입별 처리

| 타입 | 설명 | 값 형식 |
|------|------|---------|
| `VARIANT` | 선택 가능한 옵션들 | `variantOptions` 중 하나 |
| `TEXT` | 텍스트 입력 | `string` |
| `BOOLEAN` | 참/거짓 | `boolean` |
| `INSTANCE_SWAP` | 컴포넌트 교체 | 컴포넌트 key (`string`) |

### 타입 안전성

`ComponentMapping` 타입은 Generated 메타데이터를 기반으로 타입 검증을 수행합니다:

- **컴포넌트 이름**: V2/V3 Generated 파일의 `name`과 일치해야 함
- **프로퍼티 키**: `"PropertyName#NodeId"` 형식으로 정확히 일치해야 함
- **Variant 값**: `variantOptions`에 정의된 값만 사용 가능

잘못된 프로퍼티 이름이나 값을 사용하면 TypeScript 컴파일 에러가 발생합니다.

## 트러블슈팅

### 일반적인 에러

#### 1. "Property does not exist" 타입 에러

**원인**: 프로퍼티 이름이 Generated 파일과 일치하지 않음

**해결**: Generated `.d.ts` 파일에서 정확한 프로퍼티 이름 확인
```bash
cat src/main/data/__generated__/v3-component-sets/[component].d.ts
```

#### 2. "Type is not assignable" 에러

**원인**: Variant 값이 `variantOptions`에 없는 값

**해결**: Generated 파일의 `variantOptions` 확인 후 올바른 값 사용

#### 3. Extract 명령어 실패

**원인**: `FIGMA_PERSONAL_ACCESS_TOKEN` 미설정 또는 만료

**해결**:
```bash
export FIGMA_PERSONAL_ACCESS_TOKEN="new-token"
bun extract
```

### 디버깅 팁

1. **프로퍼티 이름 확인**
   ```bash
   # V2 컴포넌트 프로퍼티 확인
   cat src/main/data/__generated__/v2-component-sets/[component].d.ts

   # V3 컴포넌트 프로퍼티 확인
   cat src/main/data/__generated__/v3-component-sets/[component].d.ts
   ```

2. **기존 매핑 패턴 참고**
   ```bash
   # 비슷한 컴포넌트의 매핑 확인
   cat src/main/mapping/buttons.ts
   cat src/main/mapping/checkbox.ts
   ```

3. **타입 에러 확인**
   ```bash
   cd tools/figma-v3-migration
   bun run typecheck:main  # 매핑 파일만 체크
   bun run typecheck       # 전체 체크
   ```

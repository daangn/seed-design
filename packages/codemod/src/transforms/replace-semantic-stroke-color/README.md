# replace-semantic-stroke-color

시맨틱 stroke 컬러 토큰을 v0.2.0에 맞춰 마이그레이션하는 transform입니다.

## 목적

@seed-design/css v0.2.0에서 업데이트된 시맨틱 stroke 컬러 토큰을 자동으로 마이그레이션합니다.
이전 버전의 stroke 토큰들을 새로운 네이밍 규칙에 맞게 변환합니다.

## 변환 매핑

### 우선 순위 변환 (1차)
⚠️ **중요**: 다음 변환은 반드시 다른 변환보다 먼저 처리됩니다.

| 기존 토큰 | 신규 토큰 | 비고 |
|----------|-----------|------|
| `vars.$color.stroke.neutralMuted` | `vars.$color.stroke.neutralSubtle` | 가장 먼저 마이그레이션해야 합니다 |

### 일반 변환 (2차)

| 기존 토큰 | 신규 토큰 |
|----------|-----------|
| `vars.$color.stroke.onImage` | `vars.$color.stroke.neutralSubtle` |
| `vars.$color.stroke.neutral` | `vars.$color.stroke.neutralMuted` |
| `vars.$color.stroke.fieldFocused` | `vars.$color.stroke.neutralContrast` |
| `vars.$color.stroke.control` | `vars.$color.stroke.neutralWeak` |
| `vars.$color.stroke.field` | `vars.$color.stroke.neutralWeak` |
| `vars.$color.stroke.brand` | `vars.$color.stroke.brandWeak` |
| `vars.$color.stroke.positive` | `vars.$color.stroke.positiveWeak` |
| `vars.$color.stroke.informative` | `vars.$color.stroke.informativeWeak` |
| `vars.$color.stroke.warning` | `vars.$color.stroke.warningWeak` |
| `vars.$color.stroke.critical` | `vars.$color.stroke.criticalWeak` |

## 지원하는 파일 형식

- TypeScript (`.ts`)
- TypeScript JSX (`.tsx`)

## 변환 예시

### 기본 사용
```typescript
// Before
import { vars } from "@seed-design/css/vars";
const borderColor = vars.$color.stroke.neutralMuted;
const outlineColor = vars.$color.stroke.neutral;

// After
import { vars } from "@seed-design/css/vars";
const borderColor = vars.$color.stroke.neutralSubtle;
const outlineColor = vars.$color.stroke.neutralMuted;
```

### React 컴포넌트에서의 사용
```tsx
// Before
const Component = () => (
  <div style={{ 
    borderColor: vars.$color.stroke.control,
    outlineColor: vars.$color.stroke.brand 
  }} />
);

// After
const Component = () => (
  <div style={{ 
    borderColor: vars.$color.stroke.neutralWeak,
    outlineColor: vars.$color.stroke.brandWeak 
  }} />
);
```

## 우선 순위의 중요성

이 transform은 **2-pass 방식**으로 동작합니다:

1. **1차 변환**: `neutralMuted` → `neutralSubtle`을 먼저 처리
2. **2차 변환**: `neutral` → `neutralMuted` 등 나머지 변환들을 처리

이 순서가 중요한 이유는 연쇄 변환을 방지하기 위해서입니다. 
만약 순서가 바뀌면 `neutralMuted`가 `neutralSubtle`로 변환되기 전에 
`neutral`이 `neutralMuted`로 변환될 수 있어 예상치 못한 결과가 나올 수 있습니다.

## 변환되지 않는 토큰들

다음 토큰들은 이미 v3 형식이므로 변환되지 않습니다:
- `vars.$color.stroke.brandWeak`
- `vars.$color.stroke.brandSolid`
- `vars.$color.stroke.neutralSubtle`
- `vars.$color.stroke.neutralContrast`
- `vars.$color.stroke.neutralWeak`
- 기타 `-weak`, `-solid` 접미사를 가진 토큰들

## 로깅

transform 실행 시 다음과 같은 로그가 생성됩니다:
- `.report/replace-semantic-stroke-color-success.log`: 성공한 변환들
- `.report/replace-semantic-stroke-color-issues.log`: 경고 및 실패
- `.report/replace-semantic-stroke-color-debug.log`: 디버그 정보
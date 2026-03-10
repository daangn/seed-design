# 컴포넌트 작업 완료 체크리스트

## 필수 확인 사항

- [ ] Rootage 정의가 완전한가?
- [ ] `bun generate:all` 실행했는가?
- [ ] Recipe가 `recipes/index.ts`에 export 되었는가?
- [ ] React 컴포넌트가 빌드되는가? (`bun packages:build`)
- [ ] 문서가 실제 API와 일치하는가?
- [ ] 예제가 동작하는가?
- [ ] Storybook 스토리가 테마별로 정상인가?
- [ ] `bun --filter @seed-design/docs generate:registry` 실행했는가?
- [ ] 타입 에러가 없는가? (`bun typecheck`)
- [ ] Visual Test 통과했는가? (Agent Browser)

## 흔한 실수

### 잘못된 순서

```text
❌ React 먼저 → Rootage 나중에
   → CSS 변수가 없어서 스타일 깨짐

✅ Rootage → generate → Recipe → React → Docs → Test
```

### Recipe export 누락

```text
❌ Recipe 작성 후 index.ts에 추가 안 함
   → 컴포넌트에서 import 실패

✅ recipes/index.ts에 반드시 export 추가
```

### 테스트 생략

```text
❌ 구현만 하고 Visual Test 안 함
   → 다크모드/폰트 스케일링 버그 발견 못함

✅ Agent Browser로 모든 환경 테스트
```

### Recipe-React 불일치

```text
❌ defineSlotRecipe로 변경 후 generate 안 함
   → CSS에 슬롯 클래스명이 없어서 스타일 깨짐
   → bun generate:all 없이 React 코드만 수정

✅ recipe 수정 → bun generate:all → React 코드 수정
```

### React에 style 직접 작성

```text
❌ <Component style={{ width: "100%", height: "100%" }} />
   → 테마, 다크모드, CSS 변수 활용 불가
   → 스타일 관리 분산

✅ qvism-preset recipe의 해당 슬롯에 스타일 추가
   → withContext로 슬롯 className 자동 적용
```

### 잘못된 import 경로

```text
❌ import { createSlotRecipeContext } from "@seed-design/react-utils"
   → 존재하지 않는 패키지, 빌드 실패

✅ import { createSlotRecipeContext } from "../../utils/createSlotRecipeContext"
```

## 생성 파일 (수정 금지)

| 패턴 | 소스 |
|------|------|
| `packages/css/recipes/*` | rootage |
| `packages/css/vars/component/*` | rootage |
| `packages/qvism-preset/src/vars/component/*` | rootage |
| `packages/rootage/components/schema.json` | rootage |
| `docs/registry/*.json` | registry-*.ts |

**수정 방법**: 소스 파일 수정 후 `bun generate:all` 실행

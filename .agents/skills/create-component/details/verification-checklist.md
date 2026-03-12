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

반드시 Rootage → generate → Recipe → React → Docs → Test 순서를 따른다. React를 먼저 작성하면 CSS 변수가 없어서 스타일이 깨진다.

### Recipe export 누락

Recipe 작성 후 반드시 `recipes/index.ts`에 export를 추가해야 한다. 누락하면 컴포넌트에서 import가 실패한다.

### 테스트 생략

구현 후 반드시 Agent Browser로 Visual Test를 수행한다. 생략하면 다크모드나 폰트 스케일링 관련 버그를 발견하지 못한다.

### Recipe-React 불일치

`defineSlotRecipe`로 변경하거나 슬롯을 추가한 후에는 반드시 `bun generate:all`을 먼저 실행한 뒤 React 코드를 수정한다. generate 없이 React 코드만 수정하면 CSS에 슬롯 클래스명이 없어서 스타일이 깨진다.

### React에 style 직접 작성

style prop을 직접 사용하면 테마, 다크모드, CSS 변수 활용이 불가능하고 스타일 관리가 분산된다. 반드시 qvism-preset recipe의 해당 슬롯에 스타일을 추가하고, `withContext`로 슬롯 className을 자동 적용한다.

### 잘못된 import 경로

`createSlotRecipeContext`는 `@seed-design/react-utils`(존재하지 않는 패키지)가 아닌 `../../utils/createSlotRecipeContext` 상대 경로에서 import한다.

## 생성 파일 (수정 금지)

| 패턴 | 소스 |
|------|------|
| `packages/css/recipes/*` | rootage |
| `packages/css/vars/component/*` | rootage |
| `packages/qvism-preset/src/vars/component/*` | rootage |
| `packages/rootage/components/schema.json` | rootage |
| `docs/registry/*.json` | registry-*.ts |

**수정 방법**: 소스 파일 수정 후 `bun generate:all` 실행

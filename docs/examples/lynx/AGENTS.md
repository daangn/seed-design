# docs/examples/lynx

Lynx 컴포넌트 문서가 실행하는 ReactLynx 예제다. `docs/scripts/lynx-examples`가 각 TSX를 브라우저 미리보기 bundle과 native Lynx bundle로 함께 빌드한다.

## 검증

- 타입 → `bun --filter @seed-design/docs typecheck:lynx-examples`(`bun docs:test`에 포함)
- 빌드·discovery 규칙 → `bun --filter @seed-design/docs build:lynx-examples`
- native 기기 결과 → `seed-verify-lynx-component` Skill

## 규칙

### 파일

- 경로는 `<component>/<scenario>.tsx` 두 단계이고 두 이름 모두 kebab-case다. 어기면 discovery가 빌드를 실패시킨다.
- 컴포넌트 디렉터리의 `.tsx`는 모두 entry가 된다 → 같은 컴포넌트가 공유하는 스타일·코드는 `styles.ts`, `preview.css`처럼 `.tsx`가 아닌 파일에 둔다.
- symlink와 컴포넌트 디렉터리 밖의 파일을 쓰지 않는다 → 필요한 코드는 해당 컴포넌트 디렉터리에 둔다.

### 스타일

- 공유 스타일을 쓰면 `import "./styles";`를 첫 import로 둔다. 스타일이 컴포넌트보다 먼저 등록돼야 한다.
- `styles.ts`는 `@seed-design/lynx-css/base.css`와 예제용 `./preview.css`만 import한다. 컴포넌트가 소유한 Recipe CSS는 예제에서 import하지 않는다.

### 코드

- entry는 예제 컴포넌트 하나를 default export한다. 예제 안에서 `root.render()`를 호출하지 않는다 → 독립 실행 bootstrap은 `standalone.tsx`가 맡는다.
- 새 예제나 대상 컴포넌트 import를 고치는 예제 → Lynx registry 항목이 있으면 `@/components/ui/<name>`(`docs/registry/lynx/ui/`)을 import한다. registry가 없는 package-only 컴포넌트만 `@seed-design/lynx-react` 공개 export를 직접 쓴다. 기존 예제의 일괄 변경은 별도 작업으로 한다.
- 사용자 이벤트는 Lynx 이벤트 prop(`bindtap` 등)으로 받는다. background thread에서 실행할 handler에는 `"background only"` 지시문을 둔다.

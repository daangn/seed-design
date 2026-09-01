# 레이어와 경로 빠른 참조

구현할 레이어를 이미 정한 뒤 경로와 생성 관계를 확인할 때 사용한다. 작업 흐름과 다른 스킬 라우팅은 상위 `SKILL.md`를 따른다.

## 수정 진입점

| 수정 대상 | React 시작 위치 | Lynx 시작 위치 | 확인 명령 |
| --- | --- | --- | --- |
| 토큰·컴포넌트 변수 원천 | `packages/rootage/` | `packages/rootage/` | `bun generate:all` |
| Recipe 원천 | `packages/qvism-preset/src/recipes/` | `packages/lynx-qvism-preset/src/recipes/` | 대상 preset 생성·빌드 |
| Headless·상태 | `packages/react-headless/` | `packages/lynx-react/src/hooks/`, Styled UI 내부 hook/context 또는 기존 외부 Lynx primitive | 대상 패키지 테스트 |
| Styled UI | `packages/react/src/components/` | `packages/lynx-react/src/components/` | 대상 패키지 빌드·테스트 |
| Registry | `docs/registry/react/ui/` | `docs/registry/lynx/ui/` | docs registry 생성 |
| 문서 | `docs/content/react/` | `docs/content/lynx/` | 관련 docs 테스트 |
| 실행 예제 | `docs/examples/react/`, `examples/stackflow-spa/` | `docs/examples/lynx/`, `examples/lynx-spa/` | 관련 예제 타입 검사·빌드 |

## 레이어 선택

모든 컴포넌트가 모든 레이어를 필요로 하지는 않는다.

- 상태와 접근성 동작을 재사용해야 할 때만 Headless를 추가한다.
- 토큰이나 Recipe가 바뀌지 않으면 Rootage와 preset을 건드리지 않는다.
- Registry 필요 여부와 배포 방식은 [API 설계](api-design.md)에서 정한다. Lynx 문서와 예제의 소비 경로는 [`seed-write-lynx-component-docs`](../../seed-write-lynx-component-docs/SKILL.md)를 따른다.

구조가 애매하면 `seed-component-map`으로 현재 컴포넌트와 가까운 참조 컴포넌트를 먼저 비교한다. React와 Lynx를 함께 맞출 때는 `seed-api-parity`로 공개 차이를 확인한다.

## 생성 파일

다음 경로는 원천 파일에서 생성하므로 직접 수정하지 않는다.

- `packages/css/**`
- `packages/qvism-preset/src/vars/**`
- `packages/lynx-css/**`
- `packages/lynx-qvism-preset/src/vars/**`
- `docs/public/__registry__/**`

원천 파일을 수정한 뒤 저장소 지침에 맞는 생성 명령을 실행한다. `git status --short`와 diff로 예상한 생성물만 바뀌었는지 확인한다.

## 구현 후

변경 범위에 맞는 명령과 화면 확인은 [verification-checklist.md](verification-checklist.md)에서 고른다. 공개 패키지를 바꿨다면 `seed-changeset`과 `seed-change-plan`으로 버전과 PR base를 정한다. 사용자가 제출을 요청한 경우에만 `seed-submit-change`로 이어간다.

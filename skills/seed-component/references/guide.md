# 레이어와 경로 빠른 참조

구현할 레이어를 정한 뒤 React·Lynx 시작 경로를 찾을 때 쓴다. 작업 흐름과 다른 Skill 라우팅은 `SKILL.md`를 따른다. 경로별 테스트·생성 명령과 생성물 판별은 루트 `AGENTS.md`「검증」「생성」에 있다.

## 수정 진입점

- 토큰·컴포넌트 변수 원천 → 양쪽 모두 `packages/rootage/`
- Recipe 원천 → React `packages/qvism-preset/src/recipes/`, Lynx `packages/lynx-qvism-preset/src/recipes/`
- Headless·상태 → React `packages/react-headless/`, Lynx `packages/lynx-react-headless/`. 기존 외부 Lynx primitive가 상태를 소유할 때만 `packages/lynx-react/src/hooks/` 또는 Styled UI 내부 hook·context
- Styled UI → React `packages/react/src/components/`, Lynx `packages/lynx-react/src/components/`
- Registry → React `docs/registry/react/ui/`, Lynx `docs/registry/lynx/ui/`
- 문서 → React `docs/content/react/`, Lynx `docs/content/lynx/`
- 실행 예제 → React `docs/examples/react/`, `examples/stackflow-spa/`. Lynx `docs/examples/lynx/`, `examples/lynx-spa/`

## 레이어 선택

모든 컴포넌트가 모든 레이어를 필요로 하지 않는다.

- 상태·이벤트·ref·접근성·기능 geometry를 재사용해야 함 → Headless를 추가한다. Lynx의 Headless·Styled Primitive·Registry 책임은 [lynx-patterns.md](lynx-patterns.md#책임-분리)를 따른다.
- 토큰·Recipe가 바뀌지 않음 → Rootage와 preset을 건드리지 않는다.
- Registry 필요 여부와 배포 방식 → [API 설계](api-design.md)에서 정한다. Lynx 문서·예제의 소비 경로는 [Lynx 문서·예제 작업](lynx-docs.md)을 따른다.
- 구조가 애매함 → [경로 조회](component-map.md)로 현재 컴포넌트와 가까운 참조 컴포넌트를 비교한다.
- React·Lynx를 함께 맞춤 → [API 비교](api-parity.md)로 공개 차이를 확인한다.

## 구현 후

- 명령과 화면 확인 → [verification-checklist.md](verification-checklist.md)에서 변경 범위에 맞는 항목을 고른다.
- 공개 패키지를 바꿈 → [`seed-change`](../../seed-change/SKILL.md)의 changeset·계획 분기로 버전과 PR base를 정한다. 제출 분기는 사용자가 제출을 요청했을 때만 쓴다.

# 막힘 처리 룰 (모든 Phase 공통)

컴포넌트 작업 중 막혔을 때 가장 흔한 실수는 "일단 동작하게" 우회하는 것이다. SEED Design은 토큰·recipe·headless·snippet이 서로 강하게 연결되어 있어, 한 곳에서의 mock·생략이 다른 컴포넌트에 즉시 번진다. 그래서 다음 룰을 따른다.

## 막혔을 때 절대 하지 않는 것

- 임의 우회 (실제 의도와 다른 동작으로 일단 통과)
- mock 데이터·mock 컴포넌트로 대체 (테스트 환경 제외)
- `as any` / `as unknown` 캐스팅으로 타입 우회
- 테스트 생략 / `it.skip` / `describe.skip`
- "나중에 고치자" 주석 후 진행
- 변경된 패턴을 기존 컴포넌트에 일관 적용하지 않은 채 부분만 갱신

이 룰이 깨지면 ground truth가 깨진다. 한 컴포넌트의 mock이 다른 컴포넌트의 패턴 참조에서 다시 참조되어 누적된다.

## 막혔을 때 하는 것

1. **통증 메모 작성** — 무엇이 막혔는가 / 무엇을 시도했는가 / 어떤 차단점인가
2. **사용자에게 보고** — 차단점이 명시적이면 즉시 보고
3. **사용자 결정 후 재시도** 또는 우회 경로 합의

## 즉시 작업 중단 + 보고 대상 차단점

다음에 해당하면 임의 진행 금지. 사용자 결정 필수:

| 차단점 | 신호 |
|--------|------|
| 의존성 불안정 | 의존하는 컴포넌트 API가 dev 브랜치에 머지 안 됨 |
| 토큰 누락 | 필요한 토큰이 rootage에 없음, 새 토큰 추가 필요 |
| ARIA 패턴 충돌 | APG 패턴이 모호하거나 SEED 기존 패턴(`useControllableState`, namespace 등)과 충돌 |
| 외부 레퍼런스 갈림 | Base UI / Radix / Chakra / shadcn 사이에서 인터페이스가 다르고 1순위 룰로도 정해지지 않음 |
| 자동 검증 실패 | `bun generate:all` / `bun test:all` / `bun packages:build` / `bun docs:test` 중 어느 하나라도 실패 |
| Visual 회귀 | Storybook 또는 stackflow-spa에서 기존 컴포넌트에 시각적 영향 발견 |

## 통증 메모 템플릿

막힘이 발생하면 짧게라도 다음을 남긴다(메모리·PR description·Obsidian mind palace 어디든 가능):

```markdown
### 통증: <한 문장 요약>
- 단계: Phase 0 Pre / Phase 0 / Phase 1 Step <N> / Phase 2
- 시도한 것: <bullet>
- 차단점 분류: 의존성 / 토큰 / ARIA / 외부 레퍼런스 / 자동 검증 / Visual
- 사용자 결정: <받은 결정 또는 보류>
- 결과: 재시도 성공 / 우회 경로 / 보류
```

누적된 통증 메모는 다음 컴포넌트 작업의 입력이 된다. 같은 차단점이 두 번 이상 반복되면 `references/` 또는 AGENTS.md를 갱신해야 한다는 신호다.

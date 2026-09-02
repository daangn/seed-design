# 컴포넌트 작업 검증 체크리스트

이번에 바꾼 경로와 사용자 결과만 검증한다. 해당하지 않는 플랫폼이나 레이어의 테스트를 새로 만들지 않는다.

## 변경 범위

- [ ] `seed-component-map` 결과와 실제 파일을 읽었는가?
- [ ] 대상 플랫폼이 `react`, `lynx`, `cross-platform` 중 하나로 정해졌는가?
- [ ] 배포 방식이 `package-only`, `snippet-only`, `package+snippet`, `docs-only` 중 하나로 정해졌는가?
- [ ] React와 Lynx를 함께 다루면 `seed-api-parity`의 차이를 의도한 플랫폼 차이와 보완할 누락으로 나눴는가?
- [ ] 새 패키지, 외부 의존성, CI 변경이 필요하면 사용자 확인을 받았는가?

## 구현 확인

바꾼 레이어에 해당하는 항목만 확인한다.

- [ ] Rootage나 Recipe 원천을 바꿨다면 생성 결과가 최신인가?
- [ ] Styled UI의 공개 export와 타입이 구현과 일치하는가?
- [ ] Registry를 제공한다면 등록 정보, 생성 결과, vendored 소비처가 동기화됐는가?
- [ ] 문서와 예제가 확정한 package 또는 Registry 배포 경로를 그대로 쓰는가?
- [ ] React 문서, Lynx 문서, 예제에서 같은 시나리오가 지원되는 경우 제목·순서·사용자 결과가 일치하는가?
- [ ] 생성 파일을 직접 수정하지 않았는가?

## 자동 검증

1. 수정한 패키지나 문서의 기존 집중 테스트를 먼저 실행한다.
2. 저장소 지침에 따라 `bun generate:all`을 실행하고 예상한 생성물만 바뀌었는지 확인한다.
3. 변경한 경로의 타입 검사, 빌드, 테스트를 실행한다.
4. 커밋하기 전에는 `bun test:all`을 실행한다.
5. 마지막에 `git diff --check`와 `git status --short`를 확인한다.

대표 명령은 다음과 같다. 실제 `package.json`과 수정 경로의 `AGENTS.md`에 더 좁은 명령이 있으면 그 명령을 우선한다.

```bash
bun generate:all
bun packages:build
bun docs:test
bun test:all
git diff --check
```

문서나 Storybook을 바꾸지 않았다면 관련 없는 빌드를 의무로 추가하지 않는다. 반대로 공개 예제나 Registry를 바꿨다면 해당 docs 타입 검사와 생성 검증을 생략하지 않는다.

## React 화면 확인

변경이 렌더링이나 상호작용에 영향을 주면 [visual-testing.md](visual-testing.md)를 따른다.

- Storybook의 Light, Dark, FontScaling ExtraSmall, FontScaling ExtraExtraExtraLarge
- docs 컴포넌트 페이지
- 실사용 조합에 영향이 있으면 `examples/stackflow-spa`의 가까운 Activity

Storybook 파일만 바꿨다면 [storybook.md](storybook.md)의 CSF Next 규칙과 관련 빌드만 확인한다.

## Lynx 화면 확인

- 문서 예제를 바꿨다면 실제 `LynxComponentExample`에서 미리보기, 코드, QR, Explorer 링크를 확인한다.
- [`seed-write-lynx-component-docs`](../../seed-write-lynx-component-docs/SKILL.md)에서 확정한 배포 경로가 Registry, 문서, 예제에서 일치하는지 확인한다.
- 실제 Lynx 동작을 새로 주장하거나 런타임 동작을 바꿨다면 `examples/lynx-spa` 또는 사용 가능한 호스트 앱에서 확인한다.
- 기기나 실행 세션이 없으면 확인하지 못한 범위를 적는다. 문서용 우회 구현으로 네이티브 결과를 흉내 내지 않는다.

## 구현 패턴

- [ ] React의 키보드·ARIA 계약과 Lynx의 native 접근성·터치 계약을 같은 것으로 가정하지 않았는가?
- [ ] Lynx native 태그를 최종 컴포넌트 파일의 literal JSX로 작성했는가?
- [ ] Lynx native props에서 `children`을 분리하고 null ref 전달을 막았는가?
- [ ] Recipe import가 대상 플랫폼과 일치하는가?
- [ ] Headless와 Styled UI가 상태와 스타일 책임을 중복해서 소유하지 않는가?
- [ ] 지원하지 않는 플랫폼 기능을 타입과 문서에서 같은 방식으로 제외했는가?
- [ ] 등록·레이아웃 측정값에 의존하는 transition이 있다면, 동적 자식 추가를 포함해 현재 필요한 값이 모두 준비될 때까지 Label·Indicator 등 관련 대상의 transition을 비활성화했는가?

## 배포 준비

- [ ] 공개 패키지 변경이면 `seed-changeset`으로 버전 후보와 한국어 changeset을 확인했는가?
- [ ] `seed-change-plan`으로 영향 범위, 검증 순서, `origin/dev`·`origin/minor`·`origin/major` 중 PR base를 정했는가?
- [ ] 제출을 요청받았다면 `seed-submit-change`가 같은 base로 rebase·commit·push·PR을 준비하는가?

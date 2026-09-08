# 컴포넌트 작업 검증 체크리스트

이번에 바꾼 경로와 사용자 결과만 검증한다. 해당하지 않는 플랫폼이나 레이어의 테스트를 새로 만들지 않는다.

## 변경 범위

- [ ] `seed-component-map` 결과와 실제 파일을 읽었는가?
- [ ] 대상 플랫폼이 `react`, `lynx`, `cross-platform` 중 하나로 정해졌는가?
- [ ] 배포 방식이 `package-only`, `snippet-only`, `package+snippet`, `docs-only` 중 하나로 정해졌는가?
- [ ] React와 Lynx를 함께 다루면 `seed-api-parity`의 차이를 의도한 플랫폼 차이와 보완할 누락으로 나눴는가?
- [ ] 새 패키지, 외부 의존성, CI 변경이 필요하면 사용자 확인을 받았는가?
- [ ] 참조가 있는 동작 변경은 [행동별 원천 추적](implementation-steps.md#행동별-원천-추적)으로 공개 컴포넌트 아래의 실제 구현까지 확인했는가?

## 관찰 가능한 결과 판정

렌더링·상호작용을 바꾸면 구현 전에 시나리오별 조건·입력·기대 결과·필수 환경을 정한다. [기본 장면 우선 검증](implementation-steps.md#기본-장면-우선-검증)과 최종 검증에 같은 기준을 쓰고, 국소 변경은 영향을 받는 시나리오만 확인한다.

- `placement 구현`, `클릭 확인`, `preview 정상`처럼 작업 이름을 통과 조건으로 쓰지 않는다. 위치·크기·선택 상태·표시 수명처럼 사용자가 관찰할 관계를 적는다.
- 참조와 대상의 viewport, host/frame, 기준 요소 위치, 내용과 초기 상태를 맞춘다. 의도적인 차이는 이유를 남기고, 예제 frame 중앙 정렬을 내부 컴포넌트 배치의 정답으로 사용하지 않는다.
- Menu의 기본 아래 배치는 아래 공간이 충분할 때 `menu.top ≈ trigger.bottom + gutter`, 가로 중심 일치, 버튼과 메뉴 본문 비중첩으로 확인한다. 좌표계·단위와 허용 오차는 해당 환경의 측정 기준으로 정한다. 공간 부족 시 배치와 높이 제한은 참조의 충돌 정책으로 별도 판정한다.
- 입력 전·표시 중간·정착 후의 대상 화면을 확인한다. 전환이 있으면 시간 또는 프레임을 식별할 수 있는 증거를 남긴다. 위치가 의심되면 같은 좌표계의 기준 요소·콘텐츠 rect와 적용 스타일을 함께 확인한다. 코드의 수식·조건문이나 정착 후 한 장만으로 중간 상태를 통과시키지 않는다.
- 인계는 `변경본 식별자 → 실행 명령/시나리오 → 판정과 기대·실제 결과 → 증거 → 실패 원천·영향 범위`로 짧게 남긴다. 변경본 식별자에 실제 worktree·entry·번들 등 실행 대상을 연결하고, 수신자가 화면·측정 증거를 열 수 있는 경로를 유지한다. 실패 원천을 아직 모르면 추측으로 확정하지 않는다.
- 판정은 `통과`, `실패`, `환경 차단`, `미확인`으로 나눈다. 필수 실패는 전체 실패, 필수 차단·미확인은 전체 미완료다. 생성·타입·API 리뷰의 통과나 작업자 종료는 결과 승인을 대신하지 않는다.

참조와 다른 결과를 발견하면 해당 원천을 수정한 뒤 영향을 받은 항목을 재확인한다. 기대 결과를 구현에 맞춰 낮추거나 실제 실패를 미지원으로 재분류하지 않는다. 범위 변경은 사용자 결정이 필요하다.

## 구현 확인

바꾼 레이어에 해당하는 항목만 확인한다.

- [ ] Rootage나 Recipe 원천을 바꿨다면 생성 결과가 최신인가?
- [ ] Styled UI의 공개 export와 타입이 구현과 일치하는가?
- [ ] Registry를 제공한다면 등록 정보, 생성 결과, vendored 소비처가 동기화됐는가?
- [ ] 문서와 예제가 확정한 package 또는 Registry 배포 경로를 그대로 쓰는가?
- [ ] React 문서, Lynx 문서, 예제에서 같은 시나리오가 지원되는 경우 제목·순서·사용자 결과가 일치하는가?
- [ ] 생성 파일을 직접 수정하지 않았는가?

## 자동 검증

변경한 레이어와 사용자 결과에 필요한 항목만 선택한다. 문서·Skill·Storybook 설정처럼 실행 동작을 바꾸지 않는 수정에는 내용·링크·형식 검토로 충분하다.

번호는 검사 목록이며 모든 검사를 직렬 실행하라는 뜻이 아니다. 동일 입력을 편집 중일 때 최종 검증을 하지 않는다. 변경본이 안정되면 패키지 타입·회귀, Registry·문서·예제 연결, 화면·상호작용 검사를 입력과 자원 의존성에 따라 병렬로 실행할 수 있다. 생성물을 소비하는 검사만 해당 생성 완료를 기다리며, 무관한 검사는 기다리지 않는다.

실행 분담·호스트 격리·CPU와 메모리 경합은 [검증 분담과 자원](../../seed-orchestrate-component/references/collaboration.md#검증-분담과-자원)을 따른다. 이 기준은 기존 실행 자원을 배정하는 용도이며 검사 종류별 워커 생성이나 새로운 검증 체계를 요구하지 않는다. 전체 문서 빌드는 [기본 장면 우선 검증](implementation-steps.md#기본-장면-우선-검증)의 필수 선행 조건이 아니다.

1. 동작을 바꿨다면 수정한 패키지의 기존 집중 테스트를 실행한다.
2. Rootage·Recipe 원천을 바꿨다면 해당 생성 명령을 실행하고 예상한 산출물만 바뀌었는지 확인한다.
3. 공개 코드·Registry·문서 예제를 바꿨다면 관련 타입 검사·빌드·테스트를 실행한다.
4. `bun test:all`은 저장소 필수 절차, 릴리스·제출 요청 또는 넓은 회귀 위험이 있을 때만 실행한다. 커밋 전이라는 이유만으로 반복하지 않는다.
5. 코드나 생성물을 바꿨다면 마지막에 `git diff --check`와 `git status --short`로 범위를 확인한다.

대표 명령은 다음과 같다. 실제 `package.json`과 수정 경로의 `AGENTS.md`에 더 좁은 명령이 있으면 그 명령을 우선한다.

```bash
# Rootage·Recipe 원천을 바꾼 경우
bun generate:all

# 해당 surface의 실제 변경이 있을 때만 선택
bun packages:build
bun docs:test
bun test:all
git diff --check
```

문서나 Storybook만 바꿨다면 관련 문서·스토리 검사만 실행한다. Registry·공개 예제를 바꿨다면 docs 타입 검사와 생성 검증을 생략하지 않는다.

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
- [ ] 등록·레이아웃 측정값에 의존하는 transition이 있다면, 동적 자식 추가를 포함해 현재 필요한 값이 모두 준비될 때까지 관련 slot의 Recipe className으로 transition을 비활성화했는가?

## 배포 준비

- [ ] 공개 패키지 변경이면 `seed-changeset`으로 버전 후보와 한국어 changeset을 확인했는가?
- [ ] `seed-change-plan`으로 영향 범위, 검증 순서, `origin/dev`·`origin/minor`·`origin/major` 중 PR base를 정했는가?
- [ ] 제출을 요청받았다면 `seed-submit-change`가 같은 base로 rebase·commit·push·PR을 준비하는가?

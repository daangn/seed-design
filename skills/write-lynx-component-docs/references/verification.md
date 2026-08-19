# 검증 절차

## 변경 범위 확인

검증 전에 `git diff`와 `git status`로 변경 범위를 확인한다. 문서 작업만 요청받았다면 배포 패키지, lockfile, 생성된 CSS가 바뀌지 않았는지 확인한다.

## 정적 검증

변경 내용에 맞춰 다음 명령을 실행한다.

```bash
bun --filter @seed-design/docs typecheck:lynx-examples
bun docs:test
git diff --check
```

미리보기 도구나 URL 로직을 수정했다면 관련 테스트를 먼저 실행한다.

```bash
bun test docs/components/lynx-example docs/scripts/lynx-examples docs/lib/lynx-examples
```

실행 예제나 빌드 구성을 수정했다면 native와 web bundle을 다시 만든다.

```bash
bun --filter @seed-design/docs build:lynx-examples:development
```

생성된 매니페스트에서 해당 예제의 web·native 항목과 파일 존재 여부를 확인한다.

## 저장소 공통 검증

저장소 지침에 따라 생성을 실행하고 예상하지 않은 변경이 생기지 않았는지 확인한다.

```bash
bun generate:all
git status --short
```

커밋 전에는 전체 테스트를 실행한다.

```bash
bun test:all
```

전체 테스트가 환경 문제로 실패하면 실패한 명령, 원인, 실행한 범위 검증을 구분해 보고한다.

## 문서 미리보기 확인

- 예제의 미리보기, QR 코드, 코드 탭이 모두 열린다.
- 코드 탭이 의도한 엔트리 파일을 보여준다.
- QR 원문은 `lynx://`가 아닌 직접 접근 가능한 `.lynx.bundle` URL이다.
- Explorer 버튼은 bundle URL을 인코딩한 `lynx://open` 딥 링크다.
- 네이티브 전용 동작의 콜아웃이 관련 예제 바로 아래에 있다.
- `false`, `null`, `0`, 빈 문자열 같은 상태 값이 의도대로 보인다.

## 실기기 확인

네이티브 결과와 관련된 변경은 가능한 경우 iPhone의 Lynx Explorer 또는 PlayLynx에서 확인한다.

- QR 코드로 예제가 실행된다.
- 컴포넌트가 실제 앱과 같은 API·스타일 패턴으로 렌더링된다.
- 아이콘 크기와 `tint-color`가 의도대로 보인다.
- 상호작용 후 상태와 disabled 조건이 갱신된다.
- Stack과 같은 레이아웃 컴포넌트는 방향, 줄바꿈, 간격을 확인한다.

Lynx DevTool을 사용했다면 연결한 client·session, 확인한 계산 스타일과 box model을 기록한다.

## 완료 보고

다음을 짧게 구분해 보고한다.

1. 작성하거나 수정한 문서와 예제
2. 웹 미리보기에서 확인한 항목
3. 실기기에서 확인한 항목
4. 실행한 테스트와 결과
5. 문서 미리보기의 알려진 제한 또는 별도 컴포넌트 작업이 필요한 문제

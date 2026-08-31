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

생성 후 [`seed-verify-lynx-example`](../../seed-verify-lynx-example/SKILL.md)의 resolver로 해당 예제 entry, manifest, web·native bundle 연결을 확인한다.

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

일반적인 문서 작성에서는 저장소의 문서 개발 서버 또는 `bun docs:build`로 생성한 `docs/out`에서만 WebLynx를 확인한다. 예제를 독립 HTML, 별도 Vite 앱, 임시 React 페이지로 옮기지 않는다. 검증 결과는 반드시 실제 `LynxComponentExample`에서 얻는다.

개발 서버의 미리보기가 준비되지 않거나 불안정하면 다음 순서로 전환한다.

1. 예제 타입 검사와 web·native bundle 빌드가 성공했는지 확인한다.
2. 개발 서버를 한 번 다시 실행하거나 문서 페이지를 다시 연다.
3. 계속 실패하면 `bun docs:build`를 실행한다.
4. `docs/out`을 정적 서버로 열고 대상 문서 페이지의 `LynxComponentExample`을 확인한다.
5. 프로덕션 문서에서도 실패하면 문서 런타임 결함으로 분류하고 별도 진단 작업을 제안한다.

- 예제의 미리보기, QR 코드, 코드 탭이 모두 열린다.
- 코드 탭이 의도한 엔트리 파일을 보여준다.
- QR 원문은 `lynx://`가 아닌 직접 접근 가능한 `.lynx.bundle` URL이다.
- Explorer 버튼은 bundle URL을 인코딩한 `lynx://open` 딥 링크다.
- 네이티브 전용 동작의 콜아웃이 관련 예제 바로 아래에 있다.
- `false`, `null`, `0`, 빈 문자열 같은 상태 값이 의도대로 보인다.

## 실기기 확인

문구나 코드 노출만 바뀌고 네이티브 동작이 달라지지 않았다면 실기기 확인을 의무로 요구하지 않는다. WebLynx에서 확인한 범위만 보고한다.

네이티브 결과를 새로 주장하거나 예제 동작이 달라졌다면 [`seed-verify-lynx-example`](../../seed-verify-lynx-example/SKILL.md)을 사용한다. 정확한 예제 ID로 얻은 entry, manifest, native bundle과 실제 런타임 근거를 작업 결과에 연결한다. 기기나 기존 session이 없으면 환경 차단으로 보고하며 문서용 우회 구현을 추가하지 않는다.

## 임시 산출물 정리

진단 중 임시 파일이나 서버를 만들었다면 완료 전에 다음을 확인한다.

- 임시 파일을 제거하고 임시 서버를 종료한다.
- `git status --short`로 임시 산출물이 남지 않았는지 확인한다.
- 최종 보고에서 실제 검증에 사용한 환경과 폐기한 실험 환경을 구분한다.

## 완료 보고

다음을 짧게 구분해 보고한다.

1. 작성하거나 수정한 문서와 예제
2. 웹 미리보기에서 확인한 항목
3. resolver로 확인한 entry, 매니페스트, web·native bundle 상태
4. QR의 직접 bundle URL과 Explorer 버튼의 `lynx://open` 주소 확인 여부
5. 실제 Lynx 동작을 주장한 경우 `seed-verify-lynx-example`의 client, session, 직접 확인한 근거. 수행하지 못했다면 환경 차단 사유
6. 실행한 테스트와 결과
7. 문서 미리보기의 알려진 제한 또는 별도 컴포넌트 작업이 필요한 문제

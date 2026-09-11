# FetchBundle CSS HMR 임시 패치

대상은 `@lynx-js/css-extract-webpack-plugin@0.10.1`이다.
루트 `package.json`과 `bun.lock`의 `patchedDependencies`로 등록하며,
이 워크트리에서 `bun install`할 때 적용된다.

FetchBundle은 lazy bundle의 스타일시트를 adopt하지만 `TemplateEntry`는 등록하지 않는다.
현재 PlayLynx의 CSS 교체 API는 `TemplateEntry`를 요구하므로 lazy bundle의 URL을
전달하면 네이티브 크래시가 발생할 수 있다. 이 패치는 다음과 같이 처리한다.

- 갱신 대상에 로드된 FetchBundle lazy bundle이 있으면 기존 DevTool의 `Page.reload`를 한 번 호출한다.
- 아직 로드하지 않은 chunk는 갱신하지 않는다.
- 메인 entry만 갱신하거나 QueryComponent를 사용하는 경우에는 기존 CSS HMR을 유지한다.

Card reload 시 화면의 런타임 상태는 초기화된다. 네이티브 DevTool의 reload API가
없거나 실패하면 기존 오류 로그를 확인하고 수동으로 reload해야 한다.
`REACT_LAZY_BUNDLE_FETCHER=QueryComponent` 우회 설정은 필요하지 않다.
이미 실행 중인 Rspeedy는 패치 적용 후 재시작하고 Card도 다시 열어야 한다.

회귀 검사는 `bun test scripts/lynx-css-hmr.test.ts`로 실행한다.
업스트림에서 FetchBundle의 CSS HMR을 지원하면 이 패치와 회귀 검사를 재검토한다.

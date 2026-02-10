# packages

## 디렉토리 개요

SEED Design의 핵심 패키지들이 위치하며, 디자인 토큰 정의부터 스타일 생성, React 컴포넌트 제공까지의 전체 흐름을 구성한다. 하위 패키지별 상세 규칙은 각 패키지의 `AGENTS.md`를 우선 적용한다.

## 파일 작성 컨벤션

- 패키지 단위로 책임을 분리하고, 공개 진입점은 각 패키지의 엔트리 파일을 통해 노출한다.
- 자동 생성 경로(`css/vars`, `css/recipes`, `qvism-preset/src/vars`)는 출력물로 취급하고 직접 수정하지 않는다.
- 패키지 문서(`README.md`, `AGENTS.md`)는 실제 코드/스크립트 기준으로만 갱신한다.

## 코드 작성 컨벤션

- 패키지 의존 흐름은 `rootage -> qvism-preset/css -> react-headless -> react`를 기본으로 유지한다.
- 토큰/레시피/스타일 변경은 source 패키지를 수정한 뒤 `bun generate:all`로 결과물을 재생성한다.
- 교차 패키지 import는 내부 경로 대신 공개 엔트리포인트를 우선 사용한다.

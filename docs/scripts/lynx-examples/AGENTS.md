# Lynx 예제 도구

## 디렉토리 개요

`docs/examples/lynx`의 ReactLynx entry를 찾고 Rspeedy로 빌드해 `public/__lynx__`에 게시합니다. WebLynx 미리보기와 native Lynx 실행 파일은 하나의 manifest로 관리합니다.

## 파일 작성 컨벤션

- 실행 진입점은 `build.ts`, `watch.ts`, `prepare-workspace.ts`에만 둡니다.
- 재사용 로직은 역할에 따라 `discovery.ts`, `manifest.ts`, `workspace.ts`처럼 나누고 테스트를 같은 이름으로 배치합니다.
- 경로와 schema 버전, 도구 버전은 `constants.ts`에서만 선언합니다.

## 코드 작성 컨벤션

- production과 development 빌드는 `buildLynxExamples`를 공유합니다.
- 파일 시스템 함수는 테스트에서 임시 디렉터리를 전달할 수 있도록 기본 경로를 인자로 노출합니다.
- 오류에는 문제가 발생한 논리 ID나 실제 경로를 포함합니다.
- manifest는 bundle 검증과 복사가 끝난 뒤 rename으로 교체합니다.

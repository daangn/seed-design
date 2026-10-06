# AGENTS.md

## 디렉토리 개요

SEED Design의 React v1.0 유지보수 브랜치다. 배포 절차는 [RELEASING.md](RELEASING.md)를 따른다.

## 파일 작성 컨벤션

기존 파일 구조와 네이밍을 따른다. 배포 문서는 이 브랜치의 절차만 관리한다.

## 코드 작성 컨벤션

기존 import·export 패턴을 유지하고 패키지 명령은 Bun으로 실행한다.

백포트·버전 준비·npm 배포 전에는 [React v1.0 배포 가이드](RELEASING.md)를 읽는다. `--tag react-v1.0`를 명시하고 기존 `latest`를 유지한다.

# React v1.2 npm 배포

소스는 `react/v1.2`, npm 태그는 **`react-v1.2`**다. 함께 배포하는 패키지에 같은 태그를 사용하고 기존 `latest`와 `backport`는 유지한다.

## 준비

1. 최신 `react/v1.2`에서 백포트와 changeset을 준비한다. 호환되는 수정이 공개된 headless 패키지에 있으면 해당 버전을 사용한다.
2. `bun changeset status --since origin/react/v1.2`로 릴리스 범위를 확인하고 `bun version`으로 버전·changelog·lockfile을 갱신한다. CSS 변경으로 Figma·MCP도 갱신될 수 있다.
3. 아래 검증 후 릴리스 PR을 `react/v1.2`에 머지한다. 생성물 diff와 배포 대상의 `publint`·pack 결과도 확인한다.

```sh
bun packages:build
bun generate:all
bun test:all
bun publint packages/react
bun publint packages/css
# 배포 대상 패키지 디렉토리마다 실행
bun pm pack --dry-run --ignore-scripts
```

## 배포

머지된 소스에서 빌드를 확인하고 `bun pm whoami`로 인증을 확인한다. 전체 public workspace의 미배포 버전이 승인된 릴리스 범위와 같은지 확인한다. Changesets는 마지막 changeset 외의 미배포 패키지도 배포할 수 있다.

```sh
bun packages:build
bun changeset publish --tag react-v1.2
```

**태그 없는 `bun release`·`bun changeset publish`는 사용하지 않는다.** `latest`가 바뀔 수 있다. 이 브랜치에 머지하는 것만으로 npm 배포가 실행되지는 않는다.

## 확인

각 패키지의 새 버전·`dist.integrity`와 `react-v1.2` 태그를 npm에서 조회한다. `latest`·`backport`가 배포 전과 같은지도 확인한다.

일부만 성공하면 같은 소스·버전·태그로 미배포 패키지만 재시도한다. 이번 릴리스가 생성한 Git 태그만 확인해 push한다.

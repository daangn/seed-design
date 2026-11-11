# 문서 빌드 캐시

문서 프리뷰와 Production 빌드는 이 액션으로 `docs/.cache/lynx-rspeedy`, `docs/.cache/fumadocs-typescript`, `docs/.cache/astro`(렌더링한 페이지)를 복원한다. 경로마다 무효화 기준이 달라 archive와 namespace를 따로 둔다. 한쪽 key가 정확히 일치해 저장 단계가 생략되어도 다른 쪽은 독립적으로 저장된다.

Lynx Rspeedy namespace는 운영체제, 의존성, Lynx 빌드 설정의 해시로 구성한다. 일반적인 문서와 패키지 소스는 해시에서 제외한다. 해당 변경은 Rspack persistent cache의 의존성 추적에 맡겨 영향받은 작업만 다시 실행한다. Fumadocs namespace는 의존성과 TypeScript 및 타입 테이블 생성 설정을 포함한다. Fumadocs 자체 캐시는 입력 파일 내용과 패키지 버전으로 항목을 무효화한다.

Figma 이미지 캐시(`docs/.cache/figma-image`)는 각 workflow가 직접 복원·저장한다.

## 복원 순서

GitHub Actions는 현재 브랜치에서 primary key와 restore key를 차례로 찾고, 없으면 기본 브랜치에서 같은 검색을 반복한다.

1. 현재 브랜치의 동일한 primary key
2. 기본 브랜치 `dev`의 호환 가능한 최신 캐시

따라서 새 기능 브랜치의 첫 Alpha 빌드는 현재 브랜치 캐시가 없을 때 `dev`의 최신 호환 캐시를 복원한다.

## 갱신과 보존량

GitHub Actions 캐시는 같은 key의 내용을 갱신할 수 없다. Production 빌드는 SHA를 세대로 사용해 `dev`의 최신 증분 상태를 계속 발행한다. Alpha 빌드는 `baseline`이라는 고정 세대를 사용해 기능 브랜치마다 호환성 namespace당 하나만 저장한다. 후속 push는 그 캐시를 exact hit로 계속 사용하므로 매 SHA마다 캐시를 추가하지 않는다.

이 방식은 Alpha 캐시의 기준점이 첫 성공 빌드 상태로 고정되는 절충이 있다. Rspack이 이후 소스 차이를 증분 처리하지만, 오래 유지된 기능 브랜치는 최신 빌드 결과를 다시 저장하지 않는다. 의존성이나 빌드 설정이 바뀌면 호환성 해시가 달라져 새 기준 캐시를 만든다. GitHub의 기본 저장 용량과 eviction 정책에 맡기며, 이 액션에서 외부 캐시를 삭제하지 않는다.

## Fumadocs 타입 캐시

Fumadocs 타입 캐시는 `docs/components/type-table/generator.ts`가 `.cache/fumadocs-typescript`에 쓴다. 별도 Fumadocs archive는 의존성, TypeScript 설정, 타입 테이블 generator와 Fumadocs 설정이 같을 때만 재사용한다.

## Astro 페이지 캐시

두 workflow는 `SEED_DOCS_INCREMENTAL_BUILD=1`로 Astro의 `experimental.incrementalBuild`를 켠다. Astro는 `docs/.cache/astro`에 렌더링한 HTML과 manifest를 두고, 다음 빌드에서 안 바뀐 페이지는 렌더링하지 않고 복사한다. 번들링과 MDX 컴파일은 매번 다시 한다.

페이지를 재사용할지는 두 가지로 정한다.

- Astro가 계산하는 해시: 설정, lockfile, route와 컴파일된 MDX의 모듈 그래프
- `docs/lib/incremental-build.ts`가 만드는 `cacheKey`: 모듈 그래프 밖에서 렌더링 때 읽는 입력. 렌더링에 쓰일 수 있는 추적 파일(`docs/content`와 `.changeset`·`.github` 같은 운영 경로를 뺀 전부), 모든 문서의 frontmatter와 page tree, Lynx 예제 manifest, Sanity의 컴포넌트 상태, 문서의 Git 수정일이다.

그래서 문서 본문만 고친 push는 그 문서만 다시 렌더링하고, 코드·의존성·frontmatter가 바뀐 push는 전부 다시 렌더링한다. 두 workflow가 `fetch-depth: 0`과 `filter: blob:none`으로 checkout하는 것도 이 때문이다. 얕은 clone에서는 모든 문서의 수정일이 배포 커밋 시각이 되어 커밋마다 모든 페이지가 바뀐다. 커밋되지 않은 변경이 있으면 캐시를 쓰지 않고 로그에 `[incremental-build]` 경고를 남긴다. 빌드 요약의 `Astro pages restored from cache`가 복원한 페이지 수다.

이 캐시에는 호환성 해시가 없다. 맞지 않는 캐시는 Astro가 걸러 내고 페이지를 다시 렌더링한다. 저장과 복원 순서는 다른 캐시와 같다. Production은 SHA마다 저장하고, 기능 브랜치는 `baseline` 하나를 저장하며 없으면 `dev`의 최신 캐시를 복원한다.

배포된 페이지가 낡아 보이면 workflow를 `skip-page-cache`로 수동 실행한다. 그 실행은 모든 페이지를 렌더링한다. 원인이 캐시 키에 빠진 입력이면 `docs/lib/incremental-build.ts`에 추가한다.

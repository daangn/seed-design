# 문서 빌드 캐시

문서 프리뷰와 Production 빌드는 이 액션으로 `docs/.cache/lynx-rspeedy`와 `docs/.cache/fumadocs-typescript`를 복원한다. 두 경로는 무효화 기준이 달라 archive와 namespace를 따로 둔다. 한쪽 key가 정확히 일치해 저장 단계가 생략되어도 다른 쪽은 독립적으로 저장된다.

Lynx Rspeedy namespace는 운영체제, 의존성, Lynx 빌드 설정의 해시로 구성한다. 일반적인 문서와 패키지 소스는 해시에서 제외한다. 해당 변경은 Rspack persistent cache의 의존성 추적에 맡겨 영향받은 작업만 다시 실행한다. Fumadocs namespace는 의존성과 TypeScript 및 타입 테이블 생성 설정을 포함한다. Fumadocs 자체 캐시는 입력 파일 내용과 패키지 버전으로 항목을 무효화한다.

Astro·Vite가 `docs/.astro`와 `docs/node_modules` 아래에 만드는 빌드 캐시는 복원하지 않는다. 커밋 사이에 재사용해도 안전한지 확인하지 않았다. Figma 이미지 캐시(`docs/.cache/figma-image`)는 각 workflow가 직접 복원·저장한다.

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

---
id: retired-package-rebase
description: 오래된 패키지 이동·archive·삭제 PR을 최신 release lane으로 rebase할 때 읽는다. 이동 이후 추가된 파일과 현재 공개 진입점을 확인해 파일 누락이나 잘못된 마이그레이션 안내를 막고, changeset 도구가 중간 이동 경로를 찾는 경우 최종 diff로 판정하는 절차를 다룬다.
scope: ["packages/**", ".changeset/**", "docs/**", "skills/seed-change/**"]
status: active
related: ["public-api-change-notes", "resolve-paths-from-manifests"]
---

# 오래된 패키지 이동 PR은 새 파일과 대체 진입점을 확인한다

## 교훈과 다음 행동

- file location 충돌은 기준 브랜치에서 원래 디렉터리에 새로 추가된 파일을 확인해 해결한다. 최종 삭제가 목적이면 이동 이후 생긴 README도 삭제 범위에 포함한다.
- 대체 API는 실제 소유 패키지의 소스와 빌드된 공개 진입점에서 확인한다. Headless Avatar의 대체는 `@seed-design/react-image`의 `Image`·`useImageContext`다.

- 제거 API 역시 기존 공개 진입점에서 확인한다. Avatar 컴포넌트와 useAvatarContext는 공개됐지만 내부 useAvatar 훅은 재수출되지 않아 제거 안내 대상이 아니었다.

- 이동 후 삭제한 중간 경로 때문에 changeset 계획이 실패하면 승인된 최종 삭제를 로컬 커밋한 뒤 기준 브랜치와의 net diff로 다시 실행한다. 사라질 manifest를 복원하거나 archive 제외 정책을 약화하지 않는다.

## 발생 근거와 적용 조건

- 오래된 Avatar archive PR을 major로 rebase할 때 새 README가 file location 충돌을 일으켰다. changeset은 Image를 재수출하지 않는 `@seed-design/react/primitive`를 대체 진입점으로 안내해 소비자 코드가 빌드되지 않는 상태였다.

- archive 이동 뒤 삭제를 커밋하기 전에 계획을 실행하자 기준·최종 트리 모두에 없는 packages/archive/avatar manifest를 찾다가 `삭제된 workspace package 근거를 찾지 못했습니다`로 멈췄다. 최종 diff를 기준으로 실행해 해결했다.

## 변경 이력

- 2026-09-29: #1894 rebase에서 원문 commit `f90da67fa`의 교훈을 새 구조로 이관했다. 이관 과정에서 실행 재검증하지 않았다.
- 2026-09-29: 원문 commit `66a655500`의 공개 export 확인 근거를 반영했다.
- 2026-09-29: 원문 commit `b13e5725c`의 중간 경로와 최종 diff 판정 근거를 병합했다.

---
id: resolve-paths-from-manifests
description: SEED의 export·primitives 이름으로 workspace 경로를 추측하거나, tsconfig extends의 상대 경로와 직접 소비 패키지를 추적할 때 읽는다. 재수출과 독립 패키지를 구분하고 manifest 위치를 기준으로 경로·의존 관계를 확인하는 방법을 다룬다.
scope: ["**"]
status: active
---

# 패키지와 설정 경로는 파일 목록으로 확인한다

## 교훈과 다음 행동

- 파일 목록과 manifest에서 경로를 확인하고 상대 경로는 선언한 파일의 디렉터리에서 해석한다.
- `git ls-files '*package.json' '*tsconfig*'`로 파일을 찾고 `git grep -l '"@seed-design/react-drawer"' -- '*/package.json'`으로 직접 소비 패키지를 확인한다.

## 발생 근거와 적용 조건

- 상황: React의 primitives 재수출을 별도 workspace로 가정하고 존재하지 않는 package.json을 읽었다. Drawer tsconfig의 상대 extends 경로도 기준 디렉터리를 잘못 계산했다.
- 영향: 불필요한 파일 조회가 실패했고 영향 패키지와 검증 설정 확인이 늦어졌다.
- 피할 패턴: export 이름으로 패키지 디렉터리를 추측하거나 상대 경로를 저장소 루트 기준으로 해석하는 것.
- 위험: 실제 배포 단위와 의존 관계를 잘못 판단하거나 유효한 TypeScript 설정을 놓친다.

## 변경 이력

- 2026-09-28: `AGENT_LEARNINGS.md`의 같은 제목 항목을 이관했다(원문 commit `cecc3eac1f0a64930788f1606571246614a631e7`). 기존 근거를 보존했으며 이관 과정에서 재검증하지 않았다.
- 2026-09-28: frontmatter만으로 읽기 대상을 고를 수 있도록 대상·적용 조건·본문에서 다루는 판단을 보강했다. 실행 재검증은 하지 않았다.

# tools/extract-api-surface

## 디렉토리 개요

public workspace 패키지의 공개 API 표면을 추출하고, 저장된 두 표면의 diff와 PR 코멘트 본문을 만드는 CLI다. 사용법과 출력 규칙은 `README.md`를 따른다.

## 파일 작성 컨벤션

- 실행 진입점은 `src/cli.ts` 하나다. 인자 해석과 파일 입출력만 두고 추출·비교·코멘트 생성은 모듈로 분리한다.
- 테스트는 대응하는 구현 옆에 `*.test.ts`로 둔다.

## 코드 작성 컨벤션

- CLI는 git과 checkout을 다루지 않는다. 비교할 시점은 호출하는 쪽(CI workflow, 로컬 사용자)이 준비하고 `--root`로 넘긴다.
- `typescript`는 루트 devDependency를 사용한다. 추출은 소스만 읽으며 패키지 빌드를 요구하지 않는다.
- 출력은 두 시점을 같은 순서로 정렬해야 diff가 의미를 가진다. export·멤버·패키지는 이름순으로 정렬하고, union 멤버는 출력 전에 정렬한다.
- 렌더링 형식을 바꾸면 모든 PR의 diff가 형식 변화로 채워진다. CI는 base와 head를 PR 쪽 CLI 하나로 추출하므로 형식 변경 PR 자체의 diff는 비지만, 그 PR에서 전체 출력 차이를 직접 확인한다.
- 테스트는 실제 저장소 패키지가 아니라 임시 디렉터리에 만든 fixture 모노레포를 입력으로 쓰고, 렌더링 결과와 diff는 전체 일치로 검증한다.

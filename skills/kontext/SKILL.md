# Kontext

모노레포 의존성 그래프를 탐색하고, 변경 영향 범위를 파악한다.

## 사용 시점

- 파일을 수정하기 전: 어떤 파일이 영향받는지 미리 확인
- 작업 완료 후: 빠뜨린 파일이 없는지 검증
- 주기적으로: `kontext lint`로 미선언 관계 발견

## 명령어

```bash
# 특정 파일의 영향 범위 조회
bun ecosystem/kontext/cli/bin/kontext.mjs deps <파일경로>
bun ecosystem/kontext/cli/bin/kontext.mjs deps <파일경로> --json

# 전체 완전성 검증
bun ecosystem/kontext/cli/bin/kontext.mjs check

# git 이력에서 미선언 관계 발견
bun ecosystem/kontext/cli/bin/kontext.mjs lint

# 그래프 재구축
bun ecosystem/kontext/cli/bin/kontext.mjs build

# 대시보드
bun ecosystem/kontext/cli/bin/kontext.mjs serve
```

## kontext.yaml 수정

각 패키지의 `kontext.yaml`에 관계를 추가/수정할 수 있다. 스키마는 `references/yaml-schema.md` 참고.

## 참조 파일

- `references/yaml-schema.md`

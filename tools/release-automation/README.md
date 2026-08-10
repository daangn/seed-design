# Release Automation

SEED Design의 `dev`, `minor`, `major` 패키지 릴리즈 파이프라인을 검증하고 실행하는 private 도구다.

| branch | version policy | npm tag |
| --- | --- | --- |
| `dev` | patch stable | `latest` |
| `minor` | minor beta | `beta` |
| `major` | major beta | `beta` |

일상 개발자는 `dev` PR에 changeset을 포함하면 된다. 레인 동기화, Version Packages PR 생성, 게시와 알림은 GitHub Actions가 수행한다. stable 승격과 prerelease 상태 전환은 초기 운영 범위에 포함하지 않는다.

## 로컬 검증

저장소 루트에서 다음 명령을 실행한다.

```sh
bun release:doctor
bun release:verify
```

- `release:doctor`: credential과 production write 없이 현재 릴리즈 상태를 진단한다.
- `release:verify`: CI와 같은 build, test, package dry-run 검증을 수행한다.

사람이 수행하는 레인 운영과 장애 복구 절차는 루트 [`RELEASING.md`](../../RELEASING.md)를, 내부 도메인과 권한 경계는 [`TECH.md`](./TECH.md)를 따른다.

운영 mode는 `dev`에서 **Release automation activation** workflow가 만든 PR로만 바꾼다. `enable-dry-run`은 이후 authorize되는 run의 package·tag·Rootage write를 멈추되 기존 sync와 readiness 상태를 보존하고, `enable-production`은 사전 조건을 다시 검증한 뒤 write를 재개한다. 이미 실행 중인 production run은 별도로 종료해야 한다.

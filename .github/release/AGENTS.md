# .github/release

## 디렉토리 개요

`dev`·`minor`·`major` 릴리즈 레인의 정적 설정과 중앙 운영 상태를 관리한다. 실제 판단과 변경 로직은 `scripts/release`에 두고 GitHub Actions가 이 설정을 읽어 실행한다.

## 파일 작성 컨벤션

- JSON 설정 파일은 `schemaVersion`과 로컬 `$schema` 참조를 포함한다. 대응하는 `*.schema.json`은 Draft 2020-12로 작성하고 모든 객체에 `additionalProperties: false`를 둔다.
- 설정 구조를 변경할 때 TypeScript 타입, 런타임 파서, JSON Schema, 테스트를 함께 갱신한다.
- `lanes.json`에는 레인의 불변 정책을, `control.json`에는 PR을 통해 변경하는 운영 상태만 둔다.
- branch·package별 중복 설정 파일을 추가하지 않고 세 레인의 차이는 `lanes` map으로 표현한다.

## 코드 작성 컨벤션

- 일반 PR은 `control.json`, `.changeset/config.json`, `.changeset/pre.json`을 변경하지 않는다.
- production 활성화와 freeze를 포함한 상태 변경은 반드시 자동화가 만든 PR로 반영한다.
- DES-2201 계약이 준비되지 않은 상태에서는 `mode`를 `production`으로 변경하지 않는다.

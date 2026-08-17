# Component Guidelines

컴포넌트 사용이 현재 공통 디자인 가이드라인에 맞는지 판정합니다. category: `components`. 기본 severity는 `warn`, 실제 동작이 깨지는 위반은 `error`, 교체 기회는 `info`입니다.

판정 기준과 플랫폼 지원 목록은 이 파일에 두지 않습니다. 실행할 때 전체 문서 인덱스가 연결한 Components 인덱스와 개별 문서에서 도출합니다.

## 적용 조건

현재 Components 인덱스에 가이드라인 문서가 있고, 코드에서 그 컴포넌트를 사용하거나 같은 역할을 직접 구현한 증거가 있을 때 컴포넌트별로 적용합니다. 공통 문서와 선택된 플랫폼 구현을 연결할 수 없으면 다른 플랫폼 자료로 대체하지 않고 `not-applicable`로 남깁니다.

## 문서·구현 연결

1. 문서 풀의 전체 인덱스에서 현재 Components 진입점을 찾습니다.
2. Components 인덱스에서 컴포넌트 문서를 찾고, 인덱스가 제공한 raw URL을 읽습니다.
3. 공통 문서의 Platform 표 → 문서 풀의 플랫폼 인덱스 → 플랫폼 registry 전체 인덱스 → 재export를 따라간 설치본 package exports 순으로 실제 구현·registry id를 찾습니다.
4. id 매핑과 지원 컴포넌트 목록을 룰이나 프로필에 유지하지 않습니다. 빈 문서·낡은 링크·문서 충돌은 `doc-conflict` 근거로 남깁니다.

## 대상 선정

- 패키지·스니펫 import와 컴포넌트 식별자를 후보로 모읍니다. 여러 이름이 겹치면 가장 구체적인 식별자를 우선하고 하위 파츠는 소유 컴포넌트로 판정합니다.
- 파일명만 믿지 않고 스니펫의 `@file` metadata, 공통 Platform 표, 플랫폼 인덱스를 함께 사용합니다.
- SEED와 같은 역할을 직접 구현한 코드도 포함합니다. 이름이 아니라 렌더되는 UI 역할로 확인하며, 전수 확인하지 못했다면 실제로 본 범위를 보고합니다.
- 재구현을 지적하기 전에 대상 설치본 package exports와 해당 세대 registry를 확인합니다. 현재 공식 문서가 세대 registry를 제공하지 않으면 최신 registry로 과거 설치본을 추측하지 않고 확인 한계를 evidence에 남깁니다.
- 연결 실패와 아이템 부재를 구분합니다. registry에 없다는 이유만으로 package export도 없다고 판단하지 않습니다.

설치본과 최신 제공 여부에 따른 판정은 다음 원칙만 유지합니다.

- 설치본과 현재 공식 제공처 모두 없음: finding 없음
- 설치본에는 없고 현재 공식 제공처에는 있음: 교체 기회 `info`
- 설치본에 이미 같은 역할의 구현이 있음: 재구현 `warn`

역할이 다르거나 증거가 부족한 후보는 `rejected`에 이유를 남깁니다.

## 판정 기준 도출

가이드라인 문서를 raw로 읽고 기계 수집과 판단 보충을 분리합니다.

### 1단계: 기계 수집

1. 문서 전체의 Do/Don't `body="…"` 속성을 수집하되 주석 처리된 블록은 제외합니다.
2. Guidelines 또는 Usage 절의 볼드 문장 중 문장형 규칙을 수집합니다.
3. 문서 등장 순서대로 `{docId}.dont-N`, `{docId}.do-N`, `{docId}.rule-N` id를 붙입니다.
4. 수집한 항목 전부를 `verdicts`에 남기고 개수를 `coverage.expected`로 기록합니다. 0건도 정상입니다.

기계 수집 항목이 허용문·라벨·예시 해설이면 `pass`와 그 이유를 기록하고, 임계값이 없으면 `unknown: no-threshold`로 남깁니다. 후보를 임의로 버려 coverage를 줄이지 않습니다.

### 2단계: 판단 보충

문서의 Guidelines·Usage·Properties에서 위반이 성립하는 명시적 규범을 추가로 도출합니다. 허용문과 Figma 전용 팁은 제외하고, 도출 개수를 `coverage.derived`로 기록합니다.

## verdict 규칙

- 코드와 문서로 충족을 확인하면 `pass`, 위반을 확인하면 `fail`입니다.
- 문서에 임계값이 없으면 `unknown: no-threshold`입니다.
- 런타임 데이터에 따라 달라지면 `unknown: runtime-dependent`, 코드 밖 정보면 `unknown: not-in-code`입니다.
- 공식 문서끼리 충돌하거나 두 가지로 읽히면 `unknown: doc-conflict`입니다.
- 문서·도구 접근 실패는 `not-verified`입니다.
- 조건이 성립하지 않음을 코드로 확인하면 `pass`지만, 조건이 성립할 때 구조적으로 지킬 방법이 없으면 `fail`입니다.

`coverage.expected != coverage.judged`면 실행 결함입니다. 같은 기준의 공유 원인과 조치가 하나면 finding 하나와 `files[]`로 묶습니다.

## 중복 경계

deprecated 대상은 [no-deprecated-component](./no-deprecated-component.md), 패키지 호환은 [package-compatibility](./package-compatibility.md), 토큰 공개성은 [foundation-contract](./foundation-contract.md)가 소유합니다.

## 문서 풀에서 사용할 근거

- 전체 인덱스가 현재 연결한 Components 인덱스와 개별 가이드라인
- 선택된 플랫폼 인덱스가 현재 연결한 구현 문서
- 선택된 플랫폼의 registry와 대상 설치본 package exports

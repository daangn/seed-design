# React Doctor 프로필

`references/doctor.md`가 React 워크스페이스를 진단할 때 사용하는 라우팅 프로필입니다. 현재 지원 범위나 문서 목록을 이 파일에 복제하지 않습니다.

## 고정 진입점

- React 문서 인덱스: `https://seed-design.io/react/llms.txt`
- registry namespace: `react`
- 플랫폼 판별 후보: `@seed-design/react`, `@seed-design/css`와 React 앱 의존성

전체 문서 인덱스는 공통 Doctor 절차가 제공합니다. 이 프로필은 React 진입점을 문서 풀에 등록하며 이미 로드된 URL을 다시 읽지 않습니다. 패키지 이름은 플랫폼 후보를 찾기 위한 앵커입니다. 구현·스타일·선택 패키지의 실제 역할과 호환 범위는 현재 인덱스가 연결한 설치·업그레이드 문서와 설치본 `package.json`에서 확정합니다.

## 문서 발견

1. 문서 풀의 전체 인덱스에서 공통 Components·Foundations·Design Guidelines와 React 진입점을 찾습니다.
2. 문서 풀의 React 인덱스에서 요청한 룰과 의미가 맞는 문서를 찾습니다. 제목이나 category가 바뀔 수 있으므로 고정 경로를 조합하지 않습니다.
3. 문서 풀에 없는 leaf만 읽고 그 실행에서만 capability와 판정 기준을 구성합니다.
4. 리포트 `references`에는 React 인덱스와 실제로 읽은 leaf 문서를 함께 기록합니다.

React 인덱스를 정상적으로 읽었는데 필요한 공식 계약이 없으면 해당 check를 `not-applicable`로 두고 인덱스 부재를 이유로 남깁니다. 인덱스나 연결 문서를 읽지 못했으면 `not-verified`입니다. 과거에 문서가 있었거나 없었다는 기억으로 상태를 고정하지 않습니다.

## 컴포넌트·registry 연결

공통 컴포넌트 문서의 Platform 표 → React 인덱스 → React registry 전체 인덱스 → 재export를 따라간 설치본 package exports 순으로 실제 구현·registry id를 찾습니다. id 매핑 목록을 이 프로필에 유지하지 않습니다.

registry URL 구조는 공통 Doctor 절차의 형식을 사용하되, 아이템·세대의 존재 여부는 현재 registry와 인덱스 응답으로 확인합니다. 연결 실패를 아이템 부재로 바꾸지 않습니다.

## 적용 원칙

- 일반 진단의 룰 목록과 category는 [doctor.md](doctor.md)와 `SKILL.md`를 단일 원천으로 사용합니다.
- 설치 방식, 업그레이드 경계, deprecation, Library Authors 계약은 React 인덱스가 현재 연결한 문서에서만 가져옵니다.
- Lynx 문서로 React 문서의 빈칸을 채우지 않습니다.
- 패키지 metadata와 공식 문서가 충돌하면 둘 다 evidence에 남기고 임의로 합의하지 않습니다.

# docs/examples/react

## 디렉토리 개요

React 문서 페이지에 포함되는 사용 예시를 관리하는 디렉토리다. snippet API를 보여주는 예시와, arbitrary content나 조합 가능성을 시연하는 예시를 구분해서 작성한다.

## 파일 작성 컨벤션

- 파일명은 예시 시나리오를 설명하는 `kebab-case`를 사용한다.
- 예시 하나는 하나의 핵심 메시지만 보여주고, 서로 다른 메시지는 파일을 분리한다.
- 시각적 정합성이 중요한 예시는 관련 reference(Figma, prototype, guideline)를 확인한 뒤 이름과 구성을 정한다.

## 코드 작성 컨벤션

- 예시를 쓰기 전에 먼저 목적을 정한다: `recommended composition`인지, `arbitrary content 가능성 시연`인지.
- recommended composition 예시는 SEED primitives와 system component를 우선 사용한다.
- arbitrary content 가능성을 보여주는 예시는 raw HTML이나 간단한 inline 구조도 허용한다.
- visual fidelity가 중요한 예시는 prototype이나 guideline과의 alignment를 확인하고 icon style, spacing, tone을 맞춘다.

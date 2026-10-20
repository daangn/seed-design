# BottomSheet engine

`@lynx-js/lynx-ui-sheet@3.133.1`의 소스를 내부화했다. 원본은
[lynx-family/lynx-ui](https://github.com/lynx-family/lynx-ui)이며 Apache-2.0 라이선스와
각 파일의 저작권 고지를 유지한다. 패키지의 `LICENSE`·`NOTICE`를 함께 배포한다.

2026-10-20에 upstream `727509931c4e4f190d9ea357f67c6b862fc43011`의
`packages/lynx-ui-sheet/src`와 비교했다. 타입 문서를 제외한 17개 파일은 설치된 소스와 동일했고,
`types/index.docs.ts`만 달랐다. 공개 API 호환성을 위해 설치된 버전의 타입을 유지했다.

내부화 단계에서는 workspace의 선언 파일 생성에 필요한 타입 표기와 style 타입 호환만
조정했다. Overlay·Presence·Motion은 기존 외부 구현을 사용한다. 이 디렉터리는 패키지의
공개 export가 아니며 소비자는 기존 `BottomSheet` API를 사용한다.

SEED 수정:

- 배경 농도를 매 프레임 최신 레이아웃 높이로 나누지 않고, snap·close·drag 시작 시
  현재 위치·농도에서 목표까지의 관계를 고정한다. 레이아웃 변경만으로 농도가 바뀌지 않는다.
- 부분 snap의 농도 정책은 유지한다. 다음 명시적 snap은 그 시점의 크기로 목표 농도를 정한다.
- 레이아웃 변경에 따른 자동 위치 보정은 추가하지 않는다. 기존 위치·gesture 동작을 유지한다.
- 측정 대기 중 `animate: false`를 보존하고, 닫기·드래그·새 전환이 이전 대기 및 완료 콜백을
  무효화하도록 한다.

upstream을 갱신할 때는 공개 타입, 위 수정, 실제 main-thread 동작을 따로 비교한다.
엔진 회귀 테스트는 `hooks/useSnap.test.tsx`, SEED API 계약은 `../BottomSheet.test.tsx`에 둔다.

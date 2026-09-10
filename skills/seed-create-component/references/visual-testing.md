# Visual Testing 가이드

## 적용 범위

렌더링·상호작용·시각 결과가 바뀐 표면만 실제로 연다. 문구나 비시각적 메타데이터만 바꾼 경우에는 이 절차를 추가하지 않는다. 변경한 플랫폼과 소비 경로에 맞는 서버 하나만 시작하고, 이미 실행 중인 사용자 서버는 재사용하거나 종료하지 않는다.

## 확인 경로

| 변경 표면 | 확인 경로 | 확인 내용 |
| --- | --- | --- |
| React 문서 예제 | docs 컴포넌트 페이지 | 렌더링과 바꾼 예제 동작 |
| React 실사용 조합 | 영향 받은 Stackflow Activity | 실제 앱 조합 결과 |
| Storybook story | 변경한 story와 영향 받은 theme·font-scale variant | 시각적 결과 |
| Lynx 문서 예제 | `LynxComponentExample` | 미리보기와 바꾼 상호작용 |
| Lynx 실제 동작 주장 | `examples/lynx-spa` 또는 사용 가능한 host app | native runtime 결과 |

브라우저는 실제 surface를 열어 바뀐 사용자 결과를 확인하고 닫는다. Lynx native 결과는 웹 미리보기와 합치지 않으며, 실행 환경이 없으면 미확인 범위와 이유를 보고한다.

## Figma 비교

디자인 일치가 요청되었거나 변경의 기준일 때만 비교한다. 불일치가 있으면 바뀐 Rootage·Recipe·예제 경로부터 원인을 좁히며, 관련 없는 레이어를 다시 검토하지 않는다.

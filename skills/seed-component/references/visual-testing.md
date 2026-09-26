# Visual Testing 가이드

1. 렌더링·상호작용·시각 결과가 바뀐 표면을 아래 [확인 경로](#확인-경로)에서 고른다. 문구나 비시각 메타데이터만 바꿨으면 이 절차를 건너뛴다.
2. 변경한 플랫폼과 소비 경로에 맞는 서버 하나만 시작한다. 사용자가 이미 띄운 서버가 있으면 종료하지 않는다 → 그대로 재사용한다.
3. 브라우저로 변경한 표면만 열어 바뀐 사용자 결과를 확인하고 닫는다.
4. 판정과 증거는 [관찰 가능한 결과 판정](verification-checklist.md#관찰-가능한-결과-판정)을 따른다. 실행 환경이 없으면 확인하지 못한 범위와 이유를 보고한다.

## 확인 경로

- React 문서 예제 → docs 컴포넌트 페이지에서 렌더링과 바꾼 예제 동작
- React 실사용 조합 → 영향받은 `examples/stackflow-spa` Activity에서 실제 앱 조합 결과
- Storybook story → 변경한 story와 영향받은 theme·font-scale story(`LightTheme`, `DarkTheme`, `FontScalingExtraSmall`, `FontScalingExtraExtraExtraLarge`)의 시각 결과
- Lynx 문서 변경 → MDX 페이지·`LynxComponentExample` host·코드 탭·QR·Web preview·docs build pipeline을 바꿨을 때만 실제 문서에서 바꾼 부분을 연다.
- Lynx 실제 동작 주장이나 런타임 동작 변경 → [검증 런북](../../seed-verify-lynx-component/references/verification.md)의 `examples/lynx-spa` 문서 예제에서 native runtime 결과

Lynx native 결과를 웹 미리보기 결과와 합쳐 판정하지 않는다 → native 결과는 `examples/lynx-spa`에서 따로 확인하고 SPA 예제 ID와 query를 포함한 bundle URL·변경본·환경 근거를 남긴다.

## Figma 비교

- 디자인 일치를 요청받았거나 디자인이 변경의 기준이다 → Figma와 비교한다. 그 밖에는 비교하지 않는다.
- 불일치가 있다 → 바꾼 Rootage·Recipe·예제 경로부터 원인을 좁힌다. 관련 없는 레이어는 다시 검토하지 않는다.

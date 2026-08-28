---
"@seed-design/react-scale-feedback": major
"@seed-design/react": patch
---

Scale Feedback에 필요한 React 유틸리티를 `@seed-design/react-scale-feedback` 패키지로 분리합니다.

- `@seed-design/react`에 의존하지 않는 패키지에서도 Scale Feedback을 적용할 수 있습니다.
- 새 패키지에서 `useScaleFeedback`과 `ScaleFeedback`을 가져올 수 있습니다.
- `@seed-design/react`의 기존 export는 그대로 유지되므로 코드를 고칠 필요가 없습니다.

---
"@seed-design/lynx-react": minor
---

(BREAKING CHANGE: `value`만 넘기면 이제 0–100 범위의 determinate로 표시됩니다. indeterminate로 표시하려면 `value`를 생략하세요.) `ProgressCircle`은 React처럼 `value`가 숫자면 determinate로 판정하고, `minValue`·`maxValue`의 기본값은 0과 100입니다. Registry AttachmentField·AttachmentDisplayField의 업로드 항목은 `progress`가 있으면 해당 진행률을 표시합니다. 범위를 벗어난 값은 빈 링이나 가득 찬 링으로 표시합니다.

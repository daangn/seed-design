---
"@seed-design/lynx-react-slider": patch
"@seed-design/lynx-react": patch
---

`@lynx-js/react` 0.126 미만에서 Slider·Select·Accordion이 갱신 한 번에 파트마다 따로 보내던 Main Thread 갱신을 한 번에 보내도록 줄입니다. Slider를 drag할 때 DevTool에 "CallLepusMethod called too frequently" 경고가 뜨던 문제를 고칩니다.

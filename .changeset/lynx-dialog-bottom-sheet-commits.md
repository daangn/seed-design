---
"@seed-design/lynx-react-dialog": patch
"@seed-design/lynx-react": patch
---

Dialog·AlertDialog가 열리고 닫히는 단계마다 Trigger·Positioner·Backdrop·Content·Action의 갱신을 따로 Main Thread commit으로 보내던 문제를 수정합니다. headless `DialogRoot`가 lynx-ui `DialogRoot`의 렌더링마다 `useDialogContext` 값을 새로 내려, 이 hook을 부르는 부품이 같은 commit에서 함께 갱신됩니다. 열기 한 번의 commit이 19회에서 7회로 줄며, 열림·닫힘 단계와 className은 이전과 같습니다. BottomSheet는 CloseButton이 mount된 뒤 바뀐 className을 Root와 시트에 한 commit으로 보내, mount commit이 3회에서 2회로 줄었습니다. BottomSheet·MenuSheet는 `@lynx-js/react` 0.126 미만에서 같은 props로 다시 렌더링될 때 스크롤 영역의 scroll gesture main-thread handler를 다시 보내지 않아, 빈 commit만 남습니다.

---
"@seed-design/lynx-css": minor
"@seed-design/lynx-react": minor
---

Lynx 입력 폼 컴포넌트를 추가합니다.

- `Field`, `TextField`, `KeyboardAvoidingScrollView`를 제공합니다.
- `TextField.Input`과 `TextField.Textarea`에서 native 입력, controlled value, grapheme 단위 글자 수 제한을 지원합니다.
- `TextField.Textarea`는 내용에 따른 자동 높이 조절을 지원합니다.
- `KeyboardAvoidingScrollView`는 focus된 입력과 Field footer가 키보드에 가려지지 않도록 스크롤합니다.
- `npx @seed-design/cli@latest add ui:text-field`로 조합된 snippet을 설치할 수 있습니다.

```tsx
<KeyboardAvoidingScrollView>
  <TextField label="소개" maxGraphemeCount={80}>
    <TextFieldTextarea accessibility-label="소개" />
  </TextField>
</KeyboardAvoidingScrollView>
```

# @daangn/emotion-react-theme

## Usage

```bash
yarn add @emotion/react @daangn/emotion-react-theme @daangn/design-token
```

```tsx
import { colors } from '@daangn/design-token';
import { DaangnThemeProvider } from '@daangn/emotion-react-theme';

// ...
<DaangnThemeProvider colors={colors.light}>
  <MyThemedComponent />
</DaangnThemeProvider>
```

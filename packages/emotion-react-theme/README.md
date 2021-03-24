# @daangn/emotion-react-theme

## Usage

### Installation

```bash
yarn add @emotion/react @daangn/emotion-react-theme @daangn/design-token
```

### Setup Provider

```tsx
import { colors } from '@daangn/design-token';
import { DaangnThemeProvider } from '@daangn/emotion-react-theme';

// ...
<DaangnThemeProvider colors={colors.light}>
  <MyThemedComponent />
</DaangnThemeProvider>
```

### Usage with `@emotion/styled`

```tsx
const Box = styled.div(props => ({
  color: props.theme.colors.carrot50,
  backgroundColor: props.theme.colors.carrot500,
}));
```

// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const semanticColors = {
  primary: theme.colors["bg-brand-solid"].computedValue,
  onPrimary: theme.colors["palette-static-white"].computedValue,
  primaryLow: theme.colors["palette-carrot-100"].computedValue,
  success: theme.colors["bg-positive-solid"].computedValue,
  warning: theme.colors["bg-warning-solid"].computedValue,
  danger: theme.colors["bg-critical-solid"].computedValue,
  paperDefault: theme.colors["bg-layer-default"].computedValue,
  paperContents: theme.colors["bg-layer-fill"].computedValue,
  paperDialog: theme.colors["bg-layer-floating"].computedValue,
  inkText: theme.colors["fg-neutral"].computedValue,
  inkTextLow: theme.colors["fg-neutral-subtle"].computedValue,
  divider1: theme.colors["stroke-neutral-muted"].computedValue,
  divider2: theme.colors["stroke-neutral"].computedValue,
  overlayDim: theme.colors["bg-overlay"].computedValue,
  accent: theme.colors["bg-informative-solid"].computedValue,
}

const scaleColors = {
  gray00: theme.colors["palette-gray-00"].computedValue,
  gray100: theme.colors["palette-gray-200"].computedValue,
  gray200: theme.colors["palette-gray-300"].computedValue,
  gray300: theme.colors["palette-gray-400"].computedValue,
  gray400: theme.colors["palette-gray-500"].computedValue,
  gray500: theme.colors["palette-gray-600"].computedValue,
  gray600: theme.colors["palette-gray-700"].computedValue,
  gray700: theme.colors["palette-gray-800"].computedValue,
  gray800: theme.colors["palette-gray-900"].computedValue,
  gray900: theme.colors["palette-gray-1000"].computedValue,
  carrot100: theme.colors["palette-carrot-200"].computedValue,
  carrot500: theme.colors["palette-carrot-600"].computedValue,
  carrot900: theme.colors["palette-carrot-800"].computedValue,
  carrotAlpha50: theme.colors["palette-carrot-100"].computedValue,
  carrotAlpha100: theme.colors["palette-carrot-200"].computedValue,
  carrotAlpha200: theme.colors["palette-carrot-200"].computedValue,
  blue300: theme.colors["palette-blue-400"].computedValue,
  blue600: theme.colors["palette-blue-600"].computedValue,
  red500: theme.colors["palette-red-700"].computedValue,
}

const staticColors = {
  white: theme.colors["palette-static-white"].computedValue,
  black: theme.colors["palette-static-black"].computedValue,
  blackAlpha200: theme.colors["palette-static-black-alpha-500"].computedValue,
  whiteAlpha200: theme.colors["palette-static-white-alpha-300"].computedValue,
  gray900: theme.colors["palette-static-black"].computedValue,
  carrot50: theme.colors["palette-carrot-100"].computedValue,
  carrot800: theme.colors["palette-carrot-700"].computedValue,
  blue50: theme.colors["palette-blue-100"].computedValue,
  blue800: theme.colors["palette-blue-700"].computedValue,
  red50: theme.colors["palette-red-100"].computedValue,
  red800: theme.colors["palette-red-700"].computedValue,
}

const Component = () => {
  return (
    <div>
      <Button
        backgroundColor={theme.colors["bg-brand-solid"].computedValue}
        color={theme.colors["palette-static-white"].computedValue}
      >
        버튼
      </Button>
      <InfoBox borderColor={theme.colors["palette-gray-400"].computedValue}>
        <Text color={theme.colors["palette-gray-1000"].computedValue}>
          안내사항
        </Text>
        <WarningIcon fill={theme.colors["bg-warning-solid"].computedValue} />
      </InfoBox>
      <Badge backgroundColor={theme.colors["bg-critical-solid"].computedValue}>
        <BadgeText color={theme.colors["palette-static-white"].computedValue}>
          중요
        </BadgeText>
      </Badge>
    </div>
  );
};

const Dialog = ({ isOpen, onClose }) => {
  const styles = {
    overlay: {
      backgroundColor: theme.colors["bg-overlay"].computedValue,
    },
    container: {
      backgroundColor: theme.colors["bg-layer-floating"].computedValue,
      borderColor: theme.colors["palette-gray-400"].computedValue,
    },
    header: {
      borderBottom: `1px solid ${theme.colors["stroke-neutral-muted"].computedValue}`,
    },
    title: {
      color: theme.colors["palette-gray-1000"].computedValue,
    },
    content: {
      color: theme.colors["palette-gray-800"].computedValue,
      backgroundColor: theme.colors["bg-layer-fill"].computedValue,
    },
    footer: {
      borderTop: `1px solid ${theme.colors["stroke-neutral"].computedValue}`,
    },
    closeButton: {
      color: theme.colors["palette-gray-600"].computedValue,
    },
    submitButton: {
      backgroundColor: theme.colors["palette-blue-600"].computedValue,
      color: theme.colors["palette-static-white"].computedValue,
    },
  };

  return isOpen ? (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <h2 style={styles.title}>다이얼로그 제목</h2>
          <button style={styles.closeButton} onClick={onClose}>
            닫기
          </button>
        </div>
        <div style={styles.content}>
          다이얼로그 내용
        </div>
        <div style={styles.footer}>
          <button style={styles.submitButton}>
            확인
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export { semanticColors, scaleColors, staticColors, Component, Dialog };
// @ts-nocheck

import { theme } from '@src/stitches/stitches.config'

const semanticColors = {
  primary: theme.colors['primary-semantic'].computedValue,
  onPrimary: theme.colors['onPrimary-semantic'].computedValue,
  primaryLow: theme.colors['primaryLow-semantic'].computedValue,
  success: theme.colors['success-semantic'].computedValue,
  warning: theme.colors['warning-semantic'].computedValue,
  danger: theme.colors['danger-semantic'].computedValue,
  paperDefault: theme.colors['paperDefault-semantic'].computedValue,
  paperContents: theme.colors['paperContents-semantic'].computedValue,
  paperDialog: theme.colors['paperDialog-semantic'].computedValue,
  inkText: theme.colors['inkText-semantic'].computedValue,
  inkTextLow: theme.colors['inkTextLow-semantic'].computedValue,
  divider1: theme.colors['divider1-semantic'].computedValue,
  divider2: theme.colors['divider2-semantic'].computedValue,
  overlayDim: theme.colors['overlayDim-semantic'].computedValue,
  accent: theme.colors['accent-semantic'].computedValue,
}

const scaleColors = {
  gray00: theme.colors.gray00.computedValue,
  gray100: theme.colors.gray100.computedValue,
  gray200: theme.colors.gray200.computedValue,
  gray300: theme.colors.gray300.computedValue,
  gray400: theme.colors.gray400.computedValue,
  gray500: theme.colors.gray500.computedValue,
  gray600: theme.colors.gray600.computedValue,
  gray700: theme.colors.gray700.computedValue,
  gray800: theme.colors.gray800.computedValue,
  gray900: theme.colors.gray900.computedValue,
  carrot100: theme.colors.carrot100.computedValue,
  carrot500: theme.colors.carrot500.computedValue,
  carrot900: theme.colors.carrot900.computedValue,
  carrotAlpha50: theme.colors.carrotAlpha50.computedValue,
  carrotAlpha100: theme.colors.carrotAlpha100.computedValue,
  carrotAlpha200: theme.colors.carrotAlpha200.computedValue,
  blue300: theme.colors.blue300.computedValue,
  blue600: theme.colors.blue600.computedValue,
  red500: theme.colors.red500.computedValue,
}

const staticColors = {
  white: theme.colors['white-static'].computedValue,
  black: theme.colors['black-static'].computedValue,
  blackAlpha200: theme.colors['blackAlpha200-static'].computedValue,
  whiteAlpha200: theme.colors['whiteAlpha200-static'].computedValue,
  gray900: theme.colors['gray900-static'].computedValue,
  carrot50: theme.colors['carrot50-static'].computedValue,
  carrot800: theme.colors['carrot800-static'].computedValue,
  blue50: theme.colors['blue50-static'].computedValue,
  blue800: theme.colors['blue800-static'].computedValue,
  red50: theme.colors['red50-static'].computedValue,
  red800: theme.colors['red800-static'].computedValue,
}

const Component = () => {
  return (
    <div>
      <Button
        backgroundColor={theme.colors['primary-semantic'].computedValue}
        color={theme.colors['onPrimary-semantic'].computedValue}
      >
        버튼
      </Button>
      <InfoBox borderColor={theme.colors.gray300.computedValue}>
        <Text color={theme.colors.gray900.computedValue}>
          안내사항
        </Text>
        <WarningIcon fill={theme.colors['warning-semantic'].computedValue} />
      </InfoBox>
      <Badge backgroundColor={theme.colors['danger-semantic'].computedValue}>
        <BadgeText color={theme.colors['white-static'].computedValue}>
          중요
        </BadgeText>
      </Badge>
    </div>
  );
};

const Dialog = ({ isOpen, onClose }) => {
  const styles = {
    overlay: {
      backgroundColor: theme.colors['overlayDim-semantic'].computedValue,
    },
    container: {
      backgroundColor: theme.colors['paperDialog-semantic'].computedValue,
      borderColor: theme.colors.gray300.computedValue,
    },
    header: {
      borderBottom: `1px solid ${theme.colors['divider1-semantic'].computedValue}`,
    },
    title: {
      color: theme.colors.gray900.computedValue,
    },
    content: {
      color: theme.colors.gray700.computedValue,
      backgroundColor: theme.colors['paperContents-semantic'].computedValue,
    },
    footer: {
      borderTop: `1px solid ${theme.colors['divider2-semantic'].computedValue}`,
    },
    closeButton: {
      color: theme.colors.gray500.computedValue,
    },
    submitButton: {
      backgroundColor: theme.colors.blue600.computedValue,
      color: theme.colors['white-static'].computedValue,
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
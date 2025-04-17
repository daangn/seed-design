// @ts-nocheck
import { vars } from '@/shared/style/vars';

export const date = style({
  ...vars.typography.caption1Regular,
  color: vars.color.gray600,
});

export const color1 = style({
  color: vars.color.yellow500,
});

export const color2 = style({
  color: vars.color.blue500,
});

export const color3 = style({
  color: vars.color.red500,
});

export const title = style({
  ...vars.typography.bodyM1Bold,
  color: vars.color.primary,
});

export const subtitle = style({
  ...vars.typography.bodyM2Regular,
  color: vars.color.secondary,
});

// 배경색 케이스
export const cardBackground = style({
  backgroundColor: vars.color.paperSheet,
  padding: '16px',
});

// 테두리 케이스
export const divider = style({
  borderTop: `1px solid ${vars.color.divider1}`,
  marginTop: '8px',
  marginBottom: '8px',
});

// 상태 색상 케이스
export const successMessage = style({
  ...vars.typography.bodyM1Bold,
  color: vars.color.success,
  backgroundColor: vars.color.successLow,
  padding: '12px',
  borderRadius: '4px',
});

export const warningMessage = style({
  ...vars.typography.bodyM1Bold,
  color: vars.color.warning,
  backgroundColor: vars.color.warningLow,
  padding: '12px',
  borderRadius: '4px',
});

export const errorMessage = style({
  ...vars.typography.bodyM1Bold,
  color: vars.color.danger,
  backgroundColor: vars.color.dangerLow,
  padding: '12px',
  borderRadius: '4px',
});

// 다양한 타이포그래피 케이스
export const heading = style({
  ...vars.typography.h4,
  color: vars.color.inkText,
});

export const body = style({
  ...vars.typography.bodyL1Regular,
  color: vars.color.inkTextLow,
});

export const label = style({
  ...vars.typography.label3Bold,
  color: vars.color.grayActive,
});

// 알파 색상 케이스
export const overlay = style({
  backgroundColor: vars.color.overlayDim,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

// 복합 케이스와 상호작용 상태
export const button = style({
  ...vars.typography.label2Bold,
  backgroundColor: vars.color.primary,
  color: vars.color.onPrimary,
  borderRadius: '4px',
  padding: '8px 16px',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.primaryHover,
  },
  ':active': {
    backgroundColor: vars.color.primaryPressed,
  },
});

export const secondaryButton = style({
  ...vars.typography.label2Bold,
  backgroundColor: vars.color.secondaryLow,
  color: vars.color.secondary,
  borderRadius: '4px',
  padding: '8px 16px',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.grayHover,
  },
  ':active': {
    backgroundColor: vars.color.grayPressed,
  },
});

// 중첩 경로 케이스
export const floatingPanel = style({
  backgroundColor: vars.color.paperFloating,
  boxShadow: `0 2px 8px ${vars.color.overlayLow}`,
  padding: '20px',
  borderRadius: '8px',
});

export const dialogPanel = style({
  backgroundColor: vars.color.paperDialog,
  padding: '24px',
  boxShadow: `0 4px 16px ${vars.color.overlayDim}`,
  borderRadius: '12px',
});

// 정적 색상 케이스
export const staticColors = style({
  color: vars.color.staticBlack,
  backgroundColor: vars.color.staticWhite,
  border: `1px solid ${vars.color.staticBlackAlpha200}`,
});

// 정적 색상 케이스 (명시적으로 static 프리픽스 테스트)
export const staticExplicitColors = style({
  color: vars.color.staticBlack,
  backgroundColor: vars.color.staticWhite,
  boxShadow: `0 2px 4px ${vars.color.staticBlackAlpha500}`,
  outline: `1px solid ${vars.color.staticBlackAlpha200}`,
});

export const specialBackground = style({
  background: `linear-gradient(to bottom, ${vars.color.staticWhiteAlpha50}, ${vars.color.staticWhiteAlpha200})`,
  backdropFilter: 'blur(8px)',
});

// 복합 스타일 및 다중 속성 케이스
export const multiProperty = style({
  ...vars.typography.title2Bold,
  color: vars.color.accent,
  borderLeft: `4px solid ${vars.color.accent}`,
  borderRight: `4px solid ${vars.color.accent}`,
  boxShadow: `inset 0 0 0 1px ${vars.color.divider2}, 0 2px 4px ${vars.color.overlayLow}`,
  padding: '16px',
  backgroundColor: vars.color.paperDefault,
});

// 믹스인 스타일 케이스
export const mixinStyle = {
  primary: {
    background: vars.color.primary,
    color: vars.color.onPrimary,
  },
  secondary: {
    background: vars.color.secondary,
  },
  accent: {
    background: vars.color.accent,
    color: vars.color.onGrayOverlay50,
  },
};

// 특수 속성 및 스케일 색상 케이스
export const scaleColors = style({
  fill: vars.color.carrot500,
  stroke: vars.color.gray400,
  stopColor: vars.color.blue400,
  floodColor: vars.color.red400,
  lightingColor: vars.color.green400,
});

// 특수 타이포그래피 케이스
export const specialTypographies = {
  title: vars.typography.title1Bold,
  subtitle: vars.typography.subtitle1Regular,
  label: vars.typography.label5Regular,
  caption: vars.typography.caption2Bold,
};

// 다양한 경로를 가진 컬러 토큰
export const colorContexts = style({
  // 일반 색상
  color: vars.color.primaryLow,
  // 배경 색상
  backgroundColor: vars.color.paperBackground,
  // 테두리 색상
  borderColor: vars.color.divider3,
  // 호버 색상
  ':hover': {
    backgroundColor: vars.color.primaryLowHover,
    borderColor: vars.color.primaryLowActive,
  },
});

// 복잡한 다중 경로와 중첩된 객체
export const nestedStyleObject = {
  button: {
    default: {
      backgroundColor: vars.color.paperAccent,
      color: vars.color.inkText,
      border: `1px solid ${vars.color.carrot300}`,
    },
    hover: {
      backgroundColor: vars.color.carrot100,
      borderColor: vars.color.carrot400,
    },
    active: {
      backgroundColor: vars.color.carrot200,
      color: vars.color.inkTextLow,
    },
  },
  panel: {
    header: {
      ...vars.typography.subtitle2Bold,
      color: vars.color.blue600,
      borderBottom: `1px solid ${vars.color.blue200}`,
    },
    body: {
      ...vars.typography.bodyM2Regular,
      color: vars.color.inkTextLow,
      backgroundColor: vars.color.blue50,
    },
    footer: {
      backgroundColor: vars.color.blue100,
      borderTop: `1px solid ${vars.color.blue200}`,
    },
  },
};

// 테두리 속성 매핑 테스트
export const borderMapping = style({
  // stroke 토큰으로 매핑될 속성
  borderColor: vars.color.divider2,
  // stroke 토큰이 없어서 fg 토큰으로 대체되는 케이스
  borderTopColor: vars.color.primary,
  borderBottomColor: vars.color.accent,
  // stroke 또는 fg 토큰으로 대체
  boxShadow: `0 0 0 1px ${vars.color.primary}, 0 2px 4px ${vars.color.overlayLow}`,
  // 복합 속성
  border: `1px solid ${vars.color.secondary}`,
});

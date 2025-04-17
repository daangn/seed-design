// @ts-nocheck
import { vars } from '@/shared/style/vars';

export const date = style({
  ...vars.typography.t3Regular,
  color: vars.color.palette.gray700,
});

export const color1 = style({
  color: vars.color.palette.yellow700,
});

export const color2 = style({
  color: vars.color.palette.blue600,
});

export const color3 = style({
  color: vars.color.palette.red700,
});

export const title = style({
  ...vars.typography.t5Bold,
  color: vars.color.fg.brand,
});

export const subtitle = style({
  ...vars.typography.t4Regular,
  color: vars.color.palette.gray900,
});

// 배경색 케이스
export const cardBackground = style({
  backgroundColor: vars.color.bg.layerFloating,
  padding: '16px',
});

// 테두리 케이스
export const divider = style({
  borderTop: `1px solid ${vars.color.stroke.neutralMuted}`,
  marginTop: '8px',
  marginBottom: '8px',
});

// 상태 색상 케이스
export const successMessage = style({
  ...vars.typography.t5Bold,
  color: vars.color.fg.positive,
  backgroundColor: vars.color.bg.positiveWeak,
  padding: '12px',
  borderRadius: '4px',
});

export const warningMessage = style({
  ...vars.typography.t5Bold,
  color: vars.color.bg.warningSolid,
  backgroundColor: vars.color.bg.warningWeak,
  padding: '12px',
  borderRadius: '4px',
});

export const errorMessage = style({
  ...vars.typography.t5Bold,
  color: vars.color.fg.critical,
  backgroundColor: vars.color.bg.criticalWeak,
  padding: '12px',
  borderRadius: '4px',
});

// 다양한 타이포그래피 케이스
export const heading = style({
  ...vars.typography.t10Bold,
  color: vars.color.fg.neutral,
});

export const body = style({
  ...vars.typography.articleBody,
  color: vars.color.fg.neutralSubtle,
});

export const label = style({
  ...vars.typography.t4Bold,
  color: vars.color.fg.neutralMuted,
});

// 알파 색상 케이스
export const overlay = style({
  backgroundColor: vars.color.bg.overlay,
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
});

// 복합 케이스와 상호작용 상태
export const button = style({
  ...vars.typography.t5Bold,
  backgroundColor: vars.color.bg.brandSolid,
  color: vars.color.palette.staticWhite,
  borderRadius: '4px',
  padding: '8px 16px',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.bg.brandSolidPressed,
  },
  ':active': {
    backgroundColor: vars.color.bg.brandSolidPressed,
  },
});

export const secondaryButton = style({
  ...vars.typography.t5Bold,
  backgroundColor: vars.color.bg.neutralWeak,
  color: vars.color.palette.gray900,
  borderRadius: '4px',
  padding: '8px 16px',
  border: 'none',
  cursor: 'pointer',
  ':hover': {
    backgroundColor: vars.color.bg.neutralWeakPressed,
  },
  ':active': {
    backgroundColor: vars.color.bg.neutralWeakPressed,
  },
});

// 중첩 경로 케이스
export const floatingPanel = style({
  backgroundColor: vars.color.bg.layerFloating,
  boxShadow: `0 2px 8px ${vars.color.bg.overlayMuted}`,
  padding: '20px',
  borderRadius: '8px',
});

export const dialogPanel = style({
  backgroundColor: vars.color.bg.layerFloating,
  padding: '24px',
  boxShadow: `0 4px 16px ${vars.color.bg.overlay}`,
  borderRadius: '12px',
});

// 정적 색상 케이스
export const staticColors = style({
  color: vars.color.palette.staticBlack,
  backgroundColor: vars.color.palette.staticWhite,
  border: `1px solid ${vars.color.palette.staticBlackAlpha200}`,
});

// 정적 색상 케이스 (명시적으로 static 프리픽스 테스트)
export const staticExplicitColors = style({
  color: vars.color.palette.staticBlack,
  backgroundColor: vars.color.palette.staticWhite,
  boxShadow: `0 2px 4px ${vars.color.palette.staticBlackAlpha500}`,
  outline: `1px solid ${vars.color.palette.staticBlackAlpha200}`,
});

export const specialBackground = style({
  background: `linear-gradient(to bottom, ${vars.color.palette.staticWhiteAlpha50}, ${vars.color.palette.staticWhiteAlpha200})`,
  backdropFilter: 'blur(8px)',
});

// 복합 스타일 및 다중 속성 케이스
export const multiProperty = style({
  ...vars.typography.t7Bold,
  color: vars.color.fg.informative,
  borderLeft: `4px solid ${vars.color.fg.informative}`,
  borderRight: `4px solid ${vars.color.fg.informative}`,
  boxShadow: `inset 0 0 0 1px ${vars.color.stroke.neutral}, 0 2px 4px ${vars.color.bg.overlayMuted}`,
  padding: '16px',
  backgroundColor: vars.color.bg.layerDefault,
});

// 믹스인 스타일 케이스
export const mixinStyle = {
  primary: {
    background: vars.color.bg.brandSolid,
    color: vars.color.palette.staticWhite,
  },
  secondary: {
    background: vars.color.palette.gray900,
  },
  accent: {
    background: vars.color.bg.informativeSolid,
    color: vars.color.stroke.onImage,
  },
};

// 특수 속성 및 스케일 색상 케이스
export const scaleColors = style({
  fill: vars.color.palette.carrot600,
  stroke: vars.color.palette.gray500,
  stopColor: vars.color.palette.blue400,
  floodColor: vars.color.palette.red600,
  lightingColor: vars.color.palette.green500,
});

// 특수 타이포그래피 케이스
export const specialTypographies = {
  title: vars.typography.t9Bold,
  subtitle: vars.typography.t5Regular,
  label: vars.typography.t1Regular,
  caption: vars.typography.t2Bold,
};

// 다양한 경로를 가진 컬러 토큰
export const colorContexts = style({
  // 일반 색상
  color: vars.color.palette.carrot100,
  // 배경 색상
  backgroundColor: vars.color.bg.layerBasement,
  // 테두리 색상
  borderColor: vars.color.palette.gray400,
  // 호버 색상
  ':hover': {
    backgroundColor: vars.color.palette.carrot200,
    borderColor: vars.color.palette.carrot100,
  },
});

// 복잡한 다중 경로와 중첩된 객체
export const nestedStyleObject = {
  button: {
    default: {
      backgroundColor: vars.color.palette.carrot100,
      color: vars.color.fg.neutral,
      border: `1px solid ${vars.color.palette.carrot400}`,
    },
    hover: {
      backgroundColor: vars.color.palette.carrot200,
      borderColor: vars.color.palette.carrot500,
    },
    active: {
      backgroundColor: vars.color.palette.carrot300,
      color: vars.color.fg.neutralSubtle,
    },
  },
  panel: {
    header: {
      ...vars.typography.t4Bold,
      color: vars.color.palette.blue600,
      borderBottom: `1px solid ${vars.color.palette.blue300}`,
    },
    body: {
      ...vars.typography.t4Regular,
      color: vars.color.fg.neutralSubtle,
      backgroundColor: vars.color.palette.blue100,
    },
    footer: {
      backgroundColor: vars.color.palette.blue200,
      borderTop: `1px solid ${vars.color.palette.blue300}`,
    },
  },
};

// 테두리 속성 매핑 테스트
export const borderMapping = style({
  // stroke 토큰으로 매핑될 속성
  borderColor: vars.color.stroke.neutral,
  // stroke 토큰이 없어서 fg 토큰으로 대체되는 케이스
  borderTopColor: vars.color.fg.brand,
  borderBottomColor: vars.color.fg.informative,
  // stroke 또는 fg 토큰으로 대체
  boxShadow: `0 0 0 1px ${vars.color.bg.brandSolid}, 0 2px 4px ${vars.color.bg.overlayMuted}`,
  // 복합 속성
  border: `1px solid ${vars.color.palette.gray900}`,
});

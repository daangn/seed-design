// @ts-nocheck
import { vars } from "@seed-design/design-token";

const style1 = {
  color: vars.$semantic.color.primary,
}

const style2 = {
  color: vars.$static.color.staticWhite,
}

const style3 = {
  color: vars.$scale.color.carrot50,
}

const style4 = {
  color: vars.$scale.color.gray900,
}

const style5 = {
  color: vars.$semantic.color.secondaryLow,
}

const style6 = {
  color: vars.$semantic.color.success,
}

const style7 = {
  color: vars.$semantic.color.successLow,
}

const styles = {
  // 배경 색상 (bg 토큰)
  backgroundColor: vars.$semantic.color.overlayDim,
  background: vars.$semantic.color.overlayLow,
  backgroundImage: vars.$semantic.color.paperSheet,
  backgroundBlendMode: vars.$semantic.color.paperDialog,
  webkitBackgroundClip: vars.$semantic.color.paperFloating,
  layerBackground: vars.$semantic.color.paperContents,
  canvasBackground: vars.$semantic.color.paperDefault,
  screenBackgroundColor: vars.$semantic.color.paperBackground,
  highlightBackground: vars.$semantic.color.paperAccent,
  gradientImage: vars.$semantic.color.primaryPressed,
  scrollbarColor: vars.$semantic.color.primaryPressed,
  scrollbarTrackColor: vars.$semantic.color.primaryLowPressed,
  scrollbarButtonColor: vars.$semantic.color.primaryLowActive,
  markerBackground: vars.$semantic.color.primaryLowPressed,
  counterFillColor: vars.$semantic.color.grayPressed,
  printBackgroundColor: vars.$semantic.color.grayPressed,
  
  // 테두리 색상 (stroke 토큰)
  borderColor: vars.$semantic.color.divider1,
  borderTopColor: vars.$semantic.color.divider2,
  borderBottomColor: vars.$semantic.color.divider3,
  
  // 기타 색상
  stroke: vars.$semantic.color.accent,
  outlineColor: vars.$semantic.color.inkText,
  accentColor: vars.$semantic.color.inkTextLow,
  boxShadowColor: vars.$semantic.color.grayActive,
};

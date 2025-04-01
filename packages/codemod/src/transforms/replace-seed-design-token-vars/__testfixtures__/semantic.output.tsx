// @ts-nocheck
import { vars } from "@seed-design/css/vars";

const style1 = {
  color: vars.$color.fg.brand,
}

const style2 = {
  color: vars.$color.palette.staticWhite,
}

const style3 = {
  color: vars.$color.palette.carrot100,
}

const style4 = {
  color: vars.$color.palette.gray1000,
}

const style5 = {
  color: vars.$color.bg.neutralWeak,
}

const style6 = {
  color: vars.$color.fg.positive,
}

const style7 = {
  color: vars.$color.bg.positiveWeak,
}

const styles = {
  // 배경 색상 (bg 토큰)
  backgroundColor: vars.$color.bg.overlay,
  background: vars.$color.bg.overlayMuted,
  backgroundImage: vars.$color.bg.layerFloating,
  backgroundBlendMode: vars.$color.bg.layerFloating,
  webkitBackgroundClip: vars.$color.bg.layerFloating,
  layerBackground: vars.$color.bg.layerFill,
  canvasBackground: vars.$color.bg.layerDefault,
  screenBackgroundColor: vars.$color.bg.layerBasement,
  highlightBackground: vars.$color.palette.carrot100,
  gradientImage: vars.$color.bg.brandSolidPressed,
  scrollbarColor: vars.$color.bg.brandSolidPressed,
  scrollbarTrackColor: vars.$color.palette.carrot200,
  scrollbarButtonColor: vars.$color.palette.carrot100,
  markerBackground: vars.$color.palette.carrot200,
  counterFillColor: vars.$color.bg.neutralWeakPressed,
  printBackgroundColor: vars.$color.bg.neutralWeakPressed,
  
  // 테두리 색상 (stroke 토큰)
  borderColor: vars.$color.stroke.neutralMuted,
  borderTopColor: vars.$color.stroke.neutral,
  borderBottomColor: vars.$color.palette.gray400,
  
  // 기타 색상
  stroke: vars.$color.fg.informative,
  outlineColor: vars.$color.fg.neutral,
  accentColor: vars.$color.fg.neutralSubtle,
  boxShadowColor: vars.$color.fg.neutralMuted,
};

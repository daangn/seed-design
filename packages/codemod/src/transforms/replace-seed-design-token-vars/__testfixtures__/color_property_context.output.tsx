import { vars } from "@seed-design/css/vars";

// CSS 속성에 따른 적절한 색상 토큰 타입(bg, fg, stroke) 변환 테스트
export const styles = {
  // 텍스트 색상 (fg 토큰)
  textColor: {
    color: vars.$color.palette.gray600
  },
  fill: vars.$color.bg.brandSolid,
  
  // 배경 색상 (bg 토큰)
  background: {
    backgroundColor: vars.$color.palette.gray600
  },
  backgroundGeneral: {
    background: vars.$color.bg.brandSolid
  },
  
  // 테두리 색상 (stroke 토큰)
  border: {
    borderColor: vars.$color.palette.gray600
  },
};

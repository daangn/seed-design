// @ts-nocheck
import { vars } from "@ride-developer/css/vars";

// 우선순위가 높은 변환 (먼저 처리되어야 함)
const border1 = vars.$color.stroke.neutralMuted;

// 일반 변환들
const border2 = vars.$color.stroke.onImage;
const border3 = vars.$color.stroke.neutral;
const border4 = vars.$color.stroke.fieldFocused;
const border5 = vars.$color.stroke.control;
const border6 = vars.$color.stroke.field;
const border7 = vars.$color.stroke.brand;
const border8 = vars.$color.stroke.positive;
const border9 = vars.$color.stroke.informative;
const border10 = vars.$color.stroke.warning;
const border11 = vars.$color.stroke.critical;

// 변환되지 않아야 하는 토큰들 (이미 v3 형식)
const newToken1 = vars.$color.stroke.brandWeak;
const newToken2 = vars.$color.stroke.neutralSubtle;
const newToken3 = vars.$color.stroke.neutralContrast;

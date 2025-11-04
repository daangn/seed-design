// @ts-nocheck
import React from "react";
import { vars } from "@seed-design/css/vars";

// 인라인 스타일에서 stroke 토큰 사용
const Component1 = () => (
  <div
    style={{
      borderColor: vars.$color.stroke.neutralMuted,
      borderTopColor: vars.$color.stroke.neutral,
      borderBottomColor: vars.$color.stroke.onImage,
      outlineColor: vars.$color.stroke.fieldFocused,
    }}
  />
);

// 객체 스타일에서 사용
const styles = {
  container: {
    borderColor: vars.$color.stroke.control,
    border: `1px solid ${vars.$color.stroke.field}`,
  },
  button: {
    borderColor: vars.$color.stroke.brand,
    outlineColor: vars.$color.stroke.positive,
  },
  input: {
    borderColor: vars.$color.stroke.informative,
    "&:focus": {
      borderColor: vars.$color.stroke.warning,
    },
  },
  error: {
    borderColor: vars.$color.stroke.critical,
  },
};

// 삼항 연산자에서 사용
const ConditionalComponent = ({ isActive }: { isActive: boolean }) => (
  <div
    style={{
      borderColor: isActive ? vars.$color.stroke.neutralMuted : vars.$color.stroke.neutral,
      stroke: vars.$color.stroke.onImage,
    }}
  />
);

// 새로운 토큰들 (변경되지 않아야 함)
const NewTokensComponent = () => (
  <div
    style={{
      borderColor: vars.$color.stroke.brandWeak,
      outlineColor: vars.$color.stroke.neutralSubtle,
    }}
  />
);

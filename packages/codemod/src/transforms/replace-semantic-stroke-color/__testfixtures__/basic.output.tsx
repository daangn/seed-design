// @ts-nocheck
import React from "react";
import { vars } from "@ride-developer/css/vars";

// 인라인 스타일에서 stroke 토큰 사용
const Component1 = () => (
  <div
    style={{
      borderColor: vars.$color.stroke.neutralSubtle,
      borderTopColor: vars.$color.stroke.neutralMuted,
      borderBottomColor: vars.$color.stroke.neutralSubtle,
      outlineColor: vars.$color.stroke.neutralContrast,
    }}
  />
);

// 객체 스타일에서 사용
const styles = {
  container: {
    borderColor: vars.$color.stroke.neutralWeak,
    border: `1px solid ${vars.$color.stroke.neutralWeak}`,
  },
  button: {
    borderColor: vars.$color.stroke.brandWeak,
    outlineColor: vars.$color.stroke.positiveWeak,
  },
  input: {
    borderColor: vars.$color.stroke.informativeWeak,
    "&:focus": {
      borderColor: vars.$color.stroke.warningWeak,
    },
  },
  error: {
    borderColor: vars.$color.stroke.criticalWeak,
  },
};

// 삼항 연산자에서 사용
const ConditionalComponent = ({ isActive }: { isActive: boolean }) => (
  <div
    style={{
      borderColor: isActive ? vars.$color.stroke.neutralSubtle : vars.$color.stroke.neutralMuted,
      stroke: vars.$color.stroke.neutralSubtle,
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

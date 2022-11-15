import type { StyleRule } from "@vanilla-extract/css";

// 모바일 우선 반응형으로 디자인합니다.

// ~360px
export function xsmall(token: StyleRule) {
  return {
    "@media": {
      "screen and (min-width: 360px)": token,
    },
  };
}

// ~ 768px
export function small(token: StyleRule) {
  return {
    "@media": {
      "screen and (min-width: 768px)": token,
    },
  };
}

// ~ 992px
export function medium(token: StyleRule) {
  return {
    "@media": {
      "screen and (min-width: 992px)": token,
    },
  };
}

// ~ 1200px
export function large(token: StyleRule) {
  return {
    "@media": {
      "screen and (min-width: 1280px)": token,
    },
  };
}

// ~ 1440px
export function xlarge(token: StyleRule) {
  return {
    "@media": {
      "screen and (min-width: 1440px)": token,
    },
  };
}

export function dark(token: StyleRule) {
  return {
    "@media": {
      "(prefers-color-scheme: dark)": token,
    },
  };
}

export function light(token: StyleRule) {
  return {
    "@media": {
      "(prefers-color-scheme: light)": token,
    },
  };
}

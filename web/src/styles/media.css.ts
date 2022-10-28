import type { StyleRule } from "@vanilla-extract/css";

/* Small devices (portrait tablets and large phones, 600px and up) */
export function small(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 600px)": token,
    },
  };
}

/* Medium devices (landscape tablets, 768px and up) */
export function medium(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 768px)": token,
    },
  };
}

/* Large devices (laptops/desktops, 992px and up) */
export function large(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 992px)": token,
    },
  };
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
export function xlarge(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 1200px)": token,
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

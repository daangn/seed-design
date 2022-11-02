import type { StyleRule } from "@vanilla-extract/css";

/* On screens that are 600px or less */
export function small(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 600px)": token,
    },
  };
}

/* On screens that are 768px or less */
export function medium(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 768px)": token,
    },
  };
}

/* On screens that are 992px or less */
export function large(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 992px)": token,
    },
  };
}

/* On screens that are 1200px or less */
export function xlarge(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 1200px)": token,
    },
  };
}

/* On screens that are 1600px or less */
export function xxlarge(token: StyleRule) {
  return {
    "@media": {
      "screen and (max-width: 1600px)": token,
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

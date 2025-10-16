const PREVENT_PULL_ATTRIBUTE = "data-seed-pull-to-refresh-prevent-pull";

export const pullToRefreshPreventPull = {
  [PREVENT_PULL_ATTRIBUTE]: "",
};

export const isPullPrevented = (el: HTMLElement): boolean => {
  return el.closest(`[${PREVENT_PULL_ATTRIBUTE}]`) != null;
};

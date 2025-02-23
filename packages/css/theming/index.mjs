import { DefaultColorModeValue, isValidColorMode } from "./mode.mjs";

export const generateThemingScript = ({ mode = DefaultColorModeValue }) => {
  if (!isValidColorMode(mode)) {
    throw new Error(`Invalid color mode: ${mode}`);
  }

  return `
    (function(window, document, mode) {
      try {
        document.documentElement.dataset.seed = mode;
      } catch (e) {}

      try {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        if ('addEventListener' in prefersDark) {
          prefersDark.addEventListener('change', apply);
        } else if ('addListener' in prefersDark) {
          prefersDark.addListener(apply);
        }

        if (prefersDark.matches) {
          document.documentElement.dataset.seedScaleColor = 'dark';
        } else {
          document.documentElement.dataset.seedScaleColor = 'light';
        }

        function apply() {
          document.documentElement.dataset.seedScaleColor = prefersDark.matches ? 'dark' : 'light';
        }
      } catch (e) {}

      try {
        if (typeof window.AndroidFunction !== 'undefined') {
          document.documentElement.dataset.seedPlatform = 'android';
        } else if (typeof window.webkit !== 'undefined' && typeof window.webkit.messageHandlers !== 'undefined') {
          document.documentElement.dataset.seedPlatform = 'ios';
        } else {
          document.documentElement.dataset.seedPlatform = 'ios';
        }
      } catch (e) {}
    })(window, document, '${mode}');
  `;
};

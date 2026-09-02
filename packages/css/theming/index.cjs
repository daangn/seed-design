const { DefaultColorModeValue, isValidColorMode } = require("./mode.cjs");

function generateThemingScript({ mode = DefaultColorModeValue, fontScaling = false }) {
  if (!isValidColorMode(mode)) {
    throw new Error(`Invalid color mode: ${mode}`);
  }

  return `
    (function(window, document, mode) {
      try {
        document.documentElement.dataset.seed = '';
        document.documentElement.dataset.seedColorMode = mode;
      } catch (e) {}

      try {
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

        if ('addEventListener' in prefersDark) {
          prefersDark.addEventListener('change', apply);
        } else if ('addListener' in prefersDark) {
          prefersDark.addListener(apply);
        }

        if (prefersDark.matches) {
          document.documentElement.dataset.seedUserColorScheme = 'dark';
        } else {
          document.documentElement.dataset.seedUserColorScheme = 'light';
        }

        function apply() {
          document.documentElement.dataset.seedUserColorScheme = prefersDark.matches ? 'dark' : 'light';
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

      try {
        if (${fontScaling}) {
          var platform = document.documentElement.dataset.seedPlatform;

          if (platform === 'ios') {
            document.documentElement.dataset.seedFontScaling = 'enabled';

            function applyIOSFontScaling() {
              try {
                var tempEl = document.createElement('div');
                tempEl.style.cssText = 'position:absolute;visibility:hidden;font-size:16px;font:-apple-system-body;';
                document.body.appendChild(tempEl);
                var size = parseFloat(window.getComputedStyle(tempEl).fontSize);
                document.body.removeChild(tempEl);
                // Scale normalized to the web 16px baseline, clamped to the
                // cap iOS actually applies — the 1.35 globalCss sets as
                // --seed-font-size-limit-max. So the value says how much SEED
                // grew the text, not how large a Dynamic Type step the user
                // picked: the accessibility steps reach 3.1 and would
                // otherwise overstate it. Exposed on both the data attribute
                // and --seed-user-font-scale.
                var raw = size > 0 ? (size / 16) * 0.9412 : 1;
                var scale = Math.max(0.8, Math.min(1.35, raw));
                document.documentElement.dataset.seedFontMultiplier = parseFloat(scale.toFixed(2)).toString();
                document.documentElement.style.setProperty('--seed-user-font-scale', scale.toString());
              } catch (e) {}
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', applyIOSFontScaling);
            } else {
              applyIOSFontScaling();
            }
          } else if (platform === 'android') {
            var fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
            // textZoom factor, clamped to [0.8, 1.5]. SEED assumes the native
            // app caps Configuration.fontScale (per Activity) within the same
            // range so the clamped value equals the actual textZoom and the
            // static-token cancellation in globalCss stays exact. Exposed on
            // both the data attribute and --seed-user-font-scale.
            var raw = fontSize > 0 ? fontSize / 16 : 1;
            var scale = Math.max(0.8, Math.min(1.5, raw));
            document.documentElement.dataset.seedFontMultiplier = parseFloat(scale.toFixed(2)).toString();
            document.documentElement.style.setProperty('--seed-user-font-scale', scale.toString());
            document.documentElement.dataset.seedFontScaling = 'enabled';
          }
        }
      } catch (e) {}
    })(window, document, '${mode}');
  `;
}

module.exports = { generateThemingScript };

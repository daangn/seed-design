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

      // Outside the fontScaling gate on purpose. Android WebView multiplies
      // every computed font-size and line-height by Configuration.fontScale
      // whether or not the app opted in, so the *-static tokens have to divide
      // it back out either way — the option picks whether SEED *follows* the
      // user's scale, not whether the WebView applies one. iOS needs nothing
      // here: its scaling arrives through -apple-system-body inheritance,
      // which the gate does control, and a literal px is never inflated.
      var seedAndroidFontScale = 1;
      try {
        if (document.documentElement.dataset.seedPlatform === 'android') {
          var rootSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
          // Uncapped, because it is a divisor: the tokens cancel textZoom only
          // by dividing by exactly what the WebView multiplied back in,
          // whatever cap the native app chose.
          seedAndroidFontScale = rootSize > 0 ? rootSize / 16 : 1;
          document.documentElement.style.setProperty('--seed-static-font-scale', seedAndroidFontScale.toString());
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
                // otherwise overstate it.
                var raw = size > 0 ? (size / 16) * 0.9412 : 1;
                var scale = Math.max(0.8, Math.min(1.35, raw));
                document.documentElement.dataset.seedFontMultiplier = parseFloat(scale.toFixed(2)).toString();
              } catch (e) {}
            }

            if (document.readyState === 'loading') {
              document.addEventListener('DOMContentLoaded', applyIOSFontScaling);
            } else {
              applyIOSFontScaling();
            }
          } else if (platform === 'android') {
            // How much SEED grows the text, which the token clamp bounds to
            // [--seed-font-size-limit-min, --seed-font-size-limit-max]. Past
            // the cap this is deliberately below the raw scale measured above.
            var applied = Math.max(0.8, Math.min(1.5, seedAndroidFontScale));
            document.documentElement.dataset.seedFontMultiplier = parseFloat(applied.toFixed(2)).toString();
            document.documentElement.dataset.seedFontScaling = 'enabled';
          }
        }
      } catch (e) {}
    })(window, document, '${mode}');
  `;
}

module.exports = { generateThemingScript };

import { type ColorMode, StorageKey } from "./common";

export const generateNoFlashScript = ({ mode = "auto" }: { mode?: ColorMode }) => {
  return `
		(function(window, document, mode) {
			try {
				if (mode !== 'auto') {
					document.documentElement.dataset.seed = mode;
				}
			} catch (e) {}
			
			try {
				var color = window.localStorage.getItem('${StorageKey.COLOR}');
				if (color) {
					document.documentElement.dataset.seedScaleColor = color;
				} else {
					var prefersLight = window.matchMedia('(prefers-color-scheme: light)');
  				var prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
					if (prefersLight.matches) {
						document.documentElement.dataset.seedScaleColor = 'light';
						if ('addEventListener' in prefersLight) {
							prefersLight.addEventListener('change', apply);
						} else if ('addListener' in prefersLight) {
							prefersLight.addListener(apply);
						}
					} else if (prefersDark.matches) {
						document.documentElement.dataset.seedScaleColor = 'dark';
						if ('addEventListener' in prefersDark) {
							prefersDark.addEventListener('change', apply);
						} else if ('addListener' in prefersDark) {
							prefersDark.addListener(apply);
						}
					}
				}

				function apply() {
					document.documentElement.dataset.seedScaleColor = prefersDark.matches ? 'dark' : 'light';
					document.documentElement.dataset.seedScaleLetterSpacing = 'ios';
				}
			} catch (e) {}

			try {
				var platform = window.localStorage.getItem('${StorageKey.PLATFORM}');
				if (platform) {
					document.documentElement.dataset.seedPlatform = platform;
				} else if (typeof window.AndroidFunction !== 'undefined') {
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

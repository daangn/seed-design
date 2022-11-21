import { type ColorMode, StorageKey } from "./common";

export const generateNoFlashScript = ({ mode = 'auto' }: { mode?: ColorMode}) => {
	return `
		(function(window, document, mode) {
			try {
				if (mode === 'auto') {
					var color = window.localStorage.getItem('${StorageKey.COLOR}');
					if (color) {
						document.body.dataset.seedScaleColor = color;
					} else {
						document.body.dataset.seedScaleColor = 'system';
					}
				} else {
					var variant = mode === 'light-only' ? 'light' : 'dark';
					document.body.dataset.seedScaleColor = variant;
				}
			} catch (e) {}

			try {
				var platform = window.localStorage.getItem('${StorageKey.PLATFORM}');
				if (platform) {
					document.body.dataset.seedPlatform = platform;
				} else if (typeof window.AndroidFunction !== 'undefined') {
					document.body.dataset.seedPlatform = 'android';
				} else if (typeof window.webkit !== 'undefined' && typeof window.webkit.messageHandlers !== 'undefined') {
					document.body.dataset.seedPlatform = 'ios';
				} else {
					document.body.dataset.seedPlatform = 'unknown';
				}
			} catch (e) {}
		})(window, document, '${mode}');
	`;
}

import { StorageKey } from "./ThemeStorageContext";

export const generateNoFlashScript = () => {
	return `
		(function(window, document) {
			try {
				var color = localStorage.getItem('${StorageKey.COLOR}');
				if (color) {
					document.documentElement.dataset.seedScaleColor = color;
				} else {
					document.documentElement.dataset.seedScaleColor = 'system';
				}
			} catch (e) {}

			try {
				var platform = localStorage.getItem('${StorageKey.PLATFORM}');
				if (platform) {
					document.documentElement.dataset.seedPlatform = platform;
				} else if (typeof window.AndroidFunction !== 'undefined') {
					document.documentElement.dataset.seedPlatform = 'android';
				} else if (typeof window.webkit !== 'undefined' && typeof window.webkit.messageHandlers !== 'undefined') {
					document.documentElement.dataset.seedPlatform = 'ios';
				} else {
					document.documentElement.dataset.seedPlatform = 'unknown';
				}
			} catch (e) {}
		})(window, document);
	`;
}

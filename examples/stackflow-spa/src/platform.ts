/**
 * 웹뷰 브리지가 없는 브라우저에서도 판별이 서야 하므로 UA로 본다. SEED가 붙이는
 * `data-seed-platform`은 브리지가 없으면 iOS로 떨어지기 때문에 쓸 수 없다.
 */
export const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent.toLowerCase());

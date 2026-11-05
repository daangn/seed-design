/** 키보드가 닫힐 때 Footer와 Content가 내려가는 시간(ms)이다. */
export const KEYBOARD_CLOSE_DURATION_MS = 300;

/**
 * iOS 키보드가 닫힐 때 네이티브 화면의 Content가 움직이는 곡선이다. 당근 iOS 앱 녹화(60fps)의 두 차례 닫힘에
 * 맞춘 값이며 진행률 RMS 오차는 1.2%다. 키보드가 닫힐 때 Footer와 spacer가 함께 쓴다.
 */
export const KEYBOARD_CLOSE_TIMING = `${KEYBOARD_CLOSE_DURATION_MS / 1000}s cubic-bezier(0.25, 0.05, 0.15, 1)`;

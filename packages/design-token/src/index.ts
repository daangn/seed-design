export * as colors from './colors';
export type { ColorToken, ColorScheme } from './colors';

/**
 * color scheme name
 * - default: 기본 값 (=light, 추후 prefer-color-scheme 으로 변경될 예정)
 * - light: 밝은 테마
 */
export type SupportedScheme = 'default' | 'light';

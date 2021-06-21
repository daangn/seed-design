export type ThemeName = (
  | 'light'
  | 'dark'
);

export type ThemeClassName = `${ThemeName}-theme`;

export type BehaviorMode = (
  | 'auto'
  | 'light-only'
  | 'dark-only'
);

export const classNameLight: ThemeClassName = 'light-theme';
export const classNameDark: ThemeClassName = 'dark-theme';

export const getThemeName = (mode: BehaviorMode, isDarkMode: boolean): ThemeName => {
  return ({
    'auto'      : isDarkMode ? 'dark' : 'light',
    'light-only': 'light',
    'dark-only' : 'dark',
  } as const)[mode];
};

export const getColorScheme = (mode: BehaviorMode): string => {
  return ({
    'auto'      : 'light dark',
    'light-only': 'light',
    'dark-only' : 'dark',
  } as const)[mode];
};

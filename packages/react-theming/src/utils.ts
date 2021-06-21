import * as React from 'react';
import type { DarkMode } from 'use-dark-mode';
import _useDarkMode from 'use-dark-mode';

import { ThemeStorageContext } from './ThemeStorageContext';

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
  switch (mode) {
    case 'auto': return isDarkMode ? 'dark' : 'light';
    case 'light-only': return 'light';
    case 'dark-only': return 'dark';
  }
};

type UseDarkModeProps = {
  mode: BehaviorMode,
};

export function useDarkModeBehavior({
  mode,
}: UseDarkModeProps): DarkMode {
  const storage = React.useContext(ThemeStorageContext);

  /**
   * initial = switch mode {
   * | 'auto'       => 'light' // dark?: false
   * | 'light-only' => 'light' // dark?: false
   * | 'dark-only'  => 'dark'  // dark?: true
   * }
   */
  const usingDarkAsInitial = mode === 'dark-only';

  const handleDarkModeChange = React.useCallback(
    function handleDarkModeChange(isDarkMode = false) {
      const [nextClassName, prevClassName] = getThemeName(mode, isDarkMode) === 'dark' 
        ? [classNameDark, classNameLight]
        : [classNameLight, classNameDark]

      const body = document.body;

      body.classList.add(nextClassName);
      body.classList.remove(prevClassName)
    },
    [mode],
  );

  const darkMode = _useDarkMode(usingDarkAsInitial, {
    storageProvider: storage,
    classNameDark,
    classNameLight,
    onChange: handleDarkModeChange,
  });

  return darkMode;
};


const availableColorScheme: Record<BehaviorMode, string> = {
  'auto'      : 'light dark',
  'light-only': 'light',
  'dark-only' : 'dark',
};

type UseColorSchemeProps = {
  mode: BehaviorMode,
};

export function useColorScheme({
  mode,
}: UseColorSchemeProps): string {
  return availableColorScheme[mode];
};

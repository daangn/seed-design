import * as React from 'react';
import type { DarkMode } from 'use-dark-mode';
import _useDarkMode from 'use-dark-mode';

import { ThemeStorageContext } from './ThemeStorageContext';
import type { BehaviorMode } from './utils';
import { getThemeName, classNameDark, classNameLight } from './utils';

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

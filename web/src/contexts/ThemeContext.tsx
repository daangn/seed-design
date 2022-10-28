import type { Dispatch } from "react";
import React, { createContext, useContext, useReducer } from "react";

import { usePrefersColorScheme } from "../hooks/usePreferColorScheme";

type Theme = "light" | "dark";

type State = {
  isDarkMode: boolean;
  currentTheme: Theme;
};

type Action = { _t: "TOGGLE_THEME" };

type ThemeDispatch = Dispatch<Action>;

const ThemeStateContext = createContext<State | null>(null);
const ThemeDispatchContext = createContext<ThemeDispatch | null>(null);

const getTheme = (mode: Theme): Theme => {
  return (
    {
      light: "dark",
      dark: "light",
    } as const
  )[mode];
};

function reducer(state: State, action: Action): State {
  switch (action._t) {
    case "TOGGLE_THEME":
      const nextTheme = getTheme(state.currentTheme);
      document.body.dataset.seedScaleColor = nextTheme;
      return {
        ...state,
        currentTheme: nextTheme,
        isDarkMode: nextTheme === "dark",
      };
    default:
      throw new Error("Unhandled action");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const preferTheme = usePrefersColorScheme();

  const [state, dispatch] = useReducer(reducer, {
    currentTheme: preferTheme,
    isDarkMode: preferTheme === "dark",
  });

  return (
    <ThemeStateContext.Provider value={state}>
      <ThemeDispatchContext.Provider value={dispatch}>
        {children}
      </ThemeDispatchContext.Provider>
    </ThemeStateContext.Provider>
  );
}

export function useThemeState() {
  const state = useContext(ThemeStateContext);
  if (!state) throw new Error("Cannot find ThemeStateContext");
  return state;
}

export function useThemeDispatch() {
  const dispatch = useContext(ThemeDispatchContext);
  if (!dispatch) throw new Error("Cannot find ThemeDispatchContext");
  return dispatch;
}

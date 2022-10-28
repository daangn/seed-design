import MoonIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMoonFill";
import SunIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSunFill";
import { motion } from "framer-motion";
import React, { useCallback } from "react";

import { useThemeDispatch, useThemeState } from "../contexts/ThemeContext";
import * as style from "./ThemeToggler.css";

const Sun = () => (
  <motion.div
    className={style.container}
    initial={{
      opacity: 0,
      transform: "rotate(90deg)",
    }}
    animate={{
      opacity: 1,
      transform: "rotate(0deg)",
    }}
  >
    <SunIcon width={28} />
  </motion.div>
);

const Moon = () => (
  <motion.div
    className={style.container}
    initial={{
      opacity: 0,
      transform: "rotate(90deg)",
    }}
    animate={{
      opacity: 1,
      transform: "rotate(0deg)",
    }}
  >
    <MoonIcon width={28} />
  </motion.div>
);

const ThemeToggler = () => {
  const { isDarkMode } = useThemeState();
  const themeDispatch = useThemeDispatch();

  const toggleTheme = useCallback(() => {
    themeDispatch({ _t: "TOGGLE_THEME" });
  }, [themeDispatch]);

  return (
    <div className={style.toggler({ isDarkMode })} onClick={toggleTheme}>
      {isDarkMode ? <Sun /> : <Moon />}
    </div>
  );
};
export default ThemeToggler;

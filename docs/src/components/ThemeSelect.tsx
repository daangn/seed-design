import ExpandLessIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconExpandLessFill";
import ExpandMoreIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconExpandMoreFill";
import MoonIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMoonFill";
import SettingIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSettingFill";
import SunIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSunFill";
import { useThemeBehavior } from "@seed-design/react-theming";
import type { MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

import * as style from "./ThemeSelect.css";

type ColorTheme = "light" | "dark" | "system";
type StorageColorTheme = "light" | "dark" | null;

const OptionItem = {
  light: (
    <>
      <SunIcon width="16px" />
      <span>light</span>
    </>
  ),
  dark: (
    <>
      <MoonIcon width="16px" />
      <span>dark</span>
    </>
  ),
  system: (
    <>
      <SettingIcon width="16px" />
      <span>system</span>
    </>
  ),
};

const ThemeSelect = () => {
  const { setColorTheme } = useThemeBehavior({ mode: "auto" });
  // NOTE: 라이브러리에서 관리하는 colorTheme 변수랑 동기화하기 위한 변수
  const [storageColorTheme, setStorageColorTheme] =
    useState<ColorTheme>("system");
  const [isOptionListOpen, setIsOptionListOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleOptionClick = (e: MouseEvent<HTMLLIElement>) => {
    const colorTheme = e.currentTarget.innerText as ColorTheme;
    setColorTheme(colorTheme);
    setStorageColorTheme(colorTheme);
  };

  const handleSelectClick = () => {
    setIsOptionListOpen((prev) => !prev);
  };

  const handleClickOutSide = (e: MouseEvent<HTMLElement, MouseEvent>) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      setIsOptionListOpen(false);
    }
  };

  const handleEscTyping = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOptionListOpen(false);
    }
  };

  // TODO: 원래는 @seed-design/react-theming에서 작업되어야 함
  useEffect(() => {
    const colorTheme = localStorage.getItem(
      "@seed-design/scale-color",
    ) as StorageColorTheme;

    if (colorTheme === "light") {
      setStorageColorTheme("light");
    } else if (colorTheme === "dark") {
      setStorageColorTheme("dark");
    } else {
      setStorageColorTheme("system");
    }
  }, [storageColorTheme]);

  useEffect(() => {
    document.addEventListener(
      "mousedown",
      handleClickOutSide as unknown as EventListener,
    );
    document.addEventListener("keydown", handleEscTyping);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutSide as unknown as EventListener,
      );
      document.removeEventListener("keydown", handleEscTyping);
    };
  }, []);

  return (
    <div ref={ref} className={style.selectContainer}>
      <button className={style.select} onClick={handleSelectClick}>
        {OptionItem[storageColorTheme]}
        {isOptionListOpen ? (
          <ExpandLessIcon width="10px" />
        ) : (
          <ExpandMoreIcon width="10px" />
        )}
      </button>
      {isOptionListOpen && (
        <ul className={style.optionList}>
          {Object.entries(OptionItem).map(([key, value]) => (
            <li key={key} className={style.option} onClick={handleOptionClick}>
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ThemeSelect;

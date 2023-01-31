import MenuIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMenuRegular";
import SearchIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconSearchFill";
import { vars } from "@seed-design/design-token";
import { Slice } from "gatsby";
import { useEffect, useState } from "react";

import { useSearchbarState } from "../contexts/SearchbarContext";
import { useSidebarState } from "../contexts/SidebarContext";
import * as style from "./Header.css";
import ThemeSelect from "./ThemeSelect";

function GithubLogo() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.016 0.500006C10.0448 0.496917 7.16959 1.62357 4.90569 3.59229C2.64179 5.561 1.13715 8.2902 0.661423 11.2908C0.185696 14.2914 0.769977 17.3672 2.30955 19.9671C3.84912 22.567 6.24335 24.521 9.06318 25.479C9.68488 25.5968 9.91514 25.1963 9.91514 24.8586C9.91514 24.521 9.91514 23.7514 9.91514 22.6835C6.43821 23.4687 5.70137 20.9716 5.70137 20.9716C5.46969 20.1977 4.97749 19.5328 4.31213 19.0948C3.18386 18.3096 4.40423 18.3096 4.40423 18.3096C4.79974 18.3667 5.17735 18.5152 5.50847 18.7438C5.83958 18.9724 6.11553 19.275 6.3154 19.6288C6.48523 19.9439 6.71418 20.2215 6.98914 20.4458C7.2641 20.6701 7.57964 20.8366 7.91766 20.9358C8.25568 21.0351 8.60952 21.065 8.95889 21.024C9.30825 20.983 9.64625 20.8718 9.95351 20.6968C10.0017 20.0508 10.2739 19.4437 10.721 18.9849C7.94257 18.663 5.02594 17.5636 5.02594 12.6636C5.00686 11.3938 5.46579 10.1652 6.30772 9.23204C5.93199 8.12811 5.97583 6.91998 6.43053 5.84759C6.43053 5.84759 7.48205 5.50207 9.86908 7.15896C11.9188 6.58318 14.0824 6.58318 16.1322 7.15896C18.5192 5.50207 19.5631 5.84759 19.5631 5.84759C20.0225 6.91846 20.0691 8.12748 19.6935 9.23204C20.5355 10.1652 20.9944 11.3938 20.9753 12.6636C20.9753 17.5793 18.051 18.6551 15.2649 18.9456C15.5636 19.2529 15.7943 19.6223 15.9413 20.0287C16.0883 20.4352 16.1481 20.8692 16.1168 21.3014C16.1168 23.0133 16.1168 24.3953 16.1168 24.8115C16.1168 25.2277 16.3394 25.5497 16.9765 25.4319C19.7874 24.4649 22.1712 22.5078 23.7027 19.9096C25.2342 17.3114 25.8138 14.2411 25.338 11.2464C24.8623 8.2516 23.3622 5.52711 21.1054 3.55883C18.8485 1.59055 15.9816 0.506491 13.016 0.500006Z"
        fill={vars.$scale.color.gray700}
      />
    </svg>
  );
}

export default function Header() {
  const { openSidebar } = useSidebarState();
  const { openSearchbar } = useSearchbarState();

  const [isTop, setIsTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsTop(true);
      } else {
        setIsTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={style.header({ isTop })}>
      <div className={style.content}>
        <MenuIcon
          className={style.sidebarToggleButton}
          onClick={openSidebar}
          width={28}
        />

        <div className={style.headerLogo}>
          <Slice alias="logo" to="/" />
        </div>

        <div className={style.headerRightSection}>
          <a
            href="https://github.com/daangn/seed-design"
            target="_blank"
            className={style.githubLogo}
          >
            <GithubLogo />
          </a>
          <button onClick={openSearchbar} className={style.searchButton}>
            <SearchIcon className={style.searchButtonLeftIcon} />
            <div className={style.searchButtonText} />
            <div className={style.searchButtonKeyboard}>
              <kbd>⌘</kbd> + <kbd>K</kbd>
            </div>
          </button>

          <ThemeSelect />
        </div>
      </div>
    </header>
  );
}

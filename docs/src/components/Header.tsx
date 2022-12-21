import MenuIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMenuRegular";
import type { GatsbyLinkProps } from "gatsby";
import { Link } from "gatsby";
import * as React from "react";

import * as style from "./Header.css";

function Logo({ to, onClick }: GatsbyLinkProps<{}>) {
  return (
    <Link to={to} onClick={onClick}>
      <div className={style.logo}>
        <svg
          width="99"
          height="52"
          viewBox="0 0 99 52"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
        >
          <path
            className={style.logoCircle}
            d="M25.5059 21.6191H29.168C29.1094 18.0303 26.0479 15.4961 21.5508 15.4961C17.083 15.4961 13.7578 17.9863 13.7578 21.7363C13.7578 24.7832 15.9258 26.541 19.4121 27.4492L21.8145 28.0645C24.1143 28.6504 25.6377 29.3535 25.6523 31.0234C25.6377 32.8398 23.9092 34.0557 21.4043 34.0703C18.9873 34.0557 17.127 32.9717 16.9512 30.7598H13.2012C13.3623 34.9492 16.4971 37.3223 21.4336 37.3223C26.5166 37.3223 29.4609 34.7734 29.4609 31.0527C29.4609 27.3613 26.4141 25.6914 23.25 24.959L21.2578 24.4316C19.5 24.0215 17.6104 23.2891 17.625 21.502C17.6396 19.9053 19.0752 18.7334 21.4922 18.748C23.7773 18.7334 25.3154 19.7881 25.5059 21.6191ZM32.625 37H46.4824V33.7773H36.4336V27.9766H45.6914V24.7832H36.4336V18.9824H46.4238V15.7891H32.625V37ZM50.0859 37H63.9434V33.7773H53.8945V27.9766H63.1523V24.7832H53.8945V18.9824H63.8848V15.7891H50.0859V37ZM74.7539 37C81.1992 37 85.0225 33.001 85.0371 26.3652C85.0225 19.7588 81.1992 15.7891 74.8711 15.7891H67.5469V37H74.7539ZM71.3555 33.6895V19.0996H74.666C78.9873 19.085 81.2285 21.502 81.2285 26.3652C81.2285 31.2578 78.9873 33.7041 74.5488 33.6895H71.3555Z"
          />
          <path
            className={style.logoText}
            d="M97 26C97 12.1986 79.8957 2 49.9847 2C20.0737 2 2 12.1986 2 26C2 39.8014 20.0737 50 49.9847 50C79.8957 50 97 39.8014 97 26Z"
            strokeWidth="4"
          />
        </svg>
      </div>
    </Link>
  );
}

export default function Header() {
  return (
    <header className={style.header}>
      <Logo to="/" />
      <MenuIcon
        className={style.sidebarToggleButton}
        onClick={() => {}}
        width={28}
      />
    </header>
  );
}

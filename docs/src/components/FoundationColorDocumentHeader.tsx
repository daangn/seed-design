import { Link } from "gatsby";
import * as React from "react";

import * as navStyle from "./ComponentDocumentCategoryNav.css";
import * as style from "./FoundationColorDocumentHeader.css";

interface FoundationColorDocumentHeaderProps {
  currentPath: "color-system" | "usage" | "palette";
}

const FoundationColorDocumentHeader = ({
  currentPath,
}: FoundationColorDocumentHeaderProps) => {
  return (
    <div>
      <h1 className={style.heading1}>Color</h1>
      <p className={style.description}>
        디자이너가 일관된 제품 디자인 경험을 만들 수 있도록 표준 컬러 차트와
        가이드라인을 제공합니다. 컬러 시스템을 통해 일관된 디자인을 유지하고,
        사용자 경험을 향상시킬 수 있습니다.
      </p>

      <nav className={navStyle.navContainer}>
        <Link
          className={navStyle.navLink({
            active: currentPath === "color-system",
          })}
          to="/foundation/color/color-system"
        >
          <p className={navStyle.navLinkText}>Color System</p>
        </Link>
        <Link
          className={navStyle.navLink({ active: currentPath === "usage" })}
          to="/foundation/color/usage"
        >
          <p className={navStyle.navLinkText}>Usage</p>
        </Link>
        <Link
          className={navStyle.navLink({ active: currentPath === "palette" })}
          to="/foundation/color/palette"
        >
          <p className={navStyle.navLinkText}>Palette</p>
        </Link>
      </nav>
      <div className={navStyle.bottomLine} />
    </div>
  );
};

export { FoundationColorDocumentHeader };

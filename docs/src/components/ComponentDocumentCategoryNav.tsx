import { Link } from "gatsby";

import * as style from "./ComponentDocumentCategoryNav.css";

interface ComponentDocumentCategoryNavProps {
  currentPath: string;
}

const ComponentDocumentCategoryNav = ({
  currentPath,
}: ComponentDocumentCategoryNavProps) => {
  return (
    <>
      <nav className={style.navContainer}>
        <Link
          className={style.navLink({
            active: currentPath.includes("overview"),
          })}
          to={`${currentPath.split("/").slice(0, -2).join("/")}/overview`}
        >
          <p className={style.navLinkText}>Overview</p>
        </Link>
        <Link
          className={style.navLink({ active: currentPath.includes("usage") })}
          to={`${currentPath.split("/").slice(0, -2).join("/")}/usage`}
        >
          <p className={style.navLinkText}>Usage</p>
        </Link>
        <Link
          className={style.navLink({ active: currentPath.includes("style") })}
          to={`${currentPath.split("/").slice(0, -2).join("/")}/style`}
        >
          <p className={style.navLinkText}>Style</p>
        </Link>
      </nav>
      <div className={style.bottomLine} />
    </>
  );
};

export default ComponentDocumentCategoryNav;

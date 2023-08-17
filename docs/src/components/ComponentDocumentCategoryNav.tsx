import { Link } from "gatsby";
import * as React from "react";

import * as style from "./ComponentDocumentCategoryNav.css";

interface ComponentDocumentCategoryNavProps {
  currentPath: string;
}

const ComponentDocumentCategoryNav = ({
  currentPath,
}: ComponentDocumentCategoryNavProps) => {
  const [currentCategory, setCurrentCategory] = React.useState<
    "overview" | "usage" | "style" | null
  >(null);

  React.useEffect(() => {
    if (currentPath.includes("overview")) {
      setCurrentCategory("overview");
      return;
    }
    if (currentPath.includes("usage")) {
      setCurrentCategory("usage");
      return;
    }
    if (currentPath.includes("style")) {
      setCurrentCategory("style");
      return;
    }
    setCurrentCategory(null);
  }, []);

  return (
    <>
      <nav className={style.navContainer}>
        <Link
          className={style.navLink({
            active: currentCategory === "overview",
          })}
          to={`${currentPath.split("/").slice(0, -2).join("/")}/overview`}
        >
          <p className={style.navLinkText}>Overview</p>
        </Link>
        <Link
          className={style.navLink({ active: currentCategory === "usage" })}
          to={`${currentPath.split("/").slice(0, -2).join("/")}/usage`}
        >
          <p className={style.navLinkText}>Usage</p>
        </Link>
        <Link
          className={style.navLink({ active: currentCategory === "style" })}
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

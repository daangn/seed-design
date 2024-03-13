import { Link } from "gatsby";
import * as React from "react";

import * as style from "./ComponentDocumentCategoryNav.css";

type Category = "usage" | "style";
interface ComponentDocumentCategoryNavProps {
  currentPath: string;
}

const ComponentDocumentCategoryNav = ({
  currentPath,
}: ComponentDocumentCategoryNavProps) => {
  const [currentCategory, setCurrentCategory] = React.useState<Category>();

  const isUsage = /usage/g.test(currentPath);
  const isStyle = /style/g.test(currentPath);

  let removedCategoryPath;
  if (currentCategory)
    // NOTE: /component/alert-dialog/usage/ -> /component/alert-dialog/
    removedCategoryPath = currentPath.split("/").slice(0, -2).join("/");

  React.useEffect(() => {
    if (isUsage) {
      setCurrentCategory("usage");
      return;
    }
    if (isStyle) {
      setCurrentCategory("style");
      return;
    }
    setCurrentCategory(undefined);
  }, []);

  return (
    <>
      <nav className={style.navContainer}>
        <Link
          activeClassName=""
          className={style.navLink({
            active: currentCategory === "usage",
          })}
          to={`${removedCategoryPath}/usage`}
        >
          <p className={style.navLinkText}>Usage</p>
        </Link>
        <Link
          activeClassName=""
          className={style.navLink({
            active: currentCategory === "style",
          })}
          to={`${removedCategoryPath}/style`}
        >
          <p className={style.navLinkText}>Style</p>
        </Link>
      </nav>
      <div className={style.bottomLine} />
    </>
  );
};

export default ComponentDocumentCategoryNav;

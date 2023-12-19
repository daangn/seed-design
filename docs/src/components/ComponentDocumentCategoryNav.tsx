import { Link } from "gatsby";
import * as React from "react";

import * as style from "./ComponentDocumentCategoryNav.css";

type Category = "overview" | "usage" | "style";
interface ComponentDocumentCategoryNavProps {
  currentPath: string;
}

const ComponentDocumentCategoryNav = ({
  currentPath,
}: ComponentDocumentCategoryNavProps) => {
  const [currentCategory, setCurrentCategory] = React.useState<Category>();

  const isOverview = /overview/g.test(currentPath);
  const isUsage = /usage/g.test(currentPath);
  const isStyle = /style/g.test(currentPath);

  let removedCategoryPath;
  if (currentCategory)
    // NOTE: /component/alert-dialog/overview/ -> /component/alert-dialog/
    removedCategoryPath = currentPath.split("/").slice(0, -2).join("/");

  React.useEffect(() => {
    if (isOverview) {
      setCurrentCategory("overview");
      return;
    }
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
          className={style.navLink({
            active: currentCategory === "overview",
          })}
          to={`${removedCategoryPath}/overview`}
        >
          <p className={style.navLinkText}>Overview</p>
        </Link>
        <Link
          className={style.navLink({ active: currentCategory === "usage" })}
          to={`${removedCategoryPath}/usage`}
        >
          <p className={style.navLinkText}>Usage</p>
        </Link>
        <Link
          className={style.navLink({ active: currentCategory === "style" })}
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

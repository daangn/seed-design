import { Link } from "gatsby";

import * as style from "./ComponentDocumentCategoryNavSlice.css";

type Status = "todo" | "in-progress" | "done";
interface ComponentDocumentCategoryNavProps {
  path: string;
  overviewStatus: string;
  usageStatus: string;
  styleStatus: string;
}

const ComponentDocumentCategoryNav = ({
  path,
  overviewStatus,
  styleStatus,
  usageStatus,
}: ComponentDocumentCategoryNavProps) => {
  return (
    <nav className={style.navContainer}>
      <Link
        className={style.navLink({ active: path.includes("overview") })}
        to={`${path.split("/").slice(0, -2).join("/")}/overview`}
      >
        <p className={style.navLinkText({ status: overviewStatus as Status })}>
          Overview
        </p>
      </Link>
      <Link
        className={style.navLink({ active: path.includes("usage") })}
        to={`${path.split("/").slice(0, -2).join("/")}/usage`}
      >
        <p className={style.navLinkText({ status: usageStatus as Status })}>
          Usage
        </p>
      </Link>
      <Link
        className={style.navLink({ active: path.includes("style") })}
        to={`${path.split("/").slice(0, -2).join("/")}/style`}
      >
        <p className={style.navLinkText({ status: styleStatus as Status })}>
          Style
        </p>
      </Link>
    </nav>
  );
};

export default ComponentDocumentCategoryNav;

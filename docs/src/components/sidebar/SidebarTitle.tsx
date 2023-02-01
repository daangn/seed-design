import { Link } from "gatsby";

import * as style from "./SidebarTitle.css";

const SidebarTitle = ({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) => {
  const firstLetterTitle = title[0].toUpperCase();
  const restLetterTitle = title.slice(1);
  return (
    <Link to={`/${title}`} onClick={onClick}>
      <h2 className={style.title}>{firstLetterTitle + restLetterTitle}</h2>
    </Link>
  );
};

export default SidebarTitle;

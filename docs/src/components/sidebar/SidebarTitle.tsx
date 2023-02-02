import { Link } from "gatsby";

import * as style from "./SidebarTitle.css";

const SidebarTitleWithLink = ({
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

const SidebarTitleWithNoLink = ({ title }: { title: string }) => {
  const firstLetterTitle = title[0].toUpperCase();
  const restLetterTitle = title.slice(1);
  return <h2 className={style.title}>{firstLetterTitle + restLetterTitle}</h2>;
};

export { SidebarTitleWithLink, SidebarTitleWithNoLink };

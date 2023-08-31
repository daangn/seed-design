import type { GatsbyLinkProps } from "gatsby";
import { Link } from "gatsby";
import * as React from "react";

import * as style from "./SidebarItem.css";

type Status = "done" | "in-progress" | "todo";
interface SidebarItemProps {
  name: string;
  highlight?: boolean;
  alias?: string;
  status?: Status;
  hasDeps?: boolean;
}

// localhost:8000/component/alert-dialog/overview/
// {domain}/{category}/{component}/{section}/
const SidebarItem = ({
  name,
  alias,
  status,
  to,
  highlight,
  hasDeps,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) => {
  const displayName = alias || name;

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={style.link({ disable: status === "todo" })}
    >
      <li
        className={style.item({
          disable: status === "todo",
          highlight,
          hasDeps,
        })}
      >
        <span>{displayName}</span>
      </li>
    </Link>
  );
};

export default SidebarItem;

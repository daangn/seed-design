import type { GatsbyLinkProps } from "gatsby";
import { Link } from "gatsby";
import * as React from "react";

import * as style from "./SidebarItem.css";

type Status = "done" | "in-progress" | "todo";
interface SidebarItemProps {
  /**
   * sidebar에 같은 이름으로 존재하는 컴포넌트가 있기 때문에 상위 카테고리로 구별해서 하이라이팅 해줌.
   */
  category: "component" | "primitive" | "foundation" | "overview";
  name: string;
  alias?: string;
  currentPath: string;
  status?: Status;
  hasDeps?: boolean;
}

// localhost:8000/component/alert-dialog/overview/
// {domain}/{category}/{component}/{section}/
const SidebarItem = ({
  currentPath,
  name,
  category,
  alias,
  status,
  to,
  hasDeps,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) => {
  const [isActive, setIsActive] = React.useState(false);
  const componentName = currentPath.split("/")[2];
  const convertedDisplayName = name.replaceAll(" ", "-").toLowerCase();
  const displayName = alias || name;

  React.useEffect(() => {
    if (
      componentName === convertedDisplayName &&
      currentPath.includes(category)
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [currentPath]);

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
          highlight: isActive,
          hasDeps,
        })}
      >
        <span>{displayName}</span>
      </li>
    </Link>
  );
};

export default SidebarItem;

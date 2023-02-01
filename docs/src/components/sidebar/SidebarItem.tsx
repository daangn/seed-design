import type { GatsbyLinkProps } from "gatsby";
import { Link } from "gatsby";

import * as style from "./SidebarItem.css";

type Status = "done" | "in-progress" | "todo";
interface SidebarItemProps {
  /**
   * sidebar에 같은 이름으로 존재하는 컴포넌트가 있기 때문에 상위 카테고리로 구별해서 하이라이팅 해줌.
   */
  title: "component" | "primitive" | "foundation" | "overview";
  itemName: string;
  currentPath: string;
  status?: Status;
  hasDeps?: boolean;
}

const SidebarItem = ({
  currentPath,
  itemName,
  title,
  status,
  to,
  hasDeps,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) => {
  const pathComponentName = currentPath.split("/")[2];
  const docsComponentName = itemName.replaceAll(" ", "-").toLowerCase();
  const active =
    pathComponentName === docsComponentName && currentPath.includes(title);

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
          highlight: active,
          hasDeps,
        })}
      >
        <span>{itemName}</span>
      </li>
    </Link>
  );
};

export default SidebarItem;

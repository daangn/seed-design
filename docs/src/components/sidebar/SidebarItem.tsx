import { Link } from "gatsby";

import * as style from "./SidebarItem.css";

type Status = "done" | "in-progress" | "todo";

export type Tab = "usage" | "style" | "color-system" | "palette";

interface SidebarItemProps {
  name: string;
  to: string;
  highlight?: boolean;
  currentTab?: Tab;
  alias?: string;
  status?: Status;
  hasDeps?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
}

// localhost:8000/component/alert-dialog/usage/
// {domain}/{category}/{component}/{section}/
const SidebarItem = ({
  name,
  alias,
  to,
  status,
  currentTab,
  highlight,
  hasDeps,
  onClick,
  onMouseEnter,
}: SidebarItemProps) => {
  const displayName = alias || name;
  const isColorPage = name === "Color";
  const popped = to.split("/").filter(Boolean).slice(0, -1).join("/");

  const isOnePageTab =
    name === "Progress Board" || name === "Icon" || name === "Typography";

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
      {!isOnePageTab && highlight && isColorPage && (
        <>
          <Link
            to={`/${popped}/color-system`}
            className={style.link({ disable: status === "todo" })}
          >
            <li
              className={style.tab({
                active: currentTab === "color-system",
                isLast: false,
                hasDeps: !!hasDeps,
              })}
            >
              Color System
            </li>
          </Link>
          <Link
            to={`/${popped}/usage`}
            className={style.link({ disable: status === "todo" })}
          >
            <li
              className={style.tab({
                active: currentTab === "usage",
                isLast: false,
                hasDeps: !!hasDeps,
              })}
            >
              Usage
            </li>
          </Link>
          <Link to={`/${popped}/palette`}>
            <li
              className={style.tab({
                active: currentTab === "palette",
                isLast: true,
                hasDeps: !!hasDeps,
              })}
            >
              Palette
            </li>
          </Link>
        </>
      )}
    </Link>
  );
};

export default SidebarItem;

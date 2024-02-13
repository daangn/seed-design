import { Link } from "gatsby";

import * as style from "./SidebarItem.css";

type Status = "done" | "in-progress" | "todo";

export type Tab = "overview" | "usage" | "style" | "color-system" | "palette";

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

// localhost:8000/component/alert-dialog/overview/
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

  return (
    <Link
      to={to}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={style.link({ disable: status === "todo", highlight })}
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
      {highlight &&
        (isColorPage ? (
          <>
            <Link
              to={`/${popped}/color-system`}
              className={style.link({ disable: status === "todo" })}
            >
              <li
                className={style.tab({
                  active: currentTab === "color-system",
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
                })}
              >
                Usage
              </li>
            </Link>
            <Link to={`/${popped}/palette`}>
              <li
                className={style.tab({
                  active: currentTab === "palette",
                })}
              >
                Palette
              </li>
            </Link>
          </>
        ) : (
          <>
            <Link
              to={`/${popped}/overview`}
              className={style.link({ disable: status === "todo" })}
            >
              <li
                className={style.tab({
                  active: currentTab === "overview",
                  hasDeps,
                })}
              >
                Overview
              </li>
            </Link>
            <Link
              to={`/${popped}/usage`}
              className={style.link({ disable: status === "todo" })}
            >
              <li
                className={style.tab({
                  active: currentTab === "usage",
                  hasDeps,
                })}
              >
                Usage
              </li>
            </Link>
            <Link
              to={`/${popped}/style`}
              className={style.link({ disable: status === "todo" })}
            >
              <li
                className={style.tab({
                  active: currentTab === "style",
                  hasDeps,
                })}
              >
                Style
              </li>
            </Link>
          </>
        ))}
    </Link>
  );
};

export default SidebarItem;

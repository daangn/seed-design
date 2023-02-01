import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";
import groupby from "lodash/groupBy";
import type { PropsWithChildren } from "react";
import { memo, useEffect, useState } from "react";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./Logo";
import Portal from "./Portal";
import * as style from "./Sidebar.css";

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

const SidebarItemContainer = ({ logo }: { logo?: boolean }) => {
  const { closeSidebar } = useSidebarState();
  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    query Sidebar {
      allAllComponentMetaJson(sort: { name: ASC }) {
        nodes {
          name
          group
          platform {
            docs {
              usage {
                status
                mdx {
                  childMdx {
                    frontmatter {
                      slug
                    }
                  }
                }
              }
            }
          }
        }
      }

      allAllPrimitiveMetaJson(sort: { name: ASC }) {
        nodes {
          name
          description
          primitive {
            childMdx {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    }
  `);

  const currentPath = typeof window !== "undefined" ? location.pathname : "";
  const componentData = data.allAllComponentMetaJson.nodes;
  const primitiveData = data.allAllPrimitiveMetaJson.nodes;

  const groupedComponentData = groupby(componentData, (data) =>
    !data.group ? data.name : data.group,
  );

  return (
    <div className={style.sidebarItemContainer}>
      {logo && (
        <div className={style.sidebarLogo}>
          <Logo to="/" onClick={closeSidebar} />
        </div>
      )}

      <SidebarTitle title="overview" onClick={closeSidebar} />

      <SidebarItem
        currentPath={currentPath}
        to="/overview/progress-board"
        itemName="Progress Board"
        title="overview"
        onClick={closeSidebar}
      />
      <SidebarTitle title="foundation" onClick={closeSidebar} />

      <SidebarItem
        currentPath={currentPath}
        to="/foundation/color"
        itemName="Color"
        title="foundation"
        onClick={closeSidebar}
      />
      <SidebarItem
        currentPath={currentPath}
        to="/foundation/typography"
        itemName="Typography"
        title="foundation"
        onClick={closeSidebar}
      />

      <SidebarTitle title="component" onClick={closeSidebar} />

      {Object.entries(groupedComponentData!).map(([groupName, groupItems]) => {
        // 그룹
        if (groupItems?.length! >= 2) {
          return (
            <Collapse title={groupName}>
              {groupItems?.map((item) => {
                if (item?.platform?.docs?.usage?.status! === "todo") {
                  return (
                    <SidebarItem
                      key={`${item?.name}-todo`}
                      currentPath={currentPath}
                      to={item?.name!}
                      itemName={item?.name!}
                      title="component"
                      onClick={closeSidebar}
                      status={item?.platform?.docs?.usage?.status!}
                      hasDeps
                    />
                  );
                }

                const name = item?.name;
                const path =
                  item?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter?.slug;
                return (
                  <SidebarItem
                    key={`${name}-done-or-wip`}
                    currentPath={currentPath}
                    to={path!}
                    itemName={name!}
                    title="component"
                    onClick={closeSidebar}
                    status={item?.platform?.docs?.usage?.status! as Status}
                    hasDeps
                  />
                );
              })}
            </Collapse>
          );
        }

        return (
          <SidebarItem
            key={`${groupItems[0]?.name}-only-one-component`}
            currentPath={currentPath}
            to={
              groupItems[0]?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter
                ?.slug!
            }
            itemName={groupItems[0]?.name!}
            title="component"
            onClick={closeSidebar}
            status={groupItems[0]?.platform?.docs?.usage?.status! as Status}
          />
        );
      })}

      <SidebarTitle title="primitive" onClick={closeSidebar} />

      {primitiveData!.map((node) => {
        const name = node.name!;
        const slug = node?.primitive?.childMdx?.frontmatter?.slug;

        return (
          <SidebarItem
            key={`${name!}-primitive-done-or-in-progress`}
            currentPath={currentPath}
            to={slug!}
            itemName={name!}
            title="primitive"
            onClick={closeSidebar}
          />
        );
      })}
    </div>
  );
};

/* 모바일 사이드바 (0px ~ 1280px) */
export const MobileSidebar = () => {
  const { open, closeSidebar } = useSidebarState();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (open) {
      setTimeout(() => setActive(true), 150);
    } else {
      setTimeout(() => setActive(false), 150);
    }
  }, [open]);

  return (
    <Portal>
      {active && (
        <div>
          <nav className={style.sidebar({ open })}>
            <SidebarItemContainer logo />
          </nav>
          <div className={style.overlay({ open })} onClick={closeSidebar} />
        </div>
      )}
    </Portal>
  );
};

const ArrowIcon = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={style.sidebarCollapseIcon({ open })}
  >
    <path
      d="M10.1829 8.65788C10.5813 8.09329 11.4187 8.09329 11.8171 8.65788L14.6506 12.6734C15.1181 13.3359 14.6443 14.25 13.8336 14.25H8.16642C7.35567 14.25 6.88192 13.3359 7.34936 12.6734L10.1829 8.65788Z"
      fill="#D1D3D8"
    />
  </svg>
);

const Collapse = ({
  title,
  children,
}: PropsWithChildren<{
  title: string;
}>) => {
  const [open, setOpen] = useState(true);
  const toggle = () => setOpen((prev) => !prev);

  return (
    <ul className={style.sidebarCollapseContainer}>
      <div className={style.sidebarCollapseTitleContainer} onClick={toggle}>
        <h2 className={style.sidebarCollapseTitle}>{title}</h2>
        <div className={style.sidebarCollapseTitleIcon}>
          <ArrowIcon open={open} />
        </div>
      </div>
      <div className={style.sidebarCollapse({ open })}>{open && children}</div>
    </ul>
  );
};

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
      className={style.sidebarItemLink({ disable: status === "todo" })}
    >
      <li
        className={style.sidebarItem({
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
      <h2 className={style.sidebarTitle}>
        {firstLetterTitle + restLetterTitle}
      </h2>
    </Link>
  );
};

/* 페이지 고정 사이드바 (1280px ~) */
export const DesktopSidebar = () => {
  return (
    <nav className={style.sidebarDesktop}>
      <SidebarItemContainer />
    </nav>
  );
};

const Sidebar = () => {
  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default memo(Sidebar);

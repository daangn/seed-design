import { graphql, useStaticQuery } from "gatsby";
import groupby from "lodash/groupBy";
import { memo, useEffect, useState } from "react";

import { useSidebarState } from "../../contexts/SidebarContext";
import Logo from "../Logo";
import Portal from "../Portal";
import * as style from "./Sidebar.css";
import SidebarCollapse from "./SidebarCollapse";
import SidebarItem from "./SidebarItem";
import { SidebarTitleWithLink, SidebarTitleWithNoLink } from "./SidebarTitle";

const SidebarItemContainer = ({ logo }: { logo?: boolean }) => {
  const { closeSidebar } = useSidebarState();
  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    query Sidebar {
      allComponentMetaJson(sort: { name: ASC }) {
        nodes {
          name
          group
          alias
          platform {
            docs {
              overview {
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
    }
  `);

  const [currentPath, setCurrentPath] = useState<string>("");
  const currentPathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  useEffect(() => {
    setCurrentPath(currentPathname);
  }, [currentPathname]);

  const componentData = data.allComponentMetaJson.nodes;
  const groupedComponentData = groupby(componentData, (data) =>
    !data.group ? data.name : data.group,
  );
  const mappedComponentData = Object.entries(groupedComponentData!)
    .map(([groupName, groupItems]) => ({ groupName, groupItems }))
    .sort((a, b) => (a.groupName < b.groupName ? -1 : 1));

  return (
    <div className={style.sidebarItemContainer}>
      {logo && (
        <div className={style.sidebarLogo}>
          <Logo to="/" onClick={closeSidebar} />
        </div>
      )}

      <SidebarTitleWithNoLink title="overview" />

      <SidebarItem
        to="/overview/progress-board"
        name="Progress Board"
        highlight={currentPath === "/overview/progress-board/"}
        onClick={closeSidebar}
      />

      <SidebarTitleWithNoLink title="foundation" />

      <SidebarItem
        to="/foundation/color"
        name="Color"
        highlight={currentPath === "/foundation/color/"}
        onClick={closeSidebar}
      />
      <SidebarItem
        to="/foundation/typography"
        highlight={currentPath === "/foundation/typography/"}
        name="Typography"
        onClick={closeSidebar}
      />

      <SidebarTitleWithLink title="component" onClick={closeSidebar} />

      {mappedComponentData.map(({ groupName, groupItems }) => {
        // 그룹
        if (groupItems?.length! >= 2) {
          return (
            <SidebarCollapse title={groupName}>
              {groupItems?.map((item) => {
                const convertedName = item?.name
                  ?.replaceAll(" ", "-")
                  .toLowerCase()!;
                const regex = new RegExp(`^/component/${convertedName}/`, "g");

                if (item?.platform?.docs?.overview?.status! === "todo") {
                  return (
                    <SidebarItem
                      key={`${item?.name}-todo`}
                      highlight={regex.test(currentPath)}
                      to={item?.name!}
                      name={item?.name!}
                      onClick={closeSidebar}
                      status={item?.platform?.docs?.overview?.status!}
                      hasDeps
                    />
                  );
                }

                return (
                  <SidebarItem
                    key={`${item?.name}-done-or-wip`}
                    to={
                      item?.platform?.docs?.overview?.mdx?.childMdx?.frontmatter
                        ?.slug!
                    }
                    alias={item?.alias!}
                    highlight={regex.test(currentPath)}
                    name={item?.name!}
                    onClick={closeSidebar}
                    status={item?.platform?.docs?.overview?.status! as Status}
                    hasDeps
                  />
                );
              })}
            </SidebarCollapse>
          );
        }

        const convertedName = groupItems[0]?.name
          ?.replaceAll(" ", "-")
          .toLowerCase()!;
        const regex = new RegExp(`^/component/${convertedName}/`, "g");

        // non-그룹
        return (
          <SidebarItem
            key={`${groupItems[0]?.name}-only-one-component`}
            to={
              groupItems[0]?.platform?.docs?.overview?.mdx?.childMdx
                ?.frontmatter?.slug!
            }
            name={groupItems[0]?.name!}
            alias={groupItems[0]?.alias!}
            highlight={regex.test(currentPath)}
            onClick={closeSidebar}
            status={groupItems[0]?.platform?.docs?.overview?.status! as Status}
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
          <nav className={style.mobileSidebarContainer({ open })}>
            <SidebarItemContainer logo />
          </nav>
          <div className={style.overlay({ open })} onClick={closeSidebar} />
        </div>
      )}
    </Portal>
  );
};

/* 페이지 고정 사이드바 (1280px ~) */
const DesktopSidebar = () => {
  return (
    <nav className={style.desktopSidebarContainer}>
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

import { graphql, useStaticQuery } from "gatsby";
import groupby from "lodash/groupBy";
import { memo, useEffect, useState } from "react";

import { useSidebarState } from "../../contexts/SidebarContext";
import Logo from "../Logo";
import Portal from "../Portal";
import * as style from "./Sidebar.css";
import SidebarCollapse from "./SidebarCollapse";
import SidebarItem from "./SidebarItem";
import SidebarTitle from "./SidebarTitle";

const SidebarItemContainer = ({ logo }: { logo?: boolean }) => {
  const { closeSidebar } = useSidebarState();
  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    query Sidebar {
      allComponentMetaJson(sort: { name: ASC }) {
        nodes {
          name
          group
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

      allPrimitiveMetaJson(sort: { name: ASC }) {
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
  const componentData = data.allComponentMetaJson.nodes;
  const primitiveData = data.allPrimitiveMetaJson.nodes;

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
            <SidebarCollapse title={groupName}>
              {groupItems?.map((item) => {
                if (item?.platform?.docs?.overview?.status! === "todo") {
                  return (
                    <SidebarItem
                      key={`${item?.name}-todo`}
                      currentPath={currentPath}
                      to={item?.name!}
                      itemName={item?.name!}
                      title="component"
                      onClick={closeSidebar}
                      status={item?.platform?.docs?.overview?.status!}
                      hasDeps
                    />
                  );
                }

                const name = item?.name;
                const path =
                  item?.platform?.docs?.overview?.mdx?.childMdx?.frontmatter
                    ?.slug;
                return (
                  <SidebarItem
                    key={`${name}-done-or-wip`}
                    currentPath={currentPath}
                    to={path!}
                    itemName={name!}
                    title="component"
                    onClick={closeSidebar}
                    status={item?.platform?.docs?.overview?.status! as Status}
                    hasDeps
                  />
                );
              })}
            </SidebarCollapse>
          );
        }

        // non-그룹
        return (
          <SidebarItem
            key={`${groupItems[0]?.name}-only-one-component`}
            currentPath={currentPath}
            to={
              groupItems[0]?.platform?.docs?.overview?.mdx?.childMdx
                ?.frontmatter?.slug!
            }
            itemName={groupItems[0]?.name!}
            title="component"
            onClick={closeSidebar}
            status={groupItems[0]?.platform?.docs?.overview?.status! as Status}
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

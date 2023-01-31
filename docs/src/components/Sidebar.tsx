import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";
import groupby from "lodash/groupBy";
import { memo, useEffect, useState } from "react";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./LogoSlice";
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
}

const SidebarItem = ({
  currentPath,
  itemName,
  title,
  status,
  to,
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

      {Object.entries(groupedComponentData!).map(([key, value]) => {
        if (value?.length! >= 2) {
          return (
            <ul className={style.sidebarGroupContainer}>
              <h2 className={style.sidebarGroupTitle}>{key}</h2>
              {value?.map((item) => {
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
                  />
                );
              })}
            </ul>
          );
        }

        return (
          <SidebarItem
            key={`${value[0]?.name}-only-one-component`}
            currentPath={currentPath}
            to={
              value[0]?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter?.slug!
            }
            itemName={value[0]?.name!}
            title="component"
            onClick={closeSidebar}
            status={value[0]?.platform?.docs?.usage?.status! as Status}
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

import { AnimatePresence, motion } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./Logo";
import Portal from "./Portal";
import * as style from "./Sidebar.css";

interface SidebarItemProps {
  /**
   * sidebar에 같은 이름으로 존재하는 컴포넌트가 있기 때문에 상위 카테고리로 구별해서 하이라이팅 해줌.
   */
  title: "component" | "primitive" | "foundation" | "overview";

  itemName: string;

  currentPath: string;

  level?: 1 | 2;
}

const SidebarItem = ({
  currentPath,
  itemName,
  title,
  level = 1,
  to,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) => {
  const pathComponentName = currentPath.split("/")[2];
  const docsComponentName = itemName.replaceAll(" ", "-").toLowerCase();
  const active =
    pathComponentName === docsComponentName && currentPath.includes(title);

  return (
    <Link to={to} onClick={onClick} onMouseEnter={onMouseEnter}>
      <div className={style.sidebarItem({ highlight: active, level })}>
        {itemName}
      </div>
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
      <h1 className={style.sidebarTitle1}>
        {firstLetterTitle + restLetterTitle}
      </h1>
    </Link>
  );
};

const Sidebar = () => {
  const { open, closeSidebar } = useSidebarState();

  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    fragment Slug on Mdx {
      frontmatter {
        slug
      }
    }

    query Sidebar {
      allComponentInfoJson(sort: { title: ASC }) {
        nodes {
          title
          primitive {
            status
            path {
              childMdx {
                ...Slug
              }
            }
          }
          items {
            name
            platform {
              docs {
                usage {
                  status
                  path {
                    childMdx {
                      ...Slug
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

  const currentPath = typeof window !== "undefined" ? location.pathname : "";
  const componentData = data.allComponentInfoJson.nodes;
  const primitiveData = componentData.map((component) => {
    return {
      title: component.title,
      primitive: component.primitive,
    };
  });

  // TODO: sidebar가 두 개 있어서 공통된 로직이 있을 듯
  return (
    <>
      <Portal>
        <AnimatePresence>
          {open && (
            <>
              <motion.nav
                className={style.sidebar}
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, x: -80 }}
              >
                <div className={style.sidebarItemContainer}>
                  <div className={style.sidebarLogo}>
                    <Logo to="/" onClick={closeSidebar} />
                  </div>

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

                  {componentData!.map((node) => {
                    if (node?.items?.length! >= 2) {
                      return (
                        <>
                          <div
                            style={{ padding: "10px" }}
                            className={style.sidebarItem({ highlight: false })}
                          >
                            {node.title}
                          </div>
                          {node.items?.map((item) => {
                            if (
                              item?.platform?.docs?.usage?.status! === "todo"
                            ) {
                              return null;
                            }

                            const name = item?.name;
                            const path =
                              item?.platform?.docs?.usage?.path?.childMdx
                                ?.frontmatter?.slug;
                            return (
                              <>
                                <SidebarItem
                                  key={path!}
                                  currentPath={currentPath}
                                  to={path!}
                                  itemName={name!}
                                  level={2}
                                  title="component"
                                  onClick={closeSidebar}
                                />
                              </>
                            );
                          })}
                        </>
                      );
                    }

                    if (!node?.items?.[0]?.platform?.docs?.usage?.path) {
                      return null;
                    }

                    const title = node?.title;
                    const slug =
                      node?.items?.[0]?.platform?.docs?.usage?.path?.childMdx
                        ?.frontmatter?.slug;
                    return (
                      <SidebarItem
                        key={slug!}
                        currentPath={currentPath}
                        to={slug!}
                        itemName={title!}
                        title="component"
                        onClick={closeSidebar}
                      />
                    );
                  })}

                  <SidebarTitle title="primitive" onClick={closeSidebar} />

                  {primitiveData!.map((node) => {
                    if (node?.primitive?.status === "todo") {
                      return null;
                    }

                    const title = node.title!;
                    const slug =
                      node?.primitive?.path?.childMdx?.frontmatter?.slug;
                    return (
                      <SidebarItem
                        key={slug!}
                        currentPath={currentPath}
                        to={slug!}
                        itemName={title!}
                        title="primitive"
                        onClick={closeSidebar}
                      />
                    );
                  })}
                </div>
              </motion.nav>
              <motion.div
                className={style.overlay}
                onClick={closeSidebar}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                exit={{ opacity: 0, y: -10 }}
              />
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* 페이지 고정 사이드바 */}
      <nav className={style.sidebarDesktop}>
        <div className={style.sidebarItemContainer}>
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

          {componentData!.map((node) => {
            if (node?.items?.length! >= 2) {
              return (
                <>
                  <div
                    style={{ padding: "10px" }}
                    className={style.sidebarItem({ highlight: false })}
                  >
                    {node.title}
                  </div>
                  {node.items?.map((item) => {
                    if (item?.platform?.docs?.usage?.status! === "todo") {
                      return null;
                    }

                    const name = item?.name;
                    const path =
                      item?.platform?.docs?.usage?.path?.childMdx?.frontmatter
                        ?.slug;
                    return (
                      <>
                        <SidebarItem
                          key={path!}
                          currentPath={currentPath}
                          to={path!}
                          itemName={name!}
                          level={2}
                          title="component"
                          onClick={closeSidebar}
                        />
                      </>
                    );
                  })}
                </>
              );
            }

            if (!node?.items?.[0]?.platform?.docs?.usage?.path) {
              return null;
            }

            const title = node?.title;
            const slug =
              node?.items?.[0]?.platform?.docs?.usage?.path?.childMdx
                ?.frontmatter?.slug;
            return (
              <SidebarItem
                key={slug!}
                currentPath={currentPath}
                to={slug!}
                itemName={title!}
                title="component"
                onClick={closeSidebar}
              />
            );
          })}

          <SidebarTitle title="primitive" onClick={closeSidebar} />

          {primitiveData!.map((node) => {
            if (node?.primitive?.status === "todo") {
              return null;
            }

            const title = node.title!;
            const slug = node?.primitive?.path?.childMdx?.frontmatter?.slug;
            return (
              <SidebarItem
                key={slug!}
                currentPath={currentPath}
                to={slug!}
                itemName={title!}
                title="primitive"
                onClick={closeSidebar}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;

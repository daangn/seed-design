import { AnimatePresence, motion } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";
import last from "lodash/last";
import sortBy from "lodash/sortBy";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./Logo";
import Portal from "./Portal";
import * as style from "./Sidebar.css";

interface SidebarItemProps {
  /**
   * sidebar에 같은 이름으로 존재하는 컴포넌트가 있기 때문에 상위 카테고리로 구별해서 하이라이팅 해줌.
   */
  title: "component" | "primitive" | "foundation";
  itemName: string;
  currentPath: string;
}

function SidebarItem({
  currentPath,
  itemName,
  title,
  to,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) {
  const pathComponentName = currentPath.split("/")[2];
  const docsComponentName = itemName.replaceAll(" ", "-").toLowerCase();
  const active =
    pathComponentName === docsComponentName && currentPath.includes(title);

  return (
    <Link to={to} onClick={onClick} onMouseEnter={onMouseEnter}>
      <div className={style.sidebarItem({ highlight: active })}>{itemName}</div>
    </Link>
  );
}

function SidebarTitle({
  title,
  onClick,
}: {
  title: string;
  onClick: () => void;
}) {
  const firstLetterTitle = title[0].toUpperCase();
  const restLetterTitle = title.slice(1);
  return (
    <Link to={`/${title}`} onClick={onClick}>
      <h1 className={style.sidebarTitle1}>
        {firstLetterTitle + restLetterTitle}
      </h1>
    </Link>
  );
}

export default function Sidebar() {
  const { open, closeSidebar } = useSidebarState();

  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    query Sidebar {
      configsJson {
        component {
          usage {
            childMdx {
              frontmatter {
                slug
                title
              }
            }
          }
        }

        primitive {
          document {
            childMdx {
              frontmatter {
                slug
                title
              }
            }
          }
        }
      }
    }
  `);

  const componentDocs = sortBy(data.configsJson?.component ?? [], (link) => {
    const words = link?.usage?.childMdx?.frontmatter?.title?.split(" ") ?? [];
    const lastWord = last(words);

    return [lastWord, ...words];
  });
  const primitiveDocs = sortBy(data.configsJson?.primitive ?? [], (link) => {
    const words =
      link?.document?.childMdx?.frontmatter?.title?.split(" ") ?? [];
    const lastWord = last(words);

    return [lastWord, ...words];
  });

  const currentPath = typeof window !== "undefined" ? location.pathname : "";

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

                  {componentDocs!.map((link) => {
                    const { slug, title } = link?.usage?.childMdx?.frontmatter!;
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

                  {primitiveDocs!.map((link) => {
                    const { slug, title } =
                      link?.document?.childMdx?.frontmatter!;
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

          {componentDocs!.map((link) => {
            const { slug, title } = link?.usage?.childMdx?.frontmatter!;
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

          {primitiveDocs!.map((link) => {
            const { slug, title } = link?.document?.childMdx?.frontmatter!;
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
}

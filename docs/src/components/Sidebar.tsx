import { AnimatePresence, motion } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./Logo";
import Portal from "./Portal";
import * as style from "./Sidebar.css";

interface SidebarItemProps {
  title: "component" | "primitive";
  componentName: string;
  currentPath: string;
}

function SidebarItem({
  currentPath,
  componentName,
  title,
  to,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) {
  const pathComponentName = currentPath.split("/")[2];
  const docsComponentName = componentName.replaceAll(" ", "-").toLowerCase();
  const active =
    pathComponentName === docsComponentName && currentPath.includes(title);

  return (
    <Link to={to} onClick={onClick} onMouseEnter={onMouseEnter}>
      <div className={style.sidebarItem({ highlight: active })}>
        {componentName}
      </div>
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

  const componentDocs = data.configsJson?.component;
  const primitiveDocs = data.configsJson?.primitive;

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

                  <SidebarTitle title="component" onClick={closeSidebar} />

                  {componentDocs!.map((link) => {
                    const { slug, title } = link?.usage?.childMdx?.frontmatter!;
                    return (
                      <SidebarItem
                        key={slug!}
                        currentPath={currentPath}
                        to={slug!}
                        componentName={title!}
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
                        componentName={title!}
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
          <SidebarTitle title="component" onClick={closeSidebar} />

          {componentDocs!.map((link) => {
            const { slug, title } = link?.usage?.childMdx?.frontmatter!;
            return (
              <SidebarItem
                key={slug!}
                currentPath={currentPath}
                to={slug!}
                componentName={title!}
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
                componentName={title!}
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

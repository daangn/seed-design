import { AnimatePresence, motion } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";

import { useSidebarState } from "../contexts/SidebarContext";
import Logo from "./Logo";
import Portal from "./Portal";
import * as style from "./Sidebar.css";

interface SidebarItemProps {
  title: string;
  active: boolean;
}

function SidebarItem({
  title,
  active,
  to,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarItemProps) {
  return (
    <Link to={to} onClick={onClick} onMouseEnter={onMouseEnter}>
      <div className={style.sidebarItem({ highlight: active })}>{title}</div>
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
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.15 }}
                exit={{ opacity: 0, x: -100 }}
              >
                <div className={style.sidebarItemContainer}>
                  <div className={style.sidebarLogo}>
                    <Logo to="/" onClick={closeSidebar} />
                  </div>
                  <Link to="/component" onClick={closeSidebar}>
                    <h1
                      className={style.sidebarTitle1}
                      style={{ marginTop: 0 }}
                    >
                      Component
                    </h1>
                  </Link>
                  {componentDocs!.map((link) => {
                    const { slug, title } = link?.usage?.childMdx?.frontmatter!;
                    const pathComponentName = currentPath.split("/")[2];
                    const docsComponentName = title!
                      .replaceAll(" ", "-")
                      .toLowerCase();
                    const active =
                      pathComponentName === docsComponentName &&
                      currentPath.includes("component");
                    return (
                      <SidebarItem
                        key={slug!}
                        active={active}
                        to={slug!}
                        title={title!}
                        onClick={closeSidebar}
                      />
                    );
                  })}
                  <Link to="/primitive" onClick={closeSidebar}>
                    <h1 className={style.sidebarTitle1}>Primitive</h1>
                  </Link>

                  {primitiveDocs!.map((link) => {
                    const { slug, title } =
                      link?.document?.childMdx?.frontmatter!;
                    const pathComponentName = currentPath.split("/")[2];
                    const docsComponentName = title!
                      .replace(" ", "-")
                      .toLowerCase();
                    const active =
                      pathComponentName === docsComponentName &&
                      currentPath.includes("primitive");
                    return (
                      <SidebarItem
                        key={slug!}
                        active={active}
                        to={slug!}
                        title={title!}
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
                transition={{ duration: 0.15 }}
                exit={{ opacity: 0, y: -10 }}
              />
            </>
          )}
        </AnimatePresence>
      </Portal>

      {/* 페이지 고정 사이드바 */}
      <nav className={style.sidebarDesktop}>
        <div className={style.sidebarItemContainer}>
          <Link to="/component" onClick={closeSidebar}>
            <h1 className={style.sidebarTitle1} style={{ marginTop: 0 }}>
              Component
            </h1>
          </Link>
          {componentDocs!.map((link) => {
            const { slug, title } = link?.usage?.childMdx?.frontmatter!;
            const pathComponentName = currentPath.split("/")[2];
            const docsComponentName = title!.replaceAll(" ", "-").toLowerCase();
            const active =
              pathComponentName === docsComponentName &&
              currentPath.includes("component");
            return (
              <SidebarItem
                key={slug!}
                active={active}
                to={slug!}
                title={title!}
                onClick={closeSidebar}
              />
            );
          })}
          <Link to="/primitive" onClick={closeSidebar}>
            <h1 className={style.sidebarTitle1}>Primitive</h1>
          </Link>

          {primitiveDocs!.map((link) => {
            const { slug, title } = link?.document?.childMdx?.frontmatter!;
            const pathComponentName = currentPath.split("/")[2];
            const docsComponentName = title!.replace(" ", "-").toLowerCase();
            const active =
              pathComponentName === docsComponentName &&
              currentPath.includes("primitive");
            return (
              <SidebarItem
                key={slug!}
                active={active}
                to={slug!}
                title={title!}
                onClick={closeSidebar}
              />
            );
          })}
        </div>
      </nav>
    </>
  );
}

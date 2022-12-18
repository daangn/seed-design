import MenuIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMenuRegular";
import { motion } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";
import React, { useState } from "react";

import { Logo } from "./Logo";
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
  const [open, setOpen] = useState<boolean>(false);

  const closeSidebar = () => setOpen(false);
  const openSidebar = () => setOpen(true);

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

  return (
    <>
      <MenuIcon
        className={style.sidebarToggleButton}
        onClick={openSidebar}
        width={28}
      />
      <motion.nav className={style.sidebar({ open })}>
        <Logo to="/" onClick={closeSidebar} />

        <div className={style.sidebarItemContainer}>
          <Link to="/component">
            <h1 className={style.sidebarTitle1} style={{ marginTop: 0 }}>
              Component
            </h1>
          </Link>
          {componentDocs!.map((link) => {
            const { slug, title } = link?.usage?.childMdx?.frontmatter!;
            const active =
              currentPath.includes(title!.toLowerCase()) &&
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
          <Link to="/primitive">
            <h1 className={style.sidebarTitle1}>Primitive</h1>
          </Link>

          {primitiveDocs!.map((link) => {
            const { slug, title } = link?.document?.childMdx?.frontmatter!;
            const active =
              currentPath.includes(title!.toLowerCase()) &&
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
      <div onClick={closeSidebar} className={style.overlay({ open })} />
    </>
  );
}

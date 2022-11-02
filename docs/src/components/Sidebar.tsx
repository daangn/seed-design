import MenuIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMenuRegular";
import NoteIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconNoteRegular";
import clsx from "clsx";
import { motion, useSpring } from "framer-motion";
import type { GatsbyLinkProps } from "gatsby";
import { graphql, Link, useStaticQuery } from "gatsby";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import React, { useState } from "react";
import { createPortal } from "react-dom";

import * as style from "./Sidebar.css";

interface SidebarLinkProps {
  title: string;
  active: boolean;
}

function SidebarPortal({ children }: PropsWithChildren) {
  const sidebar = document.querySelector("#portal");
  if (!sidebar) throw new Error("#portal id div를 찾을 수 없어요");
  return createPortal(children, sidebar);
}

function Logo({ to, onClick }: GatsbyLinkProps<{}>) {
  return (
    <Link to={to} onClick={onClick}>
      <div className={clsx(style.logo)}>SEED DESIGN</div>
    </Link>
  );
}

function SidebarLink({
  title,
  active,
  to,
  onClick,
  onMouseEnter,
}: GatsbyLinkProps<{}> & SidebarLinkProps) {
  return (
    <Link to={to} onClick={onClick} onMouseEnter={onMouseEnter}>
      <div className={clsx(style.sidebarLink({ highlight: active }))}>
        <NoteIcon width={20} />
        <h1>{title}</h1>
      </div>
    </Link>
  );
}

export default function Sidebar() {
  const [open, setOpen] = useState<boolean>(false);

  const closeSidebar = () => setOpen(false);
  const openSidebar = () => setOpen(true);

  const x = useSpring(-300, { duration: 0.2 });

  const data = useStaticQuery<Queries.SidebarQuery>(graphql`
    query Sidebar {
      json {
        overview {
          title
          slug
        }
        components {
          slug
          title
          thumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
      }
    }
  `);

  const overview = data.json?.overview;
  const components = data.json?.components;

  useEffect(() => {
    if (open) {
      x.set(0);
    } else {
      x.set(-300);
    }
  }, [open]);

  return (
    <>
      <MenuIcon
        className={clsx(style.sidebarButton)}
        onClick={openSidebar}
        width={28}
      />
      <SidebarPortal>
        <motion.nav style={{ x }} className={clsx(style.sidebar({ open }))}>
          <Logo to="/" onClick={closeSidebar} />

          <h1 className={style.categoryTitle}>Overview</h1>
          {overview!.map((link) => (
            <SidebarLink
              key={link!.slug!}
              active={location.pathname === link!.slug}
              to={link!.slug!}
              title={link!.title!}
              onClick={closeSidebar}
            />
          ))}

          <Link
            onClick={closeSidebar}
            className={style.sidebarTitleLink({
              highlight: location.pathname === "/components",
            })}
            to="/components"
          >
            <h1 className={style.categoryTitle}>Components</h1>
          </Link>

          {components!.map((link) => (
            <SidebarLink
              key={link!.slug!}
              active={location.pathname === link!.slug}
              to={link!.slug!}
              title={link!.title!}
              onClick={closeSidebar}
            />
          ))}
        </motion.nav>
        <div onClick={closeSidebar} className={clsx(style.overlay({ open }))} />
      </SidebarPortal>
    </>
  );
}

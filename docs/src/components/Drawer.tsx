import MenuIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMenuRegular";
import NoteIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconNoteRegular";
import clsx from "clsx";
import { graphql, Link, StaticQuery } from "gatsby";
import type { PropsWithChildren } from "react";
import React, { useState } from "react";
import ReactDOM from "react-dom";

import * as style from "./Drawer.css";

interface DrawerLinkProps {
  slug: string;
  title: string;
  active: boolean;
  closeDrawer: () => void;
}

function DrawerPortal({ children }: PropsWithChildren) {
  const drawer = document.querySelector("#portal");
  if (!drawer) throw new Error("#portal id div를 찾을 수 없어요");
  return ReactDOM.createPortal(children, drawer);
}

function Logo({ closeDrawer }: { closeDrawer: () => void }) {
  return (
    <Link to="/" onClick={closeDrawer}>
      <div className={clsx(style.logo)}>SEED DESIGN</div>
    </Link>
  );
}

function DrawerLink({ slug, title, active, closeDrawer }: DrawerLinkProps) {
  return (
    <Link to={slug} onClick={closeDrawer}>
      <div className={clsx(style.drawerLink({ highlight: active }))}>
        <NoteIcon width={20} />
        <h1>{title}</h1>
      </div>
    </Link>
  );
}

export default function Drawer() {
  const [open, setOpen] = useState<boolean>(false);

  const closeDrawer = () => setOpen(false);
  const openDrawer = () => setOpen(true);

  return (
    <>
      <MenuIcon
        className={clsx(style.drawerButton)}
        onClick={openDrawer}
        width={28}
      />
      <DrawerPortal>
        <nav className={clsx(style.drawer({ open }))}>
          <Logo closeDrawer={closeDrawer} />
          <StaticQuery
            query={graphql`
              query Drawer {
                site {
                  siteMetadata {
                    drawerLinks {
                      components {
                        slug
                        title
                      }
                      overview {
                        slug
                        title
                      }
                    }
                  }
                }
              }
            `}
            render={(data: GatsbyTypes.DrawerQuery) => {
              if (!data.site?.siteMetadata?.drawerLinks) return;

              const { drawerLinks } = data.site.siteMetadata;
              const { overview, components } = drawerLinks;

              return (
                <>
                  <h1 className={style.categoryTitle}>Overview</h1>
                  {overview!.map((link) => (
                    <DrawerLink
                      key={link!.slug!}
                      active={location.pathname === link!.slug}
                      slug={link!.slug!}
                      title={link!.title!}
                      closeDrawer={closeDrawer}
                    />
                  ))}

                  <h1 className={style.categoryTitle}>Components</h1>
                  {components!.map((link) => (
                    <DrawerLink
                      key={link!.slug!}
                      active={location.pathname === link!.slug}
                      slug={link!.slug!}
                      title={link!.title!}
                      closeDrawer={closeDrawer}
                    />
                  ))}
                </>
              );
            }}
          />
        </nav>
        <div onClick={closeDrawer} className={clsx(style.overlay({ open }))} />
      </DrawerPortal>
    </>
  );
}

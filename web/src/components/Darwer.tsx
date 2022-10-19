import MenuIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconMenuRegular";
import clsx from "clsx";
import React, { useState } from "react";

import * as style from "./Drawer.css";
import Logo from "./Logo";

interface DrawerProps {
  children: React.ReactNode;
}

export default function Drawer({ children }: DrawerProps) {
  const [open, setOpen] = useState<boolean>(false);

  const closeDrawer = () => {
    setOpen(false);
  };

  const openDrawer = () => {
    setOpen(true);
  };

  return (
    <>
      <MenuIcon
        className={clsx(style.drawerButton)}
        onClick={openDrawer}
        width={25}
      />
      <nav className={clsx(style.drawer({ open }))}>
        <Logo />
        {children}
      </nav>
      <div onClick={closeDrawer} className={clsx(style.overlay({ open }))} />
    </>
  );
}

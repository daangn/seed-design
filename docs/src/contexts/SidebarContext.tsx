import React, { createContext, useContext, useState } from "react";

interface SidebarProps {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarProps | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  const openSidebar = () => {
    setOpen(true);
    document.body.style.overflowY = "hidden";
    document.body.style.isolation = "isolate";
  };

  const closeSidebar = () => {
    setOpen(false);
    document.body.style.overflowY = "auto";
    document.body.style.isolation = "auto";
  };

  return (
    <SidebarContext.Provider value={{ open, openSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
}

export const useSidebarState = () => {
  const state = useContext(SidebarContext);
  if (!state) throw new Error("Cannot find SidebarContext Provider");
  return state;
};

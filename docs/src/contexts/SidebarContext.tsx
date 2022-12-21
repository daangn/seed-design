import React, { createContext, useContext, useState } from "react";

interface SidebarProps {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
}

const SidebarContext = createContext<SidebarProps | null>(null);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

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

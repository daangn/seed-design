import React from "react";

import Header from "./components/Header";
import Searchbar from "./components/Searchbar";
import { SidebarProvider } from "./contexts/SidebarContext";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <Header />
      <Searchbar />
      <div>{children}</div>
    </SidebarProvider>
  );
};

export default Root;

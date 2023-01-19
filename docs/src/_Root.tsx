import type { PropsWithChildren } from "react";
import React from "react";

import Searchbar from "./components/Searchbar";
import { SearchbarProvider } from "./contexts/SearchbarContext";
import { SidebarProvider } from "./contexts/SidebarContext";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <SearchbarProvider>{children}</SearchbarProvider>
    </SidebarProvider>
  );
};

const Root = ({ children }: PropsWithChildren) => {
  return (
    <Providers>
      <Searchbar />
      {children}
    </Providers>
  );
};

export default Root;

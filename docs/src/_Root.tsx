import { MotionConfig } from "framer-motion";
import type { PropsWithChildren } from "react";
import React from "react";

import Searchbar from "./components/Searchbar";
import { SearchbarProvider } from "./contexts/SearchbarContext";
import { SidebarProvider } from "./contexts/SidebarContext";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <SidebarProvider>
      <SearchbarProvider>
        {/* 
          url: https://www.framer.com/motion/motion-config/###reducedmotion
          user prefers reduced motion을 위한 설정 
          x, y와 같은 transform은 적용되지만, opacity는 적용되지 않음
        */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </SearchbarProvider>
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

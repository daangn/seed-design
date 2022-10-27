import React from "react";

import Drawer from "./components/Drawer";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <React.Fragment>
      <Drawer />
      {children}
    </React.Fragment>
  );
};

export default Root;

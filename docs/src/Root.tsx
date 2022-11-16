import React from "react";

import { ThemeProvider } from "./contexts/ThemeContext";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};

export default Root;

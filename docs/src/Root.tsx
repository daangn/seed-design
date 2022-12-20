import React from "react";

import Searchbar from "./components/Searchbar";

// import Header from "./components/Header";
// import { ThemeProvider } from "./contexts/ThemeContext";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <>
      <Searchbar />
      <div>{children}</div>
    </>
    // <ThemeProvider>
    // </ThemeProvider>
  );
};

export default Root;

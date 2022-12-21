import React from "react";

import Header from "./components/Header";
import Searchbar from "./components/Searchbar";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <>
      <Header />
      <Searchbar />
      <div>{children}</div>
    </>
  );
};

export default Root;

import React from "react";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return <React.Fragment>{children}</React.Fragment>;
};

export default Root;

import React from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import { ThemeProvider } from "./contexts/ThemeContext";
import * as t from "./styles/token.css";

interface RootProps {
  children: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <main className={t.main}>
        <Header />
        <Sidebar />
        {children}
      </main>
    </ThemeProvider>
  );
};

export default Root;

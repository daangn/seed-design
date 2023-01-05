import type { PropsWithChildren } from "react";

import * as t from "../styles/token.css";
import Header from "./Header";
import * as style from "./PageLayout.css";
import Sidebar from "./Sidebar";

const PageLayout = ({ children }: PropsWithChildren) => {
  return (
    <main className={t.main}>
      <Header />
      <Sidebar />
      <article className={style.content}>{children}</article>
    </main>
  );
};

export default PageLayout;

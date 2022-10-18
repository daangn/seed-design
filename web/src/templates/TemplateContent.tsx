import type { HeadFC } from "gatsby";
import React from "react";

import Layout from "../components/Layout";

interface TemplatePostProps {
  children: React.ReactNode;
}

const TemplateContent: React.FC<TemplatePostProps> = ({ children }) => {
  return (
    <Layout>
      <main
        style={{
          maxWidth: "900px",
          margin: "50px auto",
          wordBreak: "keep-all",
          overflowWrap: "break-word",
          lineHeight: "1.7",
          letterSpacing: "-0.04px",
        }}
      >
        {children}
      </main>
    </Layout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default TemplateContent;

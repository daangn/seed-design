import React from "react";

import Layout from "../components/Layout";

interface TemplatePostProps {
  children: React.ReactNode;
}

const TemplateContent: React.FC<TemplatePostProps> = ({ children }) => {
  return (
    <Layout>
      <main style={{ maxWidth: "900px", margin: "auto" }}>{children}</main>
    </Layout>
  );
};

export default TemplateContent;

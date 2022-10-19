import type { HeadFC } from "gatsby";
import React from "react";

import ContentCard from "../components/ContentCard";
import Darwer from "../components/Darwer";
import Layout from "../components/Layout";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    id: string;
    slug: string;
    allMdx: GatsbyTypes.ContentsQuery["allMdx"];
  };
}

const TemplateContent: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <Layout>
      <Darwer>
        {pageContext.allMdx.nodes.map((node) => (
          <ContentCard currentSlug={pageContext.slug} content={node} />
        ))}
      </Darwer>
      <main>
        <section
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
        </section>
      </main>
    </Layout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default TemplateContent;

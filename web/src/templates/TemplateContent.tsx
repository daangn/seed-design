import type { HeadFC } from "gatsby";
import React from "react";

import ContentCard from "../components/ContentCard";
import DocumentEditLink from "../components/DocumentEditLink";
import Drawer from "../components/Drawer";
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
      <Drawer>
        {pageContext.allMdx.nodes.map((node) => (
          <ContentCard
            key={node.frontmatter?.slug}
            currentSlug={pageContext.slug}
            content={node}
          />
        ))}
      </Drawer>
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
          <DocumentEditLink slug={pageContext.slug} />
        </section>
      </main>
    </Layout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default TemplateContent;

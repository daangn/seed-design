import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import React from "react";

import DocumentEditLink from "../components/DocumentEditLink";
import Layout from "../components/Layout";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    slug: string;
  };
}

const OverviewContentTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <Layout>
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
          <motion.div
            initial={{
              opacity: 0,
              x: -10,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
          >
            {children}
          </motion.div>
          <DocumentEditLink slug={pageContext.slug} />
        </section>
      </main>
    </Layout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default OverviewContentTemplate;

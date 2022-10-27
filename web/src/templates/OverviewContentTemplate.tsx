import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import React from "react";

import DocumentEditLink from "../components/DocumentEditLink";
import Layout from "../components/Layout";
import * as style from "./OverviewContentTemplate.css";

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
      <main className={style.main}>
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
      </main>
    </Layout>
  );
};

export const Head: HeadFC = () => <title>Component page</title>;

export default OverviewContentTemplate;

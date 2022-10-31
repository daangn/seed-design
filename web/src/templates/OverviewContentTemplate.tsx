import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import React from "react";

import DocumentLayout from "../components/DocumentLayout";
import EditLink from "../components/EditLink";
import * as style from "./OverviewContentTemplate.css";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    slug: string;
    title: string;
    description: string;
    ogImageSrc: string;
  };
}

const OverviewContentTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <DocumentLayout>
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
        <EditLink slug={pageContext.slug} />
      </main>
    </DocumentLayout>
  );
};

export const Head: HeadFC<{}, TemplatePostProps["pageContext"]> = ({
  pageContext,
}) => {
  return (
    <>
      <title>Overview - {pageContext.title}</title>
      <meta
        property="og:title"
        content={`Seed Design | Overviews | ${pageContext.title}`}
      />
      <meta property="description" content={pageContext.description} />
      <meta property="og:image" content={pageContext.ogImageSrc} />
    </>
  );
};

export default OverviewContentTemplate;

import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import DocumentLayout from "../components/DocumentLayout";
import EditLink from "../components/EditLink";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import { commonFadeInMotion } from "../constants";
import * as style from "./OverviewContentTemplate.css";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    slug: string;
    title: string;
    description: string;
    ogImage: IGatsbyImageData;
    tableOfContents: TableOfContentsType;
  };
}

const OverviewContentTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <DocumentLayout>
      <main className={style.main}>
        <article className={style.content}>
          <motion.div {...commonFadeInMotion}>{children}</motion.div>
          <EditLink slug={pageContext.slug} />
        </article>
        <motion.div {...commonFadeInMotion}>
          <TableOfContents tableOfContents={pageContext.tableOfContents} />
        </motion.div>
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
      <meta property="og:image" content={getSrc(pageContext.ogImage)} />
    </>
  );
};

export default OverviewContentTemplate;

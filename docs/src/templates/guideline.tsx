import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import BreadCrumbs from "../components/BreadCrumbs";
import EditLink from "../components/EditLink";
import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import { fadeInFromLeft } from "../framer-motions";
import * as t from "../styles/token.css";
import * as style from "./template.css";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    title: string;
    description: string;
    slug: string;
    activeTab: string;
    ogImage: IGatsbyImageData;
    tableOfContents: TableOfContentsType;
  };
}

const GuidelineTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  return (
    <Layout>
      <main className={t.main}>
        <Sidebar />
        <article className={style.content}>
          <BreadCrumbs slug={pageContext.slug} />
          <h1 className={style.title}>{pageContext.title}</h1>
          <p className={style.titleDescription}>{pageContext.description}</p>
          <motion.div {...fadeInFromLeft}>{children}</motion.div>
          <EditLink slug={pageContext.slug} file={pageContext.activeTab} />
        </article>
        <TableOfContents tableOfContents={pageContext.tableOfContents} />
      </main>
    </Layout>
  );
};

export const Head: HeadFC<{}, TemplatePostProps["pageContext"]> = ({
  pageContext,
}) => {
  return (
    <>
      <title>사용 가이드 - {pageContext.title}</title>
      <meta
        property="og:title"
        content={`Seed Design | 사용 가이드 | ${pageContext.title}`}
      />
      <meta property="description" content={pageContext.description} />
      <meta property="og:image" content={getSrc(pageContext.ogImage)} />
    </>
  );
};

export default GuidelineTemplate;

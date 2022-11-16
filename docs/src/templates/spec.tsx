import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import BreadCrumbs from "../components/BreadCrumbs";
import DocumentLayout from "../components/DocumentLayout";
import EditLink from "../components/EditLink";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import { fadeInFromLeft } from "../framer-motions";
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

const SpecTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  // NOTE: /components/overview/spec/primitive -> /components/overview/spec
  const commonPath = pageContext.slug.split("/").slice(0, 4).join("/");

  return (
    <DocumentLayout>
      <article className={style.content}>
        <BreadCrumbs />
        <h1 className={style.title}>{pageContext.title}</h1>
        <p className={style.titleDescription}>{pageContext.description}</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <Link
            to={`${commonPath}/primitive`}
            className={style.tabLink({
              active: pageContext.activeTab === "primitive",
            })}
          >
            Primitive
          </Link>
          <Link
            to={`${commonPath}/visual`}
            className={style.tabLink({
              active: pageContext.activeTab === "visual",
            })}
          >
            Visual
          </Link>
        </div>
        <motion.div {...fadeInFromLeft}>{children}</motion.div>
        <EditLink slug={pageContext.slug} file={pageContext.activeTab} />
      </article>
      <motion.div {...fadeInFromLeft}>
        <TableOfContents tableOfContents={pageContext.tableOfContents} />
      </motion.div>
    </DocumentLayout>
  );
};

export const Head: HeadFC<{}, TemplatePostProps["pageContext"]> = ({
  pageContext,
}) => {
  return (
    <>
      <title>스펙 - {pageContext.title}</title>
      <meta
        property="og:title"
        content={`Seed Design | 스펙 | ${pageContext.title}`}
      />
      <meta property="description" content={pageContext.description} />
      <meta property="og:image" content={getSrc(pageContext.ogImage)} />
    </>
  );
};

export default SpecTemplate;

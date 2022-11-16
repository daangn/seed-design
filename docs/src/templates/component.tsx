import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import DocumentLayout from "../components/DocumentLayout";
import EditLink from "../components/EditLink";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import { fadeInFromLeft } from "../framer-motions";
import * as style from "./component.css";

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

const ComponentsContentTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  // NOTE: /components/overview/primitive -> /components/overview
  const commonPath = pageContext.slug.split("/").slice(0, 3).join("/");

  return (
    <DocumentLayout>
      <main className={style.main}>
        <Header />
        <Sidebar />
        <article className={style.content}>
          <h1 className={style.title}>{pageContext.title}</h1>
          <p className={style.titleDescription}>{pageContext.description}</p>
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <p style={{ textAlign: "center" }}>Guildlines</p>
              <Link
                to={`${commonPath}/usage`}
                className={style.tabLink({
                  active: pageContext.activeTab === "usage",
                })}
              >
                Usage
              </Link>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              <p style={{ textAlign: "center" }}>Spec</p>
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
          </div>
          <motion.div {...fadeInFromLeft}>{children}</motion.div>
          <EditLink slug={pageContext.slug} file={pageContext.activeTab} />
        </article>
        <motion.div {...fadeInFromLeft}>
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
      <title>Components - {pageContext.title}</title>
      <meta
        property="og:title"
        content={`Seed Design | Components | ${pageContext.title}`}
      />
      <meta property="description" content={pageContext.description} />
      <meta property="og:image" content={getSrc(pageContext.ogImage)} />
    </>
  );
};

export default ComponentsContentTemplate;

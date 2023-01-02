import { MDXProvider } from "@mdx-js/react";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";

import EditLink from "../components/EditLink";
import MdxComponents from "../components/mdx/MdxComponents";
import Sidebar from "../components/Sidebar";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import { fadeInFromBottom } from "../framer-motions";
import * as t from "../styles/token.css";
import * as style from "./docs-primitive.css";

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

const DocsTemplate: React.FC<TemplatePostProps> = ({
  pageContext,
  children,
}) => {
  const { title, description, slug, activeTab, tableOfContents } = pageContext;
  return (
    <MDXProvider components={MdxComponents}>
      <main className={t.main}>
        <Sidebar />
        <article className={style.content}>
          <h1 className={style.title}>{title}</h1>
          <p className={style.titleDescription}>{description}</p>
          <motion.div {...fadeInFromBottom}>{children}</motion.div>
          <EditLink slug={slug} file={activeTab} />
        </article>
        <TableOfContents tableOfContents={tableOfContents} />
      </main>
    </MDXProvider>
  );
};

export const Head: HeadFC<{}, TemplatePostProps["pageContext"]> = ({
  pageContext,
}) => {
  const { title, description, ogImage } = pageContext;
  return (
    <>
      <title>{title}</title>
      <meta property="og:title" content={`Seed Design | ${title}`} />
      <meta property="description" content={description} />
      <meta property="og:image" content={getSrc(ogImage)} />
    </>
  );
};

export default DocsTemplate;

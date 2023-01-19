import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";

import EditLink from "../components/EditLink";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import { fadeInFromBottom } from "../framer-motions";
import * as style from "./docs-primitive.css";

interface TemplatePostProps {
  children: React.ReactNode;
  pageContext: {
    name: string;
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
  const { name, description, slug, tableOfContents } = pageContext;
  return (
    <>
      <article className={style.content}>
        <h1 className={style.title}>{name}</h1>
        <p className={style.titleDescription}>{description}</p>
        <motion.div {...fadeInFromBottom}>{children}</motion.div>
        <EditLink slug={slug} />
      </article>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
};

export const Head: HeadFC<{}, TemplatePostProps["pageContext"]> = ({
  pageContext,
}) => {
  const { name, description, ogImage } = pageContext;
  return (
    <>
      <title>{name}</title>
      <meta property="og:title" content={`Seed Design | ${name}`} />
      <meta property="description" content={description} />
      <meta property="og:image" content={getSrc(ogImage)} />
    </>
  );
};

export default DocsTemplate;

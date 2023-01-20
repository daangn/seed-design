import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import type { IGatsbyImageData } from "gatsby-plugin-image";
import { getSrc } from "gatsby-plugin-image";

import EditLink from "../components/EditLink";
import type { TableOfContentsType } from "../components/TableOfContents";
import TableOfContents from "../components/TableOfContents";
import * as style from "./docs-component.css";

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

        <div className={style.navContainer}>
          <Link
            className={style.navLink({ active: slug.includes("usage") })}
            to={`${slug.split("/").slice(0, -1).join("/")}/usage`}
          >
            Usage
          </Link>
          <Link
            className={style.navLink({ active: slug.includes("overview") })}
            to={`${slug.split("/").slice(0, -1).join("/")}/overview`}
          >
            Overview
          </Link>
          <Link
            className={style.navLink({ active: slug.includes("style") })}
            to={`${slug.split("/").slice(0, -1).join("/")}/style`}
          >
            Style
          </Link>
        </div>
        <div>{children}</div>
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
      <title>{name} | SEED Design</title>
      <meta property="og:title" content={`${name} | SEED Design`} />
      <meta property="description" content={description} />
      <meta property="og:image" content={getSrc(ogImage)} />
    </>
  );
};

export default DocsTemplate;

import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import EditLink from "../components/EditLink";
import TableOfContents from "../components/TableOfContents";
import * as style from "./PrimitiveCommon.css";

export const query = graphql`
  query PrimitiveDocTemplate($id: String) {
    allPrimitiveMetaJson(id: { eq: $id }) {
      name
      description
      primitive {
        childMdx {
          tableOfContents
          frontmatter {
            slug
          }
        }
      }
    }

    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const DocsTemplate: React.FC<
  PageProps<GatsbyTypes.PrimitiveDocTemplateQuery>
> = ({ data, children, path }) => {
  const { name, description } = data.allPrimitiveMetaJson!;
  const tableOfContents =
    data.allPrimitiveMetaJson?.primitive?.childMdx?.tableOfContents;
  return (
    <>
      <article className={style.content}>
        <h1 className={style.title}>{name}</h1>
        <p className={style.titleDescription}>{description}</p>
        <div>{children}</div>
        <EditLink slug={path} />
      </article>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
};

export const Head: HeadFC<GatsbyTypes.PrimitiveDocTemplateQuery> = ({
  data,
}) => {
  const { name, description } = data.allPrimitiveMetaJson!;
  const ogImage = data.ogImage;
  return (
    <>
      <title>{name} | SEED Design</title>
      <meta property="og:title" content={`${name} | SEED Design`} />
      <meta property="description" content={description!} />
      <meta property="og:image" content={getSrc(ogImage!)} />
    </>
  );
};

export default DocsTemplate;

import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import ComponentDocumentCategoryNav from "../components/ComponentDocumentCategoryNav";
import EditLink from "../components/EditLink";
import TableOfContents from "../components/TableOfContents";
import * as style from "./ComponentCommon.css";

export const query = graphql`
  query ComponentOverview($id: String) {
    allComponentMetaJson(id: { eq: $id }) {
      name
      description
      platform {
        docs {
          overview {
            status
            mdx {
              childMdx {
                tableOfContents
              }
            }
          }
          usage {
            status
          }
          style {
            status
          }
        }
      }
    }

    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const DocsTemplate: React.FC<PageProps<GatsbyTypes.ComponentOverviewQuery>> = ({
  data,
  path,
  children,
}) => {
  const { name, description, platform } = data.allComponentMetaJson!;
  const tableOfContents =
    platform?.docs?.overview?.mdx?.childMdx?.tableOfContents!;
  const overviewStatus = platform?.docs?.overview?.status!;
  const usageStatus = platform?.docs?.usage?.status!;
  const styleStatus = platform?.docs?.style?.status!;

  return (
    <>
      <article className={style.content}>
        <h1 className={style.title}>{name}</h1>
        <p className={style.titleDescription}>{description}</p>
        <ComponentDocumentCategoryNav
          path={path}
          overviewStatus={overviewStatus}
          usageStatus={usageStatus}
          styleStatus={styleStatus}
        />
        <div>{children}</div>
        <EditLink slug={path} />
      </article>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
};

export const Head: HeadFC<GatsbyTypes.ComponentOverviewQuery> = ({ data }) => {
  const { name, description } = data.allComponentMetaJson!;
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

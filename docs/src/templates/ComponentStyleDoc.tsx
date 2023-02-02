import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";

import ComponentDocumentCategoryNav from "../components/ComponentDocumentCategoryNav";
import EditLink from "../components/EditLink";
import SEO from "../components/SEO";
import TableOfContents from "../components/TableOfContents";
import * as style from "./ComponentCommon.css";

export const query = graphql`
  query ComponentStyle($id: String) {
    componentMetaJson(id: { eq: $id }) {
      name
      description
      platform {
        docs {
          overview {
            status
          }
          usage {
            status
          }
          style {
            status
            mdx {
              childMdx {
                tableOfContents
              }
            }
          }
        }
      }
    }
  }
`;

const DocsTemplate: React.FC<PageProps<GatsbyTypes.ComponentStyleQuery>> = ({
  data,
  path,
  children,
}) => {
  const { name, description, platform } = data.componentMetaJson!;
  const tableOfContents =
    platform?.docs?.style?.mdx?.childMdx?.tableOfContents!;
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

export const Head: HeadFC<GatsbyTypes.ComponentStyleQuery> = ({ data }) => {
  const { name, description } = data.componentMetaJson!;
  return <SEO name={`${name}`} description={`${description}`} />;
};

export default DocsTemplate;

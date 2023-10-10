import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";

import ComponentDocumentTopContent from "../components/ComponentDocumentTopContent";
import SEO from "../components/SEO";
import TableOfContents from "../components/TableOfContents";
import * as style from "./ComponentCommon.css";

export const query = graphql`
  query ComponentUsage($id: String) {
    componentMetaJson(id: { eq: $id }) {
      name
      description
      platform {
        docs {
          usage {
            mdx {
              childMdx {
                tableOfContents
              }
            }
          }
        }
      }
      primitive {
        childPrimitiveMetaJson {
          primitive {
            childMdx {
              frontmatter {
                slug
              }
            }
          }
        }
      }
    }
  }
`;

const DocsTemplate: React.FC<PageProps<GatsbyTypes.ComponentUsageQuery>> = ({
  data,
  path,
  children,
}) => {
  const { name, description, platform, primitive } = data.componentMetaJson!;
  const tableOfContents =
    platform?.docs?.usage?.mdx?.childMdx?.tableOfContents!;
  const primitiveLink =
    primitive?.childPrimitiveMetaJson?.primitive?.childMdx?.frontmatter?.slug!;

  console.log("primitiveLink", primitiveLink);

  return (
    <>
      <article className={style.content}>
        <ComponentDocumentTopContent
          primitiveLink={primitiveLink}
          title={name!}
          description={description!}
          path={path}
        />
        <div>{children}</div>
      </article>
      <TableOfContents tableOfContents={tableOfContents} />
    </>
  );
};

export const Head: HeadFC<GatsbyTypes.ComponentUsageQuery> = ({ data }) => {
  const { name, description } = data.componentMetaJson!;
  return <SEO name={`${name}`} description={`${description}`} />;
};

export default DocsTemplate;

import type { HeadFC, PageProps } from "gatsby";
import { graphql, Slice } from "gatsby";

import SEO from "../components/SEO";
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
        <Slice alias="ui/EditLink" slug={path} />
      </article>
      <Slice alias="ui/TOC" tableOfContents={tableOfContents} />
    </>
  );
};

export const Head: HeadFC<GatsbyTypes.PrimitiveDocTemplateQuery> = ({
  data,
}) => {
  const { name, description } = data.allPrimitiveMetaJson!;
  return <SEO name={`${name}`} description={`${description}`} />;
};

export default DocsTemplate;

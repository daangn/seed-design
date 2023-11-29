import type { HeadFC } from "gatsby";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import SEO from "../../components/SEO";
import * as listPageStyle from "../../styles/page-styles/list.css";

interface PageProps {
  data: GatsbyTypes.PrimitiveListPageQuery;
}

export const query = graphql`
  query PrimitiveListPage {
    allPrimitiveMetaJson(sort: { name: ASC }) {
      nodes {
        name
        description
        thumbnail {
          childImageSharp {
            gatsbyImageData
          }
        }
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
`;

const Page = ({ data }: PageProps) => {
  const primitivieNodes = data.allPrimitiveMetaJson.nodes;

  return (
    <article className={listPageStyle.content}>
      <h1 className={listPageStyle.title}>Primitive</h1>
      <p className={listPageStyle.caption1}>
        컴포넌트의 시각적 정의를 제외한 본질적인 기능과 동작에 대한 정의
      </p>
      <div className={listPageStyle.grid}>
        {primitivieNodes?.map((node) => {
          const title = node.name!;
          const description = node.description!;
          const thumbnail = node.thumbnail?.childImageSharp?.gatsbyImageData!;
          const slug = node.primitive?.childMdx?.frontmatter?.slug!;

          return (
            <Link key={slug} to={slug}>
              <div className={listPageStyle.activeGridItem}>
                <div className={listPageStyle.gridItemImage}>
                  <GatsbyImage
                    draggable={false}
                    image={thumbnail}
                    alt={title}
                  />
                </div>
                <h2 className={listPageStyle.gridItemTitle}>{title}</h2>
                <p className={listPageStyle.gridItemDescription}>
                  {description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </article>
  );
};

// TODO: 수정하기
export const Head: HeadFC = () => {
  return (
    <SEO
      name={`Primitives`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default Page;

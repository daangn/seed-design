import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import groupby from "lodash/groupBy";

import SEO from "../../components/SEO";
import * as listPageStyle from "../../styles/page-styles/list.css";

interface PageProps {
  data: GatsbyTypes.ComponentListPageQuery;
}

export const query = graphql`
  query ComponentListPage {
    allComponentMetaJson(sort: { name: ASC }) {
      nodes {
        name
        group
        description
        thumbnail {
          childImageSharp {
            gatsbyImageData
          }
        }
        platform {
          docs {
            usage {
              status
              mdx {
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
    }
  }
`;

const Page = ({ data }: PageProps) => {
  const componentNodes = data.allComponentMetaJson.nodes;
  const groupedComponentData = groupby(componentNodes, (data) =>
    !data.group ? data.name : data.group,
  );
  const mappedComponentData = Object.entries(groupedComponentData!)
    .map(([groupName, groupItems]) => ({ groupName, groupItems }))
    .sort((a, b) => (a.groupName < b.groupName ? -1 : 1));

  return (
    <article className={listPageStyle.content}>
      <h1 className={listPageStyle.title}>Component</h1>
      <p className={listPageStyle.caption1}>
        컴포넌트의 시각적 정의와 올바른 상호작용을 위한 UX가이드
      </p>
      <div className={listPageStyle.grid}>
        {mappedComponentData?.map((node) => {
          const groupName = node.groupItems.length > 1 ? node.groupName : "";

          return node.groupItems.map((node) => {
            const description = node.description;
            const title = node.name;
            const thumbnail = node.thumbnail?.childImageSharp?.gatsbyImageData!;
            const slug =
              node.platform?.docs?.usage?.mdx?.childMdx?.frontmatter?.slug!;
            const isNotReadyUsagePage =
              node.platform?.docs?.usage?.status === "todo";

            if (isNotReadyUsagePage) {
              return (
                <div className={listPageStyle.gridItem}>
                  <div className={listPageStyle.gridItemImage}>
                    <GatsbyImage
                      draggable={false}
                      image={thumbnail}
                      alt={title!}
                    />
                  </div>
                  <h2
                    className={clsx(
                      listPageStyle.gridNotReadyText,
                      listPageStyle.gridItemTitle,
                    )}
                  >
                    {title}
                  </h2>
                  <p
                    className={clsx(
                      listPageStyle.gridNotReadyText,
                      listPageStyle.gridItemDescription,
                    )}
                  >
                    {description}
                  </p>
                </div>
              );
            }

            return (
              <Link key={slug} to={slug}>
                <div className={listPageStyle.activeGridItem}>
                  <div className={listPageStyle.gridItemImage}>
                    <GatsbyImage
                      draggable={false}
                      image={thumbnail}
                      alt={title!}
                    />
                  </div>

                  <h2 className={listPageStyle.gridItemTitle}>
                    {title}
                    <span className={listPageStyle.gridItemGroupText}>
                      {groupName}
                    </span>
                  </h2>
                  <p className={listPageStyle.gridItemDescription}>
                    {description}
                  </p>
                </div>
              </Link>
            );
          });
        })}
      </div>
    </article>
  );
};

// TODO: 수정하기
export const Head: HeadFC<GatsbyTypes.ComponentListPageQuery> = () => {
  return (
    <SEO
      name={`Components`}
      description={`SEED는 메이커들이 효율적으로 제품을 만들 수 있도록 필요한 도구와 컴포넌트를 제공합니다. SEED에서 제공하는 컴포넌트의 Usage 가이드, Spec 가이드를 확인할 수 있습니다.`}
    />
  );
};

export default Page;

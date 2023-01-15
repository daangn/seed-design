import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import PageLayout from "../../components/PageLayout";
import { elevateUp, fadeInFromBottom } from "../../framer-motions";
import * as listPageStyle from "../../styles/page-styles/list-page.css";

interface PageProps {
  data: GatsbyTypes.ComponentListPageQuery;
}

export const query = graphql`
  query ComponentListPage {
    allComponentInfoJson {
      nodes {
        items {
          name
          platform {
            docs {
              usage {
                mdx {
                  childMdx {
                    ...ListPageMdxContent
                  }
                }
              }
            }
          }
        }
      }
    }

    comingSoonImage: imageSharp(
      fluid: { originalName: { eq: "comingSoon.png" } }
    ) {
      gatsbyImageData
    }
  }
`;

const Page = ({ data }: PageProps) => {
  const docs = data.allComponentInfoJson.nodes;

  return (
    <PageLayout>
      <h1 className={listPageStyle.title}>Component</h1>
      <p className={listPageStyle.caption1}>
        컴포넌트의 시각적 정의와 올바른 상호작용을 위한 UX가이드
      </p>
      <motion.div className={listPageStyle.grid} {...fadeInFromBottom}>
        {docs?.map((doc) => {
          return doc?.items?.map((item) => {
            if (!item?.platform?.docs?.usage?.mdx) {
              return (
                <motion.div className={listPageStyle.gridItem}>
                  <div className={listPageStyle.gridItemImage}>
                    <GatsbyImage
                      draggable={false}
                      image={data.comingSoonImage?.gatsbyImageData!}
                      alt={item?.name!}
                    />
                  </div>
                  <h2 className={listPageStyle.gridItemTitle}>{item?.name!}</h2>
                  <p className={listPageStyle.gridItemDescription}>
                    준비중입니다.
                  </p>
                </motion.div>
              );
            }

            const description =
              item.platform.docs.usage.mdx.childMdx?.frontmatter?.description!;
            const title =
              item.platform.docs.usage.mdx.childMdx?.frontmatter?.title!;
            const thumbnail =
              item.platform.docs.usage.mdx.childMdx?.frontmatter?.thumbnail
                ?.childImageSharp?.gatsbyImageData!;
            const slug =
              item.platform.docs.usage.mdx.childMdx?.frontmatter?.slug!;

            return (
              <Link key={slug} to={slug}>
                <motion.div {...elevateUp} className={listPageStyle.gridItem}>
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
                </motion.div>
              </Link>
            );
          });
        })}
      </motion.div>
    </PageLayout>
  );
};

// TODO: 수정하기
export const Head: HeadFC<GatsbyTypes.ComponentListPageQuery> = () => {
  return (
    <>
      <title>Seed Design | Component</title>
      <meta property="og:title" content="Seed Design | Component" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
    </>
  );
};

export default Page;

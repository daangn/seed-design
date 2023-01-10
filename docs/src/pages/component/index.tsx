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
    configsJson {
      component {
        usage {
          childMdx {
            ...ListPageMdxContent
          }
        }
      }
    }
  }
`;

const Page = ({ data }: PageProps) => {
  const docs = data.configsJson?.component;

  return (
    <PageLayout>
      <h1 className={listPageStyle.title}>Component</h1>
      <p className={listPageStyle.caption1}>
        컴포넌트의 시각적 정의와 올바른 상호작용을 위한 UX가이드
      </p>
      <motion.div className={listPageStyle.grid} {...fadeInFromBottom}>
        {docs?.map((doc) => {
          if (!doc?.usage?.childMdx?.frontmatter) return null;
          const { description, slug, thumbnail, title } =
            doc?.usage?.childMdx?.frontmatter!;
          return (
            <Link key={slug} to={slug!}>
              <motion.div {...elevateUp} className={listPageStyle.gridItem}>
                <div className={listPageStyle.gridItemImage}>
                  <GatsbyImage
                    draggable={false}
                    image={thumbnail?.childImageSharp?.gatsbyImageData!}
                    alt={title!}
                  />
                </div>
                <h2 className={listPageStyle.gridItemTitle}>{title}</h2>
                <p className={listPageStyle.gridItemDescription}>
                  {description}
                </p>
              </motion.div>
            </Link>
          );
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

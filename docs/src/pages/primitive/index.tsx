import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";

import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { elevateUp, fadeInFromBottom } from "../../framer-motions";
import * as listPageStyle from "../../styles/list-page.css";
import * as t from "../../styles/token.css";

interface PageProps {
  data: GatsbyTypes.PrimitiveListPageQuery;
}

export const query = graphql`
  query PrimitiveListPage {
    configsJson {
      primitive {
        document {
          childMdx {
            ...ListPageMdxContent
          }
        }
      }
    }
  }
`;

const Page = ({ data }: PageProps) => {
  const docs = data.configsJson?.primitive;

  return (
    <main className={t.main}>
      <Header />
      <Sidebar />
      <article className={listPageStyle.content}>
        <h1 className={listPageStyle.title}>Primitive</h1>
        <p className={listPageStyle.caption1}>
          컴포넌트의 시각적 정의를 제외한 본질적인 기능과 동작에 대한 정의
        </p>
        <motion.div className={listPageStyle.grid} {...fadeInFromBottom}>
          {docs?.map((doc) => {
            const { description, slug, thumbnail, title } =
              doc?.document?.childMdx?.frontmatter!;
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
      </article>
    </main>
  );
};

// TODO: 수정하기
export const Head: HeadFC<GatsbyTypes.PrimitiveListPageQuery> = () => {
  return (
    <>
      <title>Seed Design | Primitive</title>
      <meta property="og:title" content="Seed Design | Primitive" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
    </>
  );
};

export default Page;

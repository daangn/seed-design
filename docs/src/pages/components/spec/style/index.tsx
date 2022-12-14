import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import * as React from "react";

import Sidebar from "../../../../components/Sidebar";
import { fadeInFromBottom } from "../../../../framer-motions";
import * as style from "../../../../styles/components.page.css";
import * as t from "../../../../styles/token.css";

interface PageProps {
  data: GatsbyTypes.StylePageQuery;
}

export const query = graphql`
  query StylePage {
    configsJson {
      components {
        spec {
          style {
            document {
              childMdx {
                frontmatter {
                  description
                  slug
                  title
                  thumbnail {
                    childImageSharp {
                      gatsbyImageData
                    }
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
  const docs = data.configsJson?.components?.spec?.style;

  return (
    <main className={t.main}>
      <Sidebar />
      <article className={style.content}>
        <h1 className={style.title}>Spec - Style</h1>
        <p className={style.caption1}>
          {/* TODO: 수정하기 */}
          Styles are headless components that are used to build other
          components.
        </p>
        <motion.div className={style.grid} {...fadeInFromBottom}>
          {docs?.map((doc) => {
            const { description, slug, thumbnail, title } =
              doc?.document?.childMdx?.frontmatter!;
            return (
              <Link key={slug} to={slug!}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={style.gridItem}
                >
                  <div className={style.gridItemImage}>
                    <GatsbyImage
                      draggable={false}
                      image={thumbnail?.childImageSharp?.gatsbyImageData!}
                      alt={title!}
                    />
                  </div>
                  <h2 className={style.gridItemTitle}>{title}</h2>
                  <p className={style.gridItemDescription}>{description}</p>
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
export const Head: HeadFC<GatsbyTypes.StylePageQuery> = () => {
  return (
    <>
      <title>Seed Design | 스펙</title>
      <meta property="og:title" content="Seed Design | 스펙" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
    </>
  );
};

export default Page;

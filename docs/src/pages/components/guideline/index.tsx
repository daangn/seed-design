import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";

import Layout from "../../../components/Layout";
import { fadeInFromTop } from "../../../framer-motions";
import * as style from "../../../styles/components.page.css";

interface PageProps {
  data: GatsbyTypes.GuidelinePageQuery;
}

export const query = graphql`
  query GuidelinePage {
    configsJson {
      guideline {
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
`;

const Page = ({ data }: PageProps) => {
  const guidelines = data.configsJson?.guideline!;

  return (
    <Layout>
      <article className={style.content}>
        <motion.h1 {...fadeInFromTop} className={style.title}>
          사용 가이드
        </motion.h1>
        <motion.p
          transition={{ delay: 0.1 }}
          {...fadeInFromTop}
          className={style.caption1}
        >
          Components are the building blocks of any design system. They are
          the... 대충 이렇게 멋있는 말들 써놓으면 멋있어보이더라구요...
        </motion.p>
        <motion.div className={style.grid} {...fadeInFromTop}>
          {guidelines.map((guideline) => (
            <Link key={guideline?.slug!} to={guideline?.slug!}>
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={style.gridItem}
              >
                <div className={style.gridItemImage}>
                  <GatsbyImage
                    draggable={false}
                    image={
                      guideline?.thumbnail?.childImageSharp?.gatsbyImageData!
                    }
                    alt={guideline?.title!}
                  />
                </div>
                <h2 className={style.gridItemTitle}>{guideline?.title}</h2>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </article>
    </Layout>
  );
};

export const Head: HeadFC<GatsbyTypes.GuidelinePageQuery> = () => {
  return (
    <>
      <title>Seed Design | 사용 가이드</title>
      <meta property="og:title" content="Seed Design | 사용 가이드" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
    </>
  );
};

export default Page;

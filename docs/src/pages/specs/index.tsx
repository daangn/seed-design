import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";

import { fadeInFromTop } from "../../framer-motions";
import * as style from "../../styles/components.page.css";

interface PageProps {
  data: GatsbyTypes.SpecsPage;
}

export const query = graphql`
  query SpecsPage {
    configsJson {
      specs {
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
  const specs = data.configsJson?.specs!;

  return (
    <main>
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
        <div className={style.grid}>
          {specs.map((spec, index) => (
            <Link key={spec?.slug!} to={spec?.slug!}>
              <motion.div
                initial={fadeInFromTop.initial}
                animate={{
                  ...fadeInFromTop.animate,
                  transition: { delay: 0.2 + 0.05 * index },
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className={style.gridItem}
              >
                <div className={style.gridItemImage}>
                  <GatsbyImage
                    draggable={false}
                    image={spec?.thumbnail?.childImageSharp?.gatsbyImageData!}
                    alt={spec?.title!}
                  />
                </div>
                <h2 className={style.gridItemTitle}>{spec?.title}</h2>
              </motion.div>
            </Link>
          ))}
        </div>
      </article>
    </main>
  );
};

export const Head: HeadFC<GatsbyTypes.SpecsPage> = () => {
  return (
    <>
      <title>Seed Design | 스펙</title>
      <meta property="og:title" content="Seed Design | 스펙" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
    </>
  );
};

export default Page;

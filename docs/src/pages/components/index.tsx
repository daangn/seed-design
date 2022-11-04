import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import React from "react";

import { fadeInFromTop } from "../../framer-motions";
import * as style from "../../styles/components.page.css";

interface ComponentsPageProps {
  data: GatsbyTypes.ComponentsPageQuery;
}

export const query = graphql`
  query ComponentsPage {
    configsJson {
      components {
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

const ComponentsPage = ({ data }: ComponentsPageProps) => {
  const components = data.configsJson?.components!;

  return (
    <main>
      <article className={style.content}>
        <motion.h1 {...fadeInFromTop} className={style.title}>
          Components
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
          {components.map((component, index) => (
            <Link key={component?.slug!} to={component?.slug!}>
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
                    image={
                      component?.thumbnail?.childImageSharp?.gatsbyImageData!
                    }
                    alt={component?.title!}
                  />
                </div>
                <h2 className={style.gridItemTitle}>{component?.title}</h2>
              </motion.div>
            </Link>
          ))}
        </div>
      </article>
    </main>
  );
};

export const Head: HeadFC<GatsbyTypes.ComponentsPageQuery> = () => {
  return (
    <>
      <title>Seed Design | Components</title>
      <meta property="og:title" content="Seed Design | Components" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
    </>
  );
};

export default ComponentsPage;

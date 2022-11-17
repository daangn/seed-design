import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import * as React from "react";

import { fadeInFromLeft } from "../../framer-motions";
import * as style from "../../styles/get-started.page.css";

export const query = graphql`
  query ComponentsPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const ComponentsPage = () => {
  return (
    <main>
      <motion.article className={style.content} {...fadeInFromLeft}>
        <h1 className={style.title}>Components</h1>
      </motion.article>
    </main>
  );
};

// TODO:
export const Head: HeadFC<Queries.ComponentsPageQuery> = ({ data }) => {
  return (
    <>
      <title>Components</title>
      <meta property="og:title" content={`Seed Design | Components`} />
      <meta property="description" content="Components." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default ComponentsPage;

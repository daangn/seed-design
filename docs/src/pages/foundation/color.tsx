import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import { fadeInFromLeft } from "../../framer-motions";
import * as style from "../../styles/get-started.page.css";

export const query = graphql`
  query FoundationColorPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const FoundationColorPage = () => {
  return (
    <main>
      <motion.article className={style.content} {...fadeInFromLeft}>
        <h1 className={style.title}>Color</h1>
      </motion.article>
    </main>
  );
};

// TODO:
export const Head: HeadFC<Queries.FoundationColorPageQuery> = ({ data }) => {
  return (
    <>
      <title>Foundation - Color</title>
      <meta property="og:title" content={`Seed Design | Foundation | Color`} />
      <meta property="description" content="Color." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default FoundationColorPage;

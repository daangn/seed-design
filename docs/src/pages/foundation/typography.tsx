import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import { fadeInFromBottom } from "../../framer-motions";
import * as style from "../../styles/get-started.page.css";

export const query = graphql`
  query FoundationTypographyPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const FoundationTypographyPage = () => {
  return (
    <main>
      <motion.article className={style.content} {...fadeInFromBottom}>
        <h1 className={style.title}>Typography</h1>
      </motion.article>
    </main>
  );
};

// TODO:
export const Head: HeadFC<Queries.FoundationTypographyPageQuery> = ({
  data,
}) => {
  return (
    <>
      <title>Foundation - Typography</title>
      <meta
        property="og:title"
        content={`Seed Design | Foundation | Typography`}
      />
      <meta property="description" content="Typography." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default FoundationTypographyPage;

import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import { fadeInFromBottom } from "../../framer-motions";
import * as style from "../../styles/page-styles/get-started.page.css";

export const query = graphql`
  query PrinciplePage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const PrinciplePage = () => {
  return (
    <motion.article className={style.content} {...fadeInFromBottom}>
      <h1 className={style.title}>Principle</h1>
    </motion.article>
  );
};

// TODO:
export const Head: HeadFC<Queries.PrinciplePageQuery> = ({ data }) => {
  return (
    <>
      <title>Principle | SEED Design</title>
      <meta property="og:title" content={`Principle | SEED Design`} />
      <meta property="description" content="Principle." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default PrinciplePage;

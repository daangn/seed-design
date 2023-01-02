import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import { fadeInFromBottom } from "../../framer-motions";
import * as style from "../../styles/get-started.page.css";

export const query = graphql`
  query GetStartedPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const GetStartedPage = () => {
  return (
    <main>
      <motion.article className={style.content} {...fadeInFromBottom}>
        <h1 className={style.title}>Get Started</h1>
      </motion.article>
    </main>
  );
};

// TODO:
export const Head: HeadFC<Queries.GetStartedPageQuery> = ({ data }) => {
  return (
    <>
      <title>Overview - Get Started</title>
      <meta
        property="og:title"
        content={`Seed Design | Overview | Get Started`}
      />
      <meta property="description" content="시작하시죠." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default GetStartedPage;

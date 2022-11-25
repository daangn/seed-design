import ForwardIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconForwardRegular";
import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { Link } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import * as React from "react";

import { fadeInFromBottom } from "../framer-motions";
import * as style from "../styles/index.page.css";
import * as t from "../styles/token.css";

export const query = graphql`
  query IndexPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const IndexPage = () => {
  return (
    <main className={t.main}>
      <article className={style.content}>
        <motion.h1 {...fadeInFromBottom} className={style.title}>
          SEED Design
        </motion.h1>
        <Link to="/components/guideline/">
          <motion.button
            {...fadeInFromBottom}
            transition={{ delay: 0.3 }}
            className={style.goDocsButton}
          >
            Document 보러가기
            <ForwardIcon width={20} />
          </motion.button>
        </Link>
      </article>
    </main>
  );
};

export default IndexPage;

export const Head: HeadFC<GatsbyTypes.IndexPageQuery> = ({ data }) => {
  return (
    <>
      <title>Seed Design</title>
      <meta property="og:title" content="Seed Design" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
      <meta
        property="og:image"
        content={getSrc(data.ogImage?.gatsbyImageData!)}
      />
    </>
  );
};

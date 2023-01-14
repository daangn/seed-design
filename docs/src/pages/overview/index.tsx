import { motion } from "framer-motion";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import PageLayout from "../../components/PageLayout";
import { fadeInFromBottom } from "../../framer-motions";
import * as listPageStyle from "../../styles/page-styles/list-page.css";
import * as t from "../../styles/token.css";

export const query = graphql`
  query OverviewListPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const OverviewListPage = () => {
  return (
    <PageLayout>
      <motion.div {...fadeInFromBottom}>
        <h1 className={listPageStyle.title}>Overview</h1>
        <p className={listPageStyle.caption1}>overviews</p>
        <h2 className={t.documentHeading2}>준비중...</h2>
      </motion.div>
    </PageLayout>
  );
};

// TODO:
export const Head: HeadFC<Queries.OverviewListPageQuery> = ({ data }) => {
  return (
    <>
      <title>Overview</title>
      <meta property="og:title" content={`Seed Design | Overview`} />
      <meta property="description" content="Overview." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default OverviewListPage;

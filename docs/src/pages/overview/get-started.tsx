import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import * as style from "../../styles/page-styles/get-started.page.css";

export const query = graphql`
  query GetStartedPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const GetStartedPage = () => {
  return (
    <article className={style.content}>
      <h1 className={style.title}>Get Started</h1>
    </article>
  );
};

// TODO:
export const Head: HeadFC<Queries.GetStartedPageQuery> = ({ data }) => {
  return (
    <>
      <title>Get Started | SEED Design</title>
      <meta property="og:title" content={`Get Started | SEED Design`} />
      <meta property="description" content="시작하시죠." />
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default GetStartedPage;

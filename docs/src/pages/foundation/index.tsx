import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";

import * as listPageStyle from "../../styles/page-styles/list-page.css";
import * as t from "../../styles/token.css";

export const query = graphql`
  query FoundationColorPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const FoundationListPage = () => {
  return (
    <article className={listPageStyle.content}>
      <h1 className={listPageStyle.title}>Foundation</h1>
      <p className={listPageStyle.caption1}>
        컴포넌트 구성에 필요한 기본적인 요소들
      </p>
      <h2 className={t.documentHeading2}>준비중...</h2>
    </article>
  );
};

// TODO:
export const Head: HeadFC<Queries.FoundationColorPageQuery> = ({ data }) => {
  return (
    <>
      <title>Foundation</title>
      <meta property="og:title" content={`Foundation | SEED Design`} />
      {/* <meta property="description" content="Color." /> */}
      <meta property="og:image" content={getSrc(data.ogImage!)} />
    </>
  );
};

export default FoundationListPage;

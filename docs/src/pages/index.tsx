import ForwardIcon from "@karrotmarket/karrot-ui-icon/lib/react/IconForwardFill";
import { vars } from "@seed-design/design-token";
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
      <motion.article {...fadeInFromBottom} className={style.content}>
        <h1 className={style.title}>SEED DESIGN</h1>

        <p className={style.description}>
          SEED는 메이커들이 효율적으로 제품을 만들 수 있도록
          <br />
          필요한 도구와 컴포넌트를 제공합니다.
          <br />
          SEED에서 제공하는 컴포넌트의 Usage 가이드,
          <br /> Spec 가이드를 확인할 수 있습니다.
        </p>

        <Link to="/component/">
          <motion.button
            whileHover={{
              color: vars.$scale.color.gray00,
              backgroundColor: vars.$scale.color.gray900,
            }}
            transition={{ duration: 0.2 }}
            className={style.goDocsButton}
          >
            Document 보러가기
            <ForwardIcon width={28} />
          </motion.button>
        </Link>

        <div className={style.cardList}>
          <Link to="/component/">
            <article
              style={{ backgroundColor: vars.$scale.color.blue50 }}
              className={style.cardContainer}
            >
              <p
                style={{ backgroundColor: vars.$scale.color.blue100 }}
                className={style.cardNumber}
              >
                1
              </p>
              <div className={style.cardContent}>
                <h1 className={style.cardTitle}>Component</h1>
                <p className={style.cardDescription}>컴포넌드 -</p>
              </div>
            </article>
          </Link>

          <Link to="/primitive/">
            <article
              style={{ backgroundColor: vars.$scale.color.green50 }}
              className={style.cardContainer}
            >
              <p
                style={{ backgroundColor: vars.$scale.color.green100 }}
                className={style.cardNumber}
              >
                2
              </p>
              <div className={style.cardContent}>
                <h1 className={style.cardTitle}>Primitive</h1>
                <p className={style.cardDescription}>근 - 본</p>
              </div>
            </article>
          </Link>
        </div>
      </motion.article>
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

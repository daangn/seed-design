import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import * as React from "react";

import Sidebar from "../components/Sidebar";
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
      <Sidebar />
      <h1 style={{ margin: "130px 50px" }} className={t.documentHeading1}>
        Seed Design
      </h1>
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

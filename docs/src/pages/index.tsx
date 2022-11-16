import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import PageLayout from "../components/PageLayout";
import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const query = graphql`
  query IndexPage {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const IndexPage = () => {
  return (
    <PageLayout>
      <div className={clsx(u.fullScreen, u.flexJustifyCenter)}>
        <h1 style={{ marginTop: "130px" }} className={clsx(t.documentHeading1)}>
          Seed Design
        </h1>
      </div>
    </PageLayout>
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

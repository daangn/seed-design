import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import { getSrc } from "gatsby-plugin-image";
import React from "react";

import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const query = graphql`
  query Contents {
    ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      gatsbyImageData(layout: FIXED)
    }
  }
`;

const IndexPage = () => {
  return (
    <div className={clsx(u.fullScreen, u.flexColumnCenter)}>
      <h1 className={clsx(t.documentHeading1)}>Seed Design</h1>
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC<GatsbyTypes.ContentsQuery> = ({ data }) => {
  return (
    <>
      <title>Home Page</title>
      <meta property="og:title" content="Seed Design" />
      <meta property="description" content="당근마켓 디자인시스템입니다." />
      <meta
        property="og:image"
        content={getSrc(data.ogImage?.gatsbyImageData!)}
      />
    </>
  );
};

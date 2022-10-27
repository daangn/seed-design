import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import React from "react";

import * as style from "../styles/index.css";

export const query = graphql`
  query Contents {
    ogimage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      original {
        height
        src
        width
      }
    }
  }
`;

const IndexPage = () => {
  return (
    <div className={clsx(style.container)}>
      <h1 className={clsx(style.title)}>Seed Design</h1>
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC<GatsbyTypes.ContentsQuery> = ({ data }) => {
  return (
    <>
      <title>Home Page</title>
      <meta property="description" content="Seed Design" />
      <meta property="og:image" content={data.ogimage?.original?.src || ""} />
    </>
  );
};

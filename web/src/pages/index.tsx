import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import React from "react";

import * as t from "../styles/token.css";
import * as u from "../styles/utils.css";

export const query = graphql`
  query Contents {
    ogimage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      original {
        src
      }
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
      <meta property="description" content="Seed Design" />
      <meta property="og:image" content={data.ogimage?.original?.src || ""} />
    </>
  );
};

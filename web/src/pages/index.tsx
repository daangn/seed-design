import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import * as React from "react";

import ContentCard from "../components/ContentCard";
import Drawer from "../components/Drawer";
import * as style from "../styles/index.css";

export const query = graphql`
  query Contents {
    allMdx {
      nodes {
        frontmatter {
          slug
        }
      }
    }
    ogimage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
      original {
        height
        src
        width
      }
    }
  }
`;

interface IndexPageProps {
  data: GatsbyTypes.ContentsQuery;
}

const IndexPage = ({ data }: IndexPageProps) => {
  return (
    <div className={clsx(style.container)}>
      <Drawer>
        {data.allMdx.nodes.map((node) => (
          <ContentCard key={node.frontmatter?.slug} content={node} />
        ))}
      </Drawer>
      <h1 className={clsx(style.title)}>Seed Design</h1>
    </div>
  );
};

export default IndexPage;

export const Head: HeadFC<IndexPageProps["data"]> = ({ data }) => {
  return (
    <>
      <title>Home Page</title>
      <meta property="description" content="Seed Design" />
      <meta property="og:image" content={data.ogimage?.original?.src || ""} />
    </>
  );
};

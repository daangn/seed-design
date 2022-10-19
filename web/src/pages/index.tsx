import clsx from "clsx";
import type { HeadFC } from "gatsby";
import { graphql } from "gatsby";
import * as React from "react";

import ContentCard from "../components/ContentCard";
import Drawer from "../components/Drawer";
import * as style from "./index.css";

export const query = graphql`
  query Contents {
    allMdx {
      nodes {
        frontmatter {
          slug
        }
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

export const Head: HeadFC = () => <title>Home Page</title>;

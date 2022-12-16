// ! pages 폴더 안에 있는 Query들에만 적용되는 Fragment들입니다.
import { graphql } from "gatsby";

export const ListPageMdxContent = graphql`
  fragment ListPageMdxContent on Mdx {
    frontmatter {
      description
      slug
      title
      thumbnail {
        childImageSharp {
          gatsbyImageData
        }
      }
    }
  }
`;

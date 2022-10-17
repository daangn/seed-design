import type { GatsbyConfig } from "gatsby";
import path from "path";

const SITE_METADATA = Object.freeze({
  title: "Seed design system",
  siteUrl: `https://www.yourdomain.tld`, // TODO:
});

const config: GatsbyConfig = {
  siteMetadata: SITE_METADATA,
  graphqlTypegen: true,
  plugins: [
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 900,
            },
          },
        ],
      },
    },
    "gatsby-plugin-mdx-frontmatter",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: path.resolve(__dirname, "./content"),
      },
    },
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-typegen",
      options: {
        outputPath: `src/__generated__/gatsby-types.d.ts`,
        emitSchema: {
          "src/__generated__/gatsby-schema.graphql": true,
        },
      },
    },
  ],
};

export default config;

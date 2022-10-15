import type { GatsbyConfig } from "gatsby";

const SITE_METADATA = Object.freeze({
  title: "Seed design system",
  siteUrl: `https://www.yourdomain.tld`, // TODO:
});

const config: GatsbyConfig = {
  siteMetadata: SITE_METADATA,
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-mdx",
    "gatsby-plugin-mdx-frontmatter",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },
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

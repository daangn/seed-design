const path = require(`path`);

const SITE_METADATA = Object.freeze({
  title: "Seed design system",
  siteUrl: `https://seed-design.pages.dev`, // TODO:
  drawerLinks: {
    overview: [
      {
        title: "Get started",
        slug: "/overview/get-started",
      },
    ],
    components: [
      {
        title: "Checkbox",
        slug: "/components/checkbox/primitive",
      },
      {
        title: "Textfield",
        slug: "/components/textfield/primitive",
      },
    ],
  },
});

const wrapESMPlugin = (name) =>
  function wrapESM(opts) {
    return async (...args) => {
      const mod = await import(name);
      const plugin = mod.default(opts);
      return plugin(...args);
    };
  };

module.exports = {
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
              wrapperStyle: `margin: 25px 0px, z-index: 0`,
            },
          },
        ],
        mdxOptions: {
          rehypePlugins: [
            [wrapESMPlugin(`rehype-slug`)],
            [
              wrapESMPlugin(`rehype-autolink-headings`),
              {
                behavior: "append",
                content: {
                  type: `element`,
                  tagName: `span`,
                  properties: { className: `heading-anchor-icon` },
                  children: [
                    {
                      type: `text`,
                      value: `#`,
                    },
                  ],
                },
              },
            ],
          ],
        },
      },
    },
    "gatsby-plugin-mdx-frontmatter",
    {
      resolve: `gatsby-transformer-json`,
      options: {
        typeName: `Json`,
      },
    },
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
    "gatsby-plugin-vanilla-extract",
    {
      resolve: "gatsby-plugin-html-attributes",
      options: {
        "data-seed": "light-only",
        "data-seed-scale-color": "light",
        "data-seed-scale-letter-spacing": "ios",
      },
    },
    "gatsby-plugin-sitemap",
  ],
};

const SITE_METADATA = Object.freeze({
  title: "SEED Design",
  siteUrl: process.env.URL || "https://seed-design.io",
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
  flags: {
    DEV_SSR: true,
  },
  plugins: [
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-seed-design",
    },
    {
      resolve: "gatsby-plugin-mdx",
      options: {
        gatsbyRemarkPlugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 900,
              wrapperStyle: `z-index: 0;border-radius: 8px;overflow: hidden;`,
            },
          },
        ],
        mdxOptions: {
          remarkPlugins: [require("remark-gfm")],
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
        typeName: ({ node }) => {
          if (node.base === "component-meta.json") {
            return "allComponentMetaJson";
          }

          if (node.base === "primitive-meta.json") {
            return "allPrimitiveMetaJson";
          }

          return "Json";
        },
      },
    },
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
    "gatsby-plugin-vanilla-extract",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
        {
          allSitePage {
            nodes {
              path
            }
          }
        }
      `,
        resolveSiteUrl: () => SITE_METADATA.siteUrl,
        serialize: ({ path }) => {
          return {
            url: path,
          };
        },
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        custom: {
          families: ["Pretendard"],
          urls: [
            "https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard-dynamic-subset.css",
          ],
        },
      },
    },
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "pages",
        engine: "flexsearch",
        engineOptions: {
          tokenize: "full",
        },
        query: `
          {
            primitives: allAllPrimitiveMetaJson {
              nodes {
                name
                primitive {
                  childMdx {
                    frontmatter {
                      slug
                    }
                  }
                }
              }
            }

            overviews: allAllComponentMetaJson(
              filter: {platform: {docs: {overview: {status: {ne: "todo"}}}}}
            ) {
              nodes {
                name
                platform {
                  docs {
                    overview {
                      status
                      mdx {
                        childMdx {
                          frontmatter {
                            slug
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            usages: allAllComponentMetaJson(
              filter: {platform: {docs: {usage: {status: {ne: "todo"}}}}}
            ) {
              nodes {
                name
                platform {
                  docs {
                    usage {
                      status
                      mdx {
                        childMdx {
                          frontmatter {
                            slug
                          }
                        }
                      }
                    }
                  }
                }
              }
            }

            styles: allAllComponentMetaJson(
              filter: {platform: {docs: {style: {status: {ne: "todo"}}}}}
            ) {
              nodes {
                name
                platform {
                  docs {
                    style {
                      status
                      mdx {
                        childMdx {
                          frontmatter {
                            slug
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        ref: "slug",
        index: ["slug"],
        store: ["slug", "name", "status"],
        normalizer: ({ data }) => {
          const overviewMetas = data.overviews.nodes.map((node) => ({
            slug: node.platform.docs.overview.mdx.childMdx.frontmatter.slug,
            name: node.name,
            status: node.platform.docs.overview.status,
          }));

          const usageMetas = data.usages.nodes.map((node) => ({
            slug: node.platform.docs.usage.mdx.childMdx.frontmatter.slug,
            name: node.name,
            status: node.platform.docs.usage.status,
          }));

          const styleMetas = data.styles.nodes.map((node) => ({
            slug: node.platform.docs.style.mdx.childMdx.frontmatter.slug,
            name: node.name,
            status: node.platform.docs.style.status,
          }));

          const primitiveMetas = data.primitives.nodes.map((node) => ({
            slug: node.primitive.childMdx.frontmatter.slug,
            name: node.name,
          }));

          return [
            ...overviewMetas,
            ...usageMetas,
            ...styleMetas,
            ...primitiveMetas,
          ];
        },
      },
    },
    {
      resolve: "gatsby-plugin-portal",
      options: {
        key: "portal",
        id: "portal",
      },
    },
    {
      resolve: `gatsby-plugin-gtag`,
      options: {
        trackingId: "G-P6FY16FTPH",
        head: true,
      },
    },
  ],
};

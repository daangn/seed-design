const path = require("path");

const PrimitiveDocsTemplate = path.resolve(
  `./src/templates/docs-primitive.tsx`,
);
const ComponentDocsTemplate = path.resolve(
  `./src/templates/docs-component.tsx`,
);

exports.onCreateWebpackConfig = ({ actions, plugins, reporter }) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.provide({
        React: "react",
      }),
    ],
  });

  reporter.info(`Provided React in all files`);
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    fragment MdxContent on Mdx {
      frontmatter {
        slug
      }
      id
      internal {
        contentFilePath
      }
      tableOfContents
    }

    query {
      ogImage: imageSharp(fluid: { originalName: { eq: "ogimage.png" } }) {
        gatsbyImageData(layout: FIXED)
      }

      allAllPrimitiveMetaJson {
        nodes {
          name
          description
          primitive {
            childMdx {
              ...MdxContent
            }
          }
        }
      }

      allAllComponentMetaJson {
        nodes {
          name
          description
          platform {
            docs {
              style {
                mdx {
                  childMdx {
                    ...MdxContent
                  }
                }
              }
              usage {
                mdx {
                  childMdx {
                    ...MdxContent
                  }
                }
              }
            }
          }
        }
      }
    }
  `);

  const ogImage = result.data.ogImage.gatsbyImageData;

  const componentNodes = result.data.allAllComponentMetaJson.nodes;
  const primitiveNodes = result.data.allAllPrimitiveMetaJson.nodes;

  componentNodes.forEach((component) => {
    const name = component.name;
    const description = component.description;

    if (component.platform.docs.style.mdx) {
      createPage({
        path: component.platform.docs.style.mdx.childMdx.frontmatter.slug,
        component: `${ComponentDocsTemplate}?__contentFilePath=${component.platform.docs.style.mdx.childMdx.internal.contentFilePath}`,
        context: {
          id: component.platform.docs.style.mdx.childMdx.id,
          slug: component.platform.docs.style.mdx.childMdx.frontmatter.slug,
          name,
          description,
          tableOfContents:
            component.platform.docs.style.mdx.childMdx.tableOfContents,
          activeTab:
            component.platform.docs.style.mdx.childMdx.frontmatter.slug,
          ogImage,
        },
      });
    }

    if (component.platform.docs.usage.mdx) {
      createPage({
        path: component.platform.docs.usage.mdx.childMdx.frontmatter.slug,
        component: `${ComponentDocsTemplate}?__contentFilePath=${component.platform.docs.usage.mdx.childMdx.internal.contentFilePath}`,
        context: {
          id: component.platform.docs.usage.mdx.childMdx.id,
          slug: component.platform.docs.usage.mdx.childMdx.frontmatter.slug,
          name,
          description,
          tableOfContents:
            component.platform.docs.usage.mdx.childMdx.tableOfContents,
          activeTab:
            component.platform.docs.usage.mdx.childMdx.frontmatter.slug,
          ogImage,
        },
      });
    }
  });

  primitiveNodes.forEach((component) => {
    if (!component.primitive) return;

    createPage({
      path: component.primitive.childMdx.frontmatter.slug,
      component: `${PrimitiveDocsTemplate}?__contentFilePath=${component.primitive.childMdx.internal.contentFilePath}`,
      context: {
        id: component.primitive.childMdx.id,
        slug: component.primitive.childMdx.frontmatter.slug,
        name: component.name,
        description: component.description,
        tableOfContents: component.primitive.childMdx.tableOfContents,
        activeTab: component.primitive.childMdx.frontmatter.slug,
        ogImage,
      },
    });
  });
};

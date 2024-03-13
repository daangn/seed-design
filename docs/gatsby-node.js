const path = require("path");

const ComponentUsageDocTemplate = path.resolve(
  `./src/templates/ComponentUsageDoc.tsx`,
);
const ComponentStyleDocTemplate = path.resolve(
  `./src/templates/ComponentStyleDoc.tsx`,
);
const PrimitiveDocTemplate = path.resolve(`./src/templates/PrimitiveDoc.tsx`);

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
      internal {
        contentFilePath
      }
    }

    query {
      allPrimitiveMetaJson {
        nodes {
          id
          primitive {
            childMdx {
              ...MdxContent
            }
          }
        }
      }

      allComponentMetaJson {
        nodes {
          id
          name
          platform {
            docs {
              usage {
                mdx {
                  childMdx {
                    ...MdxContent
                  }
                }
              }
              style {
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

  const componentNodes = result.data.allComponentMetaJson.nodes;
  const primitiveNodes = result.data.allPrimitiveMetaJson.nodes;

  componentNodes.forEach((component) => {
    if (component.platform.docs.usage.mdx) {
      createPage({
        path: component.platform.docs.usage.mdx.childMdx.frontmatter.slug,
        component: `${ComponentUsageDocTemplate}?__contentFilePath=${component.platform.docs.usage.mdx.childMdx.internal.contentFilePath}`,
        context: {
          id: component.id,
        },
      });
    }

    if (component.platform.docs.style.mdx) {
      createPage({
        path: component.platform.docs.style.mdx.childMdx.frontmatter.slug,
        component: `${ComponentStyleDocTemplate}?__contentFilePath=${component.platform.docs.style.mdx.childMdx.internal.contentFilePath}`,
        context: {
          id: component.id,
        },
      });
    }
  });

  primitiveNodes.forEach((component) => {
    if (!component.primitive) return;

    createPage({
      path: component.primitive.childMdx.frontmatter.slug,
      component: `${PrimitiveDocTemplate}?__contentFilePath=${component.primitive.childMdx.internal.contentFilePath}`,
      context: {
        id: component.id,
      },
    });
  });
};

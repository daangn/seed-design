import type { GatsbyNode } from "gatsby";
import path from "path";

const ComponentOverviewDocTemplate = path.resolve(
  `./src/templates/ComponentOverviewDoc.tsx`,
);
const ComponentUsageDocTemplate = path.resolve(
  `./src/templates/ComponentUsageDoc.tsx`,
);
const ComponentStyleDocTemplate = path.resolve(
  `./src/templates/ComponentStyleDoc.tsx`,
);
const PrimitiveDocTemplate = path.resolve(`./src/templates/PrimitiveDoc.tsx`);

export const onCreateWebpackConfig: GatsbyNode["onCreateWebpackConfig"] = ({
  actions,
  plugins,
  reporter,
}) => {
  actions.setWebpackConfig({
    plugins: [
      plugins.provide({
        React: "react",
      }),
    ],
  });

  reporter.info(`Provided React in all files`);
};

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions: { createPage, createSlice },
}) => {
  createSlice({
    id: "toc",
    component: path.resolve(`./src/components/TableOfContentsSlice.tsx`),
  });
  createSlice({
    id: "logo",
    component: path.resolve(`./src/components/LogoSlice.tsx`),
  });

  const result = await graphql<Queries.CreatePagesQuery>(`
    fragment MdxContent on Mdx {
      frontmatter {
        slug
      }
      internal {
        contentFilePath
      }
    }

    query CreatePages {
      allAllPrimitiveMetaJson {
        nodes {
          id
          primitive {
            childMdx {
              ...MdxContent
            }
          }
        }
      }

      allAllComponentMetaJson {
        nodes {
          id
          platform {
            docs {
              overview {
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

  const componentNodes = result?.data?.allAllComponentMetaJson.nodes;
  const primitiveNodes = result?.data?.allAllPrimitiveMetaJson.nodes;

  componentNodes?.forEach((component) => {
    if (component?.platform?.docs?.overview?.mdx) {
      createPage({
        path: component?.platform?.docs?.overview?.mdx?.childMdx?.frontmatter!
          .slug!,
        component: `${ComponentOverviewDocTemplate}?__contentFilePath=${component?.platform?.docs?.overview?.mdx?.childMdx?.internal.contentFilePath}`,
        context: {
          id: component.id,
        },
      });
    }

    if (component?.platform?.docs?.usage?.mdx) {
      createPage({
        path: component?.platform?.docs?.usage?.mdx?.childMdx?.frontmatter
          ?.slug!,
        component: `${ComponentUsageDocTemplate}?__contentFilePath=${component?.platform?.docs?.usage?.mdx?.childMdx?.internal.contentFilePath}`,
        context: {
          id: component.id,
        },
      });
    }

    if (component?.platform?.docs?.style?.mdx) {
      createPage({
        path: component?.platform?.docs?.style?.mdx?.childMdx?.frontmatter
          ?.slug!,
        component: `${ComponentStyleDocTemplate}?__contentFilePath=${component?.platform?.docs?.style?.mdx?.childMdx?.internal.contentFilePath}`,
        context: {
          id: component.id,
        },
      });
    }
  });

  primitiveNodes?.forEach((component) => {
    if (!component.primitive) return;

    createPage({
      path: component?.primitive?.childMdx?.frontmatter?.slug!,
      component: `${PrimitiveDocTemplate}?__contentFilePath=${component?.primitive?.childMdx?.internal.contentFilePath}`,
      context: {
        id: component.id,
      },
    });
  });
};

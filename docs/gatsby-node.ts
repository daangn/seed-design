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

const Slices = [
  // ui
  {
    alias: "ui/TOC",
    path: "./src/components/TableOfContentsSlice.tsx",
  },
  {
    alias: "ui/Logo",
    path: "./src/components/LogoSlice.tsx",
  },
  {
    alias: "ui/ComponentDocumentCategoryNav",
    path: "./src/components/ComponentDocumentCategoryNavSlice.tsx",
  },
  {
    alias: "ui/EditLink",
    path: "./src/components/EditLinkSlice.tsx",
  },

  // mdx/card
  {
    alias: "mdx/FullCardDescriptionSlice",
    path: "./src/components/mdx/card/FullCardDescriptionSlice.tsx",
  },
  {
    alias: "mdx/FullCardImageCellSlice",
    path: "./src/components/mdx/card/FullCardImageCellSlice.tsx",
  },
  {
    alias: "mdx/FullCardSlice",
    path: "./src/components/mdx/card/FullCardSlice.tsx",
  },
  {
    alias: "mdx/HalfCardDescriptionCellSlice",
    path: "./src/components/mdx/card/HalfCardDescriptionCellSlice.tsx",
  },
  {
    alias: "mdx/HalfCardDescriptionSlice",
    path: "./src/components/mdx/card/HalfCardDescriptionSlice.tsx",
  },
  {
    alias: "mdx/HalfCardDescriptionTitleSlice",
    path: "./src/components/mdx/card/HalfCardDescriptionTitleSlice.tsx",
  },
  {
    alias: "mdx/HalfCardImageCellSlice",
    path: "./src/components/mdx/card/HalfCardImageCellSlice.tsx",
  },
  {
    alias: "mdx/HalfCardSlice",
    path: "./src/components/mdx/card/HalfCardSlice.tsx",
  },

  // mdx/heading
  {
    alias: "mdx/h1",
    path: "./src/components/mdx/heading/h1-slice.tsx",
  },
  {
    alias: "mdx/h2",
    path: "./src/components/mdx/heading/h2-slice.tsx",
  },
  {
    alias: "mdx/h3",
    path: "./src/components/mdx/heading/h3-slice.tsx",
  },
  {
    alias: "mdx/h4",
    path: "./src/components/mdx/heading/h4-slice.tsx",
  },

  // mdx/do-dont
  {
    alias: "mdx/DoBoxSlice",
    path: "./src/components/mdx/do-dont/DoBoxSlice.tsx",
  },
  {
    alias: "mdx/DoDontLayoutSlice",
    path: "./src/components/mdx/do-dont/DoDontLayoutSlice.tsx",
  },
  {
    alias: "mdx/DoImageSlice",
    path: "./src/components/mdx/do-dont/DoImageSlice.tsx",
  },
  {
    alias: "mdx/DontBoxSlice",
    path: "./src/components/mdx/do-dont/DontBoxSlice.tsx",
  },
  {
    alias: "mdx/DontImageSlice",
    path: "./src/components/mdx/do-dont/DontImageSlice.tsx",
  },
  {
    alias: "mdx/DontTextSlice",
    path: "./src/components/mdx/do-dont/DontTextSlice.tsx",
  },
  {
    alias: "mdx/DoTextSlice",
    path: "./src/components/mdx/do-dont/DoTextSlice.tsx",
  },

  // mdx/table
  {
    alias: "mdx/TableBodySlice",
    path: "./src/components/mdx/table/TableBodySlice.tsx",
  },
  {
    alias: "mdx/TableDataSlice",
    path: "./src/components/mdx/table/TableDataSlice.tsx",
  },
  {
    alias: "mdx/TableHeadSlice",
    path: "./src/components/mdx/table/TableHeadSlice.tsx",
  },
  {
    alias: "mdx/TableRowSlice",
    path: "./src/components/mdx/table/TableRowSlice.tsx",
  },
  {
    alias: "mdx/TableSlice",
    path: "./src/components/mdx/table/TableSlice.tsx",
  },

  // mdx/list
  {
    alias: "mdx/OrderedListSlice",
    path: "./src/components/mdx/list/ol-slice.tsx",
  },
  {
    alias: "mdx/OrderedListItemSlice",
    path: "./src/components/mdx/list/oli-slice.tsx",
  },

  // mdx/text
  {
    alias: "mdx/ParagraphSlice",
    path: "./src/components/mdx/text/p-slice.tsx",
  },

  // mdx/iframe
  {
    alias: "mdx/IframeSlice",
    path: "./src/components/mdx/iframe/IframeSlice.tsx",
  },

  // mdx/keyboard
  {
    alias: "mdx/KeyboardSlice",
    path: "./src/components/mdx/keyboard/KeyboardSlice.tsx",
  },
];

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
  Slices.forEach((slice) => {
    createSlice({
      id: slice.alias,
      component: path.resolve(slice.path),
    });
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

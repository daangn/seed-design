const path = require("path");

const templateContent = path.resolve(`./src/templates/TemplateContent.tsx`);

exports.onCreatePage = async ({ page, actions: { deletePage } }) => {
  const isVanillaExtractFile = page.path.includes(".css");

  if (isVanillaExtractFile) {
    deletePage(page);
  }
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      allMdx {
        nodes {
          id
          frontmatter {
            slug
          }
          internal {
            contentFilePath
          }
        }
      }
    }
  `);

  result.data.allMdx.nodes.forEach((node) => {
    createPage({
      path: node.frontmatter.slug,
      component: `${templateContent}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        id: node.id,
        slug: node.frontmatter.slug,
        allMdx: result.data.allMdx,
      },
    });
  });
};

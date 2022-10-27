const path = require("path");

const componentsContentTemplate = path.resolve(
  `./src/templates/ComponentsContentTemplate.tsx`,
);
const overviewContentTemplate = path.resolve(
  `./src/templates/OverviewContentTemplate.tsx`,
);

exports.onCreatePage = async ({ page, actions: { deletePage } }) => {
  const isVanillaExtractFile = page.path.includes(".css");

  if (isVanillaExtractFile) {
    deletePage(page);
  }
};

exports.createPages = async ({ graphql, actions: { createPage } }) => {
  const result = await graphql(`
    query {
      overviews: allMdx(
        filter: { internal: { contentFilePath: { regex: "/overview/" } } }
      ) {
        edges {
          node {
            internal {
              contentFilePath
            }
            frontmatter {
              slug
            }
          }
        }
      }
      components: allFile(
        filter: {
          ext: { eq: ".json" }
          relativeDirectory: { regex: "/components/" }
        }
      ) {
        nodes {
          childJson {
            description
            title
            slug
          }
          relativeDirectory
        }
      }
    }
  `);

  result.data.overviews.edges.forEach(({ node }) => {
    const { slug } = node.frontmatter;
    const { contentFilePath } = node.internal;

    createPage({
      path: slug,
      component: `${overviewContentTemplate}?__contentFilePath=${contentFilePath}`,
      context: {
        slug,
      },
    });
  });

  result.data.components.nodes.forEach((node) => {
    const commonContext = {
      title: node.childJson.title,
      description: node.childJson.description,
      slug: node.childJson.slug,
    };

    ["primitive", "visual"].forEach((tabName) => {
      createPage({
        path: `${node.childJson.slug}/${tabName}`,
        component: `${componentsContentTemplate}?__contentFilePath=${require.resolve(
          `./content/${node.relativeDirectory}/${tabName}.mdx`,
        )}`,
        context: {
          ...commonContext,
          activeTab: tabName,
        },
      });
    });
  });
};

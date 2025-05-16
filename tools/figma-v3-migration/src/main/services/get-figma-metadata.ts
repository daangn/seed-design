import type { FigmaMetadata } from "../../shared/types";

export const getFigmaMetadata = (): FigmaMetadata => {
  const currentUser = figma.currentUser;
  const currentPage = figma.currentPage;
  const currentRoot = figma.root;
  const fileKey = figma.fileKey;

  if (!currentUser || !currentPage || !currentRoot || !fileKey) {
    figma.notify("Figma metadata not found", {
      error: true,
      timeout: 5000,
    });
    return {
      currentUser: {
        id: "",
        name: "",
      },
      currentPage: {
        id: "",
        name: "",
      },
      currentRoot: {
        name: "",
      },
      fileKey: "",
    };
  }

  return {
    currentUser: {
      id: currentUser.id!,
      name: currentUser.name,
    },
    currentPage: {
      id: currentPage.id,
      name: currentPage.name,
    },
    currentRoot: {
      name: currentRoot.name,
    },
    fileKey,
  };
};

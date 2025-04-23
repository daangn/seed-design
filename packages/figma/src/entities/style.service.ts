import type { StyleRepository } from "./style.repository";

export interface StyleService {
  getStyleName: (id: string) => string | undefined;
}

// TODO: inferStyleName 추가해야 함, rest api에서 style value가 제공되지 않고 있어 보류
export function createStyleService({
  styleRepository,
  styleNameTransformer,
}: {
  styleRepository: StyleRepository;
  styleNameTransformer: ({ slug }: { slug: string[] }) => string;
}): StyleService {
  function getFigmaStyleName(id: string) {
    const style = styleRepository.findOneByKey(id);

    if (!style) {
      return undefined;
    }

    return style.name;
  }

  function getFigmaStyleSlug(id: string): string[] | undefined {
    const name = getFigmaStyleName(id);

    if (!name) {
      return undefined;
    }

    return name.split("/");
  }

  function getStyleName(id: string) {
    const slug = getFigmaStyleSlug(id);

    if (!slug) {
      return undefined;
    }

    return styleNameTransformer({ slug });
  }

  return {
    getStyleName,
  };
}

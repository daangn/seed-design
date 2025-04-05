import type { StyleRepository } from "./style.repository";

export interface StyleService {
  getStyleName: (id: string) => string;
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
    const style = styleRepository.getOne(id);

    if (!style) {
      throw new Error(`Style not found: ${id}`);
    }

    return style.name;
  }

  function getFigmaStyleSlug(id: string): string[] {
    const name = getFigmaStyleName(id);
    return name.split("/");
  }

  function getStyleName(id: string) {
    const slug = getFigmaStyleSlug(id);
    return styleNameTransformer({ slug });
  }

  return {
    getStyleName,
  };
}

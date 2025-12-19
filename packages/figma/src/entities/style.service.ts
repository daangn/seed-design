import type { StyleRepository } from "./style.repository";

export interface StyleService {
  getSlug: (id: string) => string[] | undefined;
}

// TODO: inferStyleName 추가해야 함, rest api에서 style value가 제공되지 않고 있어 보류
export function createStyleService({
  styleRepository,
}: {
  styleRepository: StyleRepository;
}): StyleService {
  function getName(key: string) {
    const style = styleRepository.findOneByKey(key);

    if (!style) {
      return undefined;
    }

    return style.name;
  }

  function getSlug(key: string): string[] | undefined {
    const name = getName(key);

    if (!name) {
      return undefined;
    }

    return name.split("/");
  }

  return {
    getSlug,
  };
}

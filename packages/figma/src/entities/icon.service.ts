import type { IconData } from "./icon.interface";
import type { IconRepository } from "./icon.repository";

export interface IconService {
  isAvailable: (componentKey: string) => boolean;
  getOne: (componentKey: string) => IconData;
}

export function createIconService({
  iconRepository,
}: {
  iconRepository: IconRepository;
}): IconService {
  function isAvailable(componentKey: string) {
    return iconRepository.getOne(componentKey) !== undefined;
  }

  function getOne(componentKey: string) {
    return iconRepository.getOne(componentKey);
  }

  return {
    isAvailable,
    getOne,
  };
}

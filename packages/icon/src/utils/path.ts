import { relative } from "path";

export const generateRelativePath = (from: string, to: string) => {
  const relatived = relative(from, to);
  return relatived.startsWith("..") ? relatived : `./${relatived}`;
}

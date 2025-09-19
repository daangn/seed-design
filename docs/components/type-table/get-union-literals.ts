import { Project } from "ts-morph";
import * as path from "node:path";

export interface UnionLiteralTableProps {
  path: string;
  name: string;
}

export interface UnionLiteralResult {
  name: string;
  literals: string[];
}

const project = new Project({ skipAddingFilesFromTsConfig: true });

export async function getUnionLiterals({
  path: filePath,
  name,
}: UnionLiteralTableProps): Promise<UnionLiteralResult> {
  const resolvedPath = resolveTypePath(filePath);
  const sourceFile = project.addSourceFileAtPath(resolvedPath);

  const typeAlias = sourceFile.getTypeAlias(name);

  if (!typeAlias) throw new Error(`Type "${name}" not found in ${filePath}`);

  const type = typeAlias.getType();
  if (!type) throw new Error(`Type "${name}" not found in ${filePath}`);

  const literals = (type.isUnion() ? type.getUnionTypes() : [type])
    .map((t) => t.getText())
    .filter((v): v is string => !!v);

  return { name, literals };
}

// TODO: do this better with require.resolve or something
// import.meta.resolve will work but not currently supported in Next.js
function resolveTypePath(filePath: string): string {
  if (filePath.startsWith("@seed-design/")) {
    const packagePath = filePath.replace("@seed-design/", "");

    return path.join(process.cwd(), "../packages", `${packagePath}.d.ts`);
  }

  if (filePath.startsWith("./") || filePath.startsWith("../")) {
    return path.resolve(process.cwd(), filePath);
  }

  return filePath;
}

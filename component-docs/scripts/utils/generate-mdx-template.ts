import { dedent } from "ts-dedent";

interface GenerateMDXTemplateProps {
  language: string;
  template: string;

  /**
   * @example ["1", "2-5", "3"]
   */
  highlightLines?: string[];

  /**
   * @example ["import", "export"]
   */
  subStrings?: string[];

  copy?: boolean;
  showLineNumbers?: boolean;

  /**
   * @example "BoxButtonPreview.tsx"
   */
  filename?: string;
}

export function generateMDXTemplate(props: GenerateMDXTemplateProps) {
  const { language, highlightLines, subStrings, copy, showLineNumbers, filename, template } = props;

  const highlightLinesCode = highlightLines && `{${highlightLines.join(",")}}`;
  const subStringsCode = subStrings && `/${subStrings.join(",")}/`;
  const copyCode = copy && "copy";
  const showLineNumbersCode = showLineNumbers && "showLineNumbers";
  const filenameCode = filename && `filename="${filename}"`;
  const metas = [highlightLinesCode, subStringsCode, copyCode, showLineNumbersCode, filenameCode]
    .filter(Boolean)
    .join(" ");

  return dedent`
    \`\`\`${language} ${metas}
    ${template}
    \`\`\`\n
  `;
}

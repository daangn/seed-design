import * as fs from "fs";
import * as path from "path";

interface TokenMigrationResult {
  previousToken: string;
  nextToken: string | null;
  line?: number;
  status: "success" | "failure";
  failureReason?: string;
}

interface FileMigration {
  filePath: string;
  results: TokenMigrationResult[];
}

export class TokenMigrationReporter {
  private timestamp: string;
  private fileMigrations: FileMigration[] = [];
  private currentFile: FileMigration | null = null;
  private readonly reportDir = path.join(process.cwd(), ".report");
  private transformName: string;

  constructor(transformName: string) {
    this.transformName = transformName;
    this.timestamp = this.generateTimestamp();
  }

  private generateTimestamp(): string {
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    return new Date(new Date().getTime() + koreaTimeDiff).toISOString();
  }

  private getReportPath(): string {
    return path.join(this.reportDir, `${this.transformName}.md`);
  }

  private getRelativePath(absolutePath: string): string {
    if (!absolutePath) return "unknown";

    try {
      const resolvedPath = path.resolve(absolutePath);
      return path.relative(this.reportDir, resolvedPath);
    } catch {
      return "unknown";
    }
  }

  startNewFile(filePath: string) {
    this.currentFile = {
      filePath: this.getRelativePath(filePath),
      results: [],
    };
  }

  addResult(result: TokenMigrationResult) {
    if (!this.currentFile) return;
    this.currentFile.results.push(result);
  }

  finishFile() {
    if (this.currentFile && this.currentFile.results.length > 0) {
      this.fileMigrations.push(this.currentFile);
    }
    this.currentFile = null;
  }

  hasResults(): boolean {
    return this.fileMigrations.length > 0;
  }

  writeReport() {
    if (!this.hasResults()) return;

    if (!fs.existsSync(this.reportDir)) {
      fs.mkdirSync(this.reportDir, { recursive: true });
    }

    const reportFile = this.getReportPath();
    const existingContent = fs.existsSync(reportFile) ? fs.readFileSync(reportFile, "utf8") : "";

    const migrationReport = this.fileMigrations
      .map((file) => {
        const filename = path.basename(file.filePath);
        const resultsList = file.results
          .map((result) => {
            const lineInfo = result.line ? ` (line: ${result.line})` : "";
            const status = result.status === "success" ? "✅" : "❌";
            const failureInfo = result.failureReason
              ? `\n    - Reason: ${result.failureReason}`
              : "";

            return `  - ${status} ${lineInfo} \n    - before: \`${result.previousToken}\` \n    - after: ${result.nextToken ? `\`${result.nextToken}\`` : "undefined"}${failureInfo}`;
          })
          .join("\n");

        return `### [${filename}](${file.filePath})
- timestamp: ${this.timestamp}
- summary:
  - total: ${file.results.length}
  - success: ${file.results.filter((result) => result.status === "success").length}
  - failure: ${file.results.filter((result) => result.status === "failure").length}
- lines
${resultsList}`;
      })
      .join("\n\n");

    const separator = existingContent ? "\n\n" : "";
    fs.writeFileSync(reportFile, existingContent + separator + migrationReport);
  }
}

import * as fs from "fs";
import * as path from "path";

interface TokenMigrationResult {
  previousToken: string;
  nextToken: string | null;
  line?: number;
  status: "success" | "failure" | "warning";
  failureReason?: string;
}

interface FileMigration {
  filePath: string;
  results: TokenMigrationResult[];
}

export class TokenMigrationReport {
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
            const status =
              result.status === "success"
                ? "✅ success"
                : result.status === "warning"
                  ? "⚠️ warning"
                  : "❌ failure";
            const failureInfo = result.failureReason
              ? `\n    - reason: ${result.failureReason}`
              : "";

            return `  - ${status} ${lineInfo} \n    - as-is: \`${result.previousToken}\` \n    - to-be: ${result.nextToken ? `\`${result.nextToken}\`` : "undefined"}${failureInfo}`;
          })
          .join("\n");

        const totalCount = file.results.length;
        const successCount = file.results.filter((result) => result.status === "success").length;
        const warningCount = file.results.filter((result) => result.status === "warning").length;
        const failureCount = file.results.filter((result) => result.status === "failure").length;

        const summaryItems = [];
        summaryItems.push(`  - total: ${totalCount}`);
        if (successCount > 0) summaryItems.push(`  - success: ${successCount}`);
        if (warningCount > 0) summaryItems.push(`  - warning: ${warningCount}`);
        if (failureCount > 0) summaryItems.push(`  - failure: ${failureCount}`);

        return `### [${filename}](${file.filePath})
- timestamp: ${this.timestamp}
- summary:
${summaryItems.join("\n")}
- lines
${resultsList}`;
      })
      .join("\n\n");

    const separator = existingContent ? "\n\n" : "";
    fs.writeFileSync(reportFile, existingContent + separator + migrationReport);
  }
}

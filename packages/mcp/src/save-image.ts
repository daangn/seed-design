import fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";

const defaultDownloadsPath = path.join(os.homedir(), "Downloads");

export function saveImage(image: Buffer, name: string, type: "png" | "svg") {
  if (!fs.existsSync(defaultDownloadsPath)) {
    fs.mkdirSync(defaultDownloadsPath, { recursive: true });
  }

  const filePath = path.join(defaultDownloadsPath, `${name}.${type}`);
  fs.writeFileSync(filePath, image);

  return filePath;
}

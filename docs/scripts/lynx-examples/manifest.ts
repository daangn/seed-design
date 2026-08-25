import { copyFile, mkdir, readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import {
  LYNX_MANIFEST_SCHEMA_VERSION,
  LYNX_WEB_CORE_STYLES_FILENAME,
  PUBLIC_DIRECTORY,
  STAGING_DIRECTORY,
} from "./constants.js";
import type { LynxExampleEntry } from "./discovery.js";

export interface LynxExampleManifest {
  schemaVersion: 1;
  examples: Record<`lynx/${string}/${string}`, { web: string; lynx: string }>;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function assertNonEmpty(path: string) {
  const fileStat = await stat(path);
  if (!fileStat.isFile() || fileStat.size === 0) {
    throw new Error(`Lynx bundle이 비어 있거나 파일이 아닙니다: ${path}`);
  }
}

async function assertWebBundleUsesWebUnits(path: string, id: string) {
  const bundle = await readFile(path, "utf8");
  const spUnit = bundle.match(/\b(?:\d+(?:\.\d+)?|\.\d+)sp\b/);
  if (spUnit) {
    throw new Error(`${id}의 web bundle에 Lynx 전용 단위가 포함되어 있습니다: ${spUnit[0]}`);
  }
}

export async function createManifestFromBundles(
  entries: LynxExampleEntry[],
  directory = STAGING_DIRECTORY,
): Promise<LynxExampleManifest> {
  const files = await readdir(directory, { recursive: true });
  const examples: LynxExampleManifest["examples"] = {};

  for (const entry of entries) {
    const escapedKey = escapeRegExp(entry.entryKey);
    const matches = {
      web: files.filter((file) =>
        new RegExp(`^${escapedKey}(?:\\.[a-f0-9]{8})?\\.web\\.bundle$`).test(file),
      ),
      lynx: files.filter((file) =>
        new RegExp(`^${escapedKey}(?:\\.[a-f0-9]{8})?\\.lynx\\.bundle$`).test(file),
      ),
    };

    for (const platform of ["web", "lynx"] as const) {
      if (matches[platform].length !== 1) {
        throw new Error(
          `${entry.id}의 ${platform} bundle은 정확히 하나여야 합니다. 발견: ${matches[platform].join(", ") || "없음"}`,
        );
      }
      const bundlePath = resolve(directory, matches[platform][0]);
      await assertNonEmpty(bundlePath);
      if (platform === "web") await assertWebBundleUsesWebUnits(bundlePath, entry.id);
    }

    examples[entry.id] = {
      web: `/__lynx__/${matches.web[0]}`,
      lynx: `/__lynx__/${matches.lynx[0]}`,
    };
  }

  return { schemaVersion: LYNX_MANIFEST_SCHEMA_VERSION, examples };
}

export function createDevelopmentManifest(entries: LynxExampleEntry[]): LynxExampleManifest {
  return {
    schemaVersion: LYNX_MANIFEST_SCHEMA_VERSION,
    examples: Object.fromEntries(
      entries.map((entry) => [
        entry.id,
        {
          web: `/__lynx__/${entry.entryKey}.web.bundle`,
          lynx: `/__lynx__/${entry.entryKey}.lynx.bundle`,
        },
      ]),
    ),
  } as LynxExampleManifest;
}

export async function publishManifestAndBundles(
  manifest: LynxExampleManifest,
  sourceDirectory = STAGING_DIRECTORY,
  publicDirectory = PUBLIC_DIRECTORY,
) {
  await mkdir(publicDirectory, { recursive: true });
  const referencedFiles = new Set(["manifest.json", LYNX_WEB_CORE_STYLES_FILENAME]);
  await copyFile(
    resolve(sourceDirectory, LYNX_WEB_CORE_STYLES_FILENAME),
    resolve(publicDirectory, LYNX_WEB_CORE_STYLES_FILENAME),
  );

  for (const example of Object.values(manifest.examples)) {
    for (const url of [example.web, example.lynx]) {
      const filename = url.replace("/__lynx__/", "");
      referencedFiles.add(filename);
      const target = resolve(publicDirectory, filename);
      await mkdir(resolve(target, ".."), { recursive: true });
      await copyFile(resolve(sourceDirectory, filename), target);
    }
  }

  const temporaryManifest = resolve(publicDirectory, `.manifest-${process.pid}.json`);
  await writeFile(temporaryManifest, `${JSON.stringify(manifest, null, 2)}\n`);
  await rename(temporaryManifest, resolve(publicDirectory, "manifest.json"));

  for (const file of await readdir(publicDirectory, { recursive: true })) {
    if (!referencedFiles.has(file) && file.endsWith(".bundle")) {
      await rm(resolve(publicDirectory, file));
    }
  }
}

export async function readManifest(path: string): Promise<LynxExampleManifest> {
  return JSON.parse(await readFile(path, "utf8")) as LynxExampleManifest;
}

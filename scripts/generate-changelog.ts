#!/usr/bin/env bun

import { readdir, readFile, stat, writeFile } from "fs/promises";
import matter from "gray-matter";
import { join } from "path";
import { inc } from "semver";

interface ChangesetData {
  packages: Record<string, string>;
  content: string;
  createdAt: Date;
}

interface ChangelogEntry {
  date: string;
  changesets: Array<{
    content: string;
    packages: Array<{
      name: string;
      version: string;
    }>;
  }>;
  manualContent?: string;
}

/**
 * 한국식 날짜 형식으로 변환 (YYYY.MM.DD)
 */
function formatKoreanDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

/**
 * YYYY-MM-DD 형식으로 날짜 변환
 */
function formatISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * changeset 파일들을 파싱하여 데이터 추출
 */
async function parseChangesetFiles(): Promise<ChangesetData[]> {
  const changesetDir = join(process.cwd(), ".changeset");
  const files = await readdir(changesetDir);
  const changesetFiles = files.filter((file) => file.endsWith(".md") && file !== "README.md");

  const changesetData: ChangesetData[] = [];

  for (const file of changesetFiles) {
    const filePath = join(changesetDir, file);
    const fileContent = await readFile(filePath, "utf-8");
    const fileStat = await stat(filePath);

    const { data, content } = matter(fileContent);

    // frontmatter에서 패키지 정보 추출
    const packages: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith("@seed-design/")) {
        packages[key] = value as string;
      }
    }

    changesetData.push({
      packages,
      content: content.trim(),
      createdAt: fileStat.birthtime,
    });
  }

  return changesetData;
}

/**
 * 기존 changelog에서 수동 작성된 내용 추출
 */
async function extractManualContent(changelogPath: string): Promise<Record<string, string>> {
  try {
    const existingContent = await readFile(changelogPath, "utf-8");
    const manualContents: Record<string, string> = {};

    // 날짜별 섹션에서 수동 작성 내용 추출
    const dateRegex = /## (\d{4}\.\d{2}\.\d{2})/g;
    const sections = existingContent.split(dateRegex);

    for (let i = 1; i < sections.length; i += 2) {
      const date = sections[i];
      const content = sections[i + 1];

      // 수동 작성 영역 추출
      const manualMatch = content.match(
        /<!-- MANUAL_CONTENT_START -->\s*([\s\S]*?)\s*<!-- MANUAL_CONTENT_END -->/,
      );
      if (manualMatch) {
        manualContents[date] = manualMatch[1].trim();
      }
    }

    return manualContents;
  } catch {
    return {};
  }
}

/**
 * changeset 데이터를 날짜별로 그룹핑
 */
function groupChangesetsByDate(changesetData: ChangesetData[]): Record<string, ChangesetData[]> {
  const grouped: Record<string, ChangesetData[]> = {};

  for (const data of changesetData) {
    const date = formatKoreanDate(data.createdAt);
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(data);
  }

  return grouped;
}

/**
 * 패키지의 현재 버전 조회
 */
async function getPackageVersion(packageName: string): Promise<string> {
  try {
    const packagePath = join(
      process.cwd(),
      "packages",
      packageName.replace("@seed-design/", ""),
      "package.json",
    );
    const packageContent = await readFile(packagePath, "utf-8");
    const packageData = JSON.parse(packageContent);
    return packageData.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
}

/**
 * changeset별 변경사항 정리
 */
async function organizeChangesets(changesetData: ChangesetData[]): Promise<
  Array<{
    content: string;
    packages: Array<{
      name: string;
      version: string;
    }>;
  }>
> {
  const result = [];

  for (const data of changesetData) {
    const packages = [];
    for (const [packageName, bumpType] of Object.entries(data.packages)) {
      const currentVersion = await getPackageVersion(packageName);
      const newVersion = inc(currentVersion, bumpType as any) || currentVersion;
      packages.push({
        name: packageName,
        version: newVersion,
      });
    }

    result.push({
      content: data.content,
      packages,
    });
  }

  return result;
}

/**
 * changelog 마크다운 생성
 */
function generateChangelogMarkdown(entries: ChangelogEntry[], existingContent = ""): string {
  // 기존 frontmatter 추출 및 updatedAt 업데이트
  const frontmatterMatch = existingContent.match(/^---\n([\s\S]*?)\n---\n/);
  const currentDate = formatISODate(new Date());

  let frontmatter: string;
  if (frontmatterMatch) {
    const existingFrontmatter = frontmatterMatch[1];
    const updatedAtMatch = existingFrontmatter.match(/updatedAt:\s*.*/);

    if (updatedAtMatch) {
      // 기존 updatedAt 업데이트
      const updatedFrontmatter = existingFrontmatter.replace(
        /updatedAt:\s*.*/,
        `updatedAt: ${currentDate}`,
      );
      frontmatter = `---\n${updatedFrontmatter}\n---\n\n`;
    } else {
      // updatedAt 추가
      const updatedFrontmatter = existingFrontmatter + `\nupdatedAt: ${currentDate}`;
      frontmatter = `---\n${updatedFrontmatter}\n---\n\n`;
    }
  } else {
    // 새로운 frontmatter 생성
    frontmatter = `---
title: Changelog
description: 최신 업데이트와 변경사항을 확인하세요.
updatedAt: ${currentDate}
---

`;
  }

  // 기존 changelog 내용 추출 (새로운 날짜가 아닌 것들)
  const existingEntries = extractExistingEntries(existingContent, entries);

  let markdown = frontmatter;

  // 모든 엔트리 병합 및 정렬 (최신순)
  const allEntries = [...entries, ...existingEntries];
  const sortedEntries = allEntries.sort((a, b) => b.date.localeCompare(a.date));

  for (const entry of sortedEntries) {
    markdown += `## ${entry.date}\n\n`;

    // changeset별 변경사항 (업데이트 내용 먼저)
    for (const changeset of entry.changesets) {
      markdown += `${changeset.content}\n\n`;
    }

    // 패키지 버전 목록
    const allPackages = entry.changesets.flatMap((cs) => cs.packages);
    const uniquePackages = Array.from(new Map(allPackages.map((pkg) => [pkg.name, pkg])).values());

    if (uniquePackages.length > 0) {
      markdown += `### Version Updates\n\n`;
      for (const pkg of uniquePackages.sort((a, b) => a.name.localeCompare(b.name))) {
        markdown += `- ${pkg.name}@${pkg.version}\n`;
      }
      markdown += "\n";
    }
  }

  return markdown;
}

/**
 * 기존 changelog에서 새로운 changeset에 포함되지 않은 항목들 추출
 */
function extractExistingEntries(
  existingContent: string,
  newEntries: ChangelogEntry[],
): ChangelogEntry[] {
  const existingEntries: ChangelogEntry[] = [];
  const newDates = new Set(newEntries.map((entry) => entry.date));

  // 날짜별 섹션 파싱
  const dateRegex = /## (\d{4}\.\d{2}\.\d{2})/g;
  const sections = existingContent.split(dateRegex);

  for (let i = 1; i < sections.length; i += 2) {
    const date = sections[i];
    const content = sections[i + 1];

    // 새로운 changeset에 포함되지 않은 날짜만 보존
    if (!newDates.has(date)) {
      // 기존 형식에서 changeset 정보 추출
      const changesets = [];

      // 업데이트 내용과 패키지 목록 분리
      const packageListMatch = content.match(/### Version Updates\n\n((?:- .*\n)*)/);
      const contentBeforePackages = packageListMatch
        ? content.substring(0, content.indexOf("### Version Updates"))
        : content;

      if (packageListMatch) {
        const packageLines = packageListMatch[1]
          .split("\n")
          .filter((line) => line.trim().startsWith("- "));
        const packages = packageLines
          .map((line) => {
            const match = line.match(/- (.+)@(.+)/);
            return match ? { name: match[1], version: match[2] } : null;
          })
          .filter(Boolean);

        changesets.push({
          content: contentBeforePackages.trim(),
          packages,
        });
      }

      existingEntries.push({
        date,
        changesets,
      });
    }
  }

  return existingEntries;
}

/**
 * 메인 실행 함수
 */
async function main() {
  try {
    console.log("🔍 Parsing changeset files...");
    const changesetData = await parseChangesetFiles();

    if (changesetData.length === 0) {
      console.log("📝 No changeset files found.");
      return;
    }

    console.log(`📊 Found ${changesetData.length} changeset files`);

    const changelogPath = join(process.cwd(), "docs/content/react/get-started/changelog.mdx");
    console.log("📖 Extracting manual content...");
    const manualContents = await extractManualContent(changelogPath);

    console.log("🗂️ Grouping changes by date...");
    const groupedData = groupChangesetsByDate(changesetData);

    const entries: ChangelogEntry[] = [];

    for (const [date, data] of Object.entries(groupedData)) {
      const changesets = await organizeChangesets(data);
      entries.push({
        date,
        changesets,
        manualContent: manualContents[date],
      });
    }

    console.log("📝 Generating changelog markdown...");
    const existingContent = await readFile(changelogPath, "utf-8").catch(() => "");
    const markdown = generateChangelogMarkdown(entries, existingContent);

    console.log("💾 Writing changelog file...");
    await writeFile(changelogPath, markdown);

    console.log("✅ Changelog generated successfully!");
    console.log(`📄 File: ${changelogPath}`);
  } catch (error) {
    console.error("❌ Error generating changelog:", error);
    process.exit(1);
  }
}

main();

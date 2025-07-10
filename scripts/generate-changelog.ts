#!/usr/bin/env bun

/**
 * Docs에 자동으로 추가되는 Changelog를 생성하는 스크립트입니다.
 * changelog의 package graph를 참고하여 관련된 패키지들을 추출하여 버전 업데이트 내용을 자동으로 생성합니다.
 * llms.txt와 같은 파일에 추후에 도움을 받기 위해 변경 이력들을 한 파일에 쌓습니다.
 *
 * 사용법:
 * 1. 프로젝트 루트에서 `bun run generate:changelog` 명령어를 실행합니다.
 * 2. 생성된 Changelog 파일은 `docs/content/react/get-started/changelog.mdx`에 추가됩니다.
 */

import assembleReleasePlan from "@changesets/assemble-release-plan";
import { readPreState } from "@changesets/pre";
import readChangesets from "@changesets/read";
import { getPackages } from "@manypkg/get-packages";
import { readFile, writeFile } from "fs/promises";
import { join } from "path";

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

interface ChangesetConfig {
  linked?: string[][];
  ignore?: string[];
  privatePackages?: {
    version?: boolean;
    tag?: boolean;
  };
  [key: string]: any; // changeset의 다른 설정들도 포함
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
 * changeset config 파일 읽기
 */
async function readChangesetConfig(): Promise<ChangesetConfig> {
  try {
    const configPath = join(process.cwd(), ".changeset/config.json");
    const configContent = await readFile(configPath, "utf-8");
    const config = JSON.parse(configContent);

    // 기본값 설정
    return {
      ignore: [],
      privatePackages: {
        version: false,
        tag: false,
      },
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        onlyUpdatePeerDependentsWhenOutOfRange: false,
        updateInternalDependents: "patch",
        useCalculatedVersionForSnapshots: false,
      },
      fixed: [],
      bumpVersionsWithWorkspaceProtocolOnly: false,
      snapshot: {
        prereleaseTemplate: null,
        useCalculatedVersion: false,
      },
      ...config,
    };
  } catch {
    return {
      ignore: [],
      privatePackages: {
        version: false,
        tag: false,
      },
      ___experimentalUnsafeOptions_WILL_CHANGE_IN_PATCH: {
        onlyUpdatePeerDependentsWhenOutOfRange: false,
        updateInternalDependents: "patch",
        useCalculatedVersionForSnapshots: false,
      },
      fixed: [],
      linked: [],
      bumpVersionsWithWorkspaceProtocolOnly: false,
      snapshot: {
        prereleaseTemplate: null,
        useCalculatedVersion: false,
      },
    };
  }
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
 * ReleasePlan을 ChangelogEntry로 변환
 */
function organizeChangelogEntries(
  releasePlan: any,
  manualContents: Record<string, string>,
): ChangelogEntry[] {
  // 실제로 버전이 변경되는 releases만 필터링 (type !== "none")
  const actualReleases = releasePlan.releases.filter((release: any) => release.type !== "none");

  console.log(`🔍 Debug: Found ${actualReleases.length} actual releases (type !== "none"):`);
  actualReleases.forEach((release: any) => {
    console.log(
      `  - ${release.name}: ${release.oldVersion} → ${release.newVersion} (${release.type}), changesets: [${release.changesets.join(", ")}]`,
    );
  });

  console.log(`🔍 Debug: Found ${releasePlan.changesets.length} changesets:`);
  releasePlan.changesets.forEach((changeset: any, index: number) => {
    console.log(`  ${index + 1}. ${changeset.id}: "${changeset.summary}"`);
  });

  if (actualReleases.length === 0) {
    return [];
  }

  // 단순화된 접근: 모든 실제 릴리스를 하나의 엔트리로 그룹핑
  const createdAt = new Date();
  const dateKey = formatKoreanDate(createdAt);

  const entries: ChangelogEntry[] = [];

  if (releasePlan.changesets.length > 0) {
    entries.push({
      date: dateKey,
      changesets: [
        {
          content: releasePlan.changesets[0].summary, // 첫 번째 changeset 사용
          packages: actualReleases.map((release: any) => ({
            name: release.name,
            version: release.newVersion,
          })),
        },
      ],
      manualContent: manualContents[dateKey],
    });

    console.log(`🔍 Debug: Created entry with ${actualReleases.length} packages`);
  }

  return entries;
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
description: 최신 업데이트와 변경사항을 기록합니다.
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
    console.log("🔧 Reading changeset config...");
    const config = await readChangesetConfig();

    console.log("🔍 Reading changesets...");
    const changesets = await readChangesets(process.cwd());

    if (changesets.length === 0) {
      console.log("📝 No changeset files found.");
      return;
    }

    console.log(`📊 Found ${changesets.length} changeset files`);

    console.log("📦 Getting packages...");
    const packages = await getPackages(process.cwd());

    console.log("📋 Assembling release plan...");
    const preState = await readPreState(process.cwd());
    const releasePlan = assembleReleasePlan(changesets, packages, config, preState);

    console.log(`🎯 Release plan: ${releasePlan.releases.length} packages to update`);
    releasePlan.releases.forEach((release: any) => {
      console.log(
        `  - ${release.name}: ${release.oldVersion} → ${release.newVersion} (${release.type})`,
      );
    });

    const changelogPath = join(process.cwd(), "docs/content/react/get-started/changelog.mdx");
    console.log("📖 Extracting manual content...");
    const manualContents = await extractManualContent(changelogPath);

    console.log("🗂️ Organizing changelog entries...");
    const entries = organizeChangelogEntries(releasePlan, manualContents);

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

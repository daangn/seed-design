import { getConfig } from "@/src/utils/get-config";
import {
  fetchRegistryItem,
  getRegistryLibIndex,
  getRegistryUIIndex,
} from "@/src/utils/get-metadata";
import { transform } from "@/src/utils/transformers";
import * as p from "@clack/prompts";
import fs from "fs-extra";
import path from "path";
import color from "picocolors";
import { z } from "zod";

import type { CAC } from "cac";
import { BASE_URL } from "../constants";
import { addRelativeRegistries } from "../utils/add-relative-registries";
import { highlight } from "../utils/color";
import { installDependencies } from "../utils/install";

const addOptionsSchema = z.object({
  components: z.array(z.string()).optional(),
  cwd: z.string(),
  all: z.boolean(),
  baseUrl: z.string().optional(),
  // yes: z.boolean(),
  // overwrite: z.boolean(),
  // path: z.string().optional(),
});

export const addCommand = (cli: CAC) => {
  cli
    .command("add [...components]", "add component")
    .option("-a, --all", "Add all components", {
      default: false,
    })
    .option("-c, --cwd <cwd>", "the working directory. defaults to the current directory.", {
      default: process.cwd(),
    })
    .option(
      "-u, --baseUrl <baseUrl>",
      "the base url of the registry. defaults to the current directory.",
      {
        default: BASE_URL,
      },
    )
    .example("seed-design add action-button")
    .example("seed-design add alert-dialog")
    .action(async (components, opts) => {
      p.intro(color.bgCyan("seed-design add"));
      const options = addOptionsSchema.parse({
        components,
        ...opts,
      });
      const cwd = options.cwd;
      const baseUrl = options.baseUrl;
      const config = await getConfig(cwd);
      const registryComponentIndex = await getRegistryUIIndex(baseUrl);
      const libRegistryIndex = await getRegistryLibIndex(baseUrl);
      let selectedComponents: string[] = options.all
        ? registryComponentIndex.map((registry) => registry.name)
        : options.components;

      if (!options.components?.length && !options.all) {
        const selects = await p.multiselect<
          { label: string; value: string; hint: string }[],
          string
        >({
          message: "추가할 컴포넌트를 선택해주세요 (스페이스 바로 여러 개 선택 가능)",
          options: registryComponentIndex.map((metadata) => {
            return {
              label: metadata.name,
              value: metadata.name,
              hint: metadata.description,
            };
          }),
        });

        if (p.isCancel(selects)) {
          p.log.error("취소되었어요.");
          process.exit(0);
        }

        selectedComponents = selects as string[];
      }

      if (!selectedComponents?.length) {
        p.log.error("컴포넌트를 찾을 수 없어요.");
        process.exit(0);
      }

      p.log.message(`선택된 컴포넌트: ${highlight(selectedComponents.join(", "))}`);

      const allRelativeRegistries = addRelativeRegistries({
        userSelects: selectedComponents,
        uiRegistryIndex: registryComponentIndex,
        libRegistryIndex,
      });

      const allRegistryItems = [];

      const { start, stop } = p.spinner();
      start("Registry를 가져오고 있어요...");

      for (const registry of allRelativeRegistries) {
        const registryItem = await fetchRegistryItem(registry.name, baseUrl, registry.type);
        allRegistryItems.push(registryItem);
      }

      stop();

      if (allRegistryItems.length) {
        const filteredRegistryItems = allRegistryItems.filter(
          (c) => !selectedComponents.includes(c.name),
        );
        p.log.message(
          `추가로 설치될 레지스트리: ${highlight(
            filteredRegistryItems.map((c) => c.name).join(", "),
          )}`,
        );
      }

      // 선택된 컴포넌트.json 레지스트리 파일 기반으로 컴포넌트를 추가합니다.
      const registryResult = [];
      const installResult = {
        installed: new Set(),
        filtered: new Set(),
      };
      for (const component of allRegistryItems) {
        for (const registry of component.registries) {
          let targetPath = "";
          switch (registry.type) {
            case "ui":
              targetPath = config.resolvedUIPaths;
              break;
            case "lib":
              targetPath = config.resolvedLibPaths;
              break;
            default:
              break;
          }

          if (!fs.existsSync(targetPath)) {
            await fs.mkdir(targetPath, { recursive: true });
          }

          let filePath = path.resolve(targetPath, registry.name);

          const content = await transform({
            filename: registry.name,
            config,
            raw: registry.content,
          });

          if (!config.tsx) {
            filePath = filePath.replace(/\.tsx$/, ".jsx");
            filePath = filePath.replace(/\.ts$/, ".js");
          }

          await fs.writeFile(filePath, content);
          const relativePath = path.relative(cwd, filePath);

          registryResult.push({
            name: registry.name,
            path: relativePath,
          });
        }

        // Install dependencies.
        if (component.dependencies?.length) {
          const result = await installDependencies({ cwd, deps: component.dependencies });
          installResult.installed = new Set([...installResult.installed, ...result.installed]);
          installResult.filtered = new Set([...installResult.filtered, ...result.filtered]);
        }

        // Install devDependencies.
        if (component.devDependencies?.length) {
          const result = await installDependencies({
            cwd,
            deps: component.devDependencies,
            dev: true,
          });
          installResult.installed = new Set([...installResult.installed, ...result.installed]);
          installResult.filtered = new Set([...installResult.filtered, ...result.filtered]);
        }

        p.log.success(`${highlight(component.name)} 관련 파일 추가 완료`);
      }

      if (installResult.installed.size) {
        p.log.message(
          `설치된 의존성: ${highlight(Array.from(installResult.installed).join(", "))}`,
        );
      }
      if (installResult.filtered.size) {
        p.log.message(
          `이미 설치된 의존성: ${highlight(Array.from(installResult.filtered).join(", "))}`,
        );
      }
      if (registryResult.length) {
        for (const registry of registryResult) {
          p.log.message(`추가된 파일: ${highlight(registry.path)}`);
        }
      }

      p.outro("컴포넌트 추가 완료.");
    });
};

#!/usr/bin/env node

import { cac } from "cac";
import { buildCommand } from "../commands/build.js";
import { checkCommand } from "../commands/check.js";
import { depsCommand } from "../commands/deps.js";
import { lintCommand } from "../commands/lint.js";
import { serveCommand } from "../commands/serve.js";

const cli = cac("kontext");

buildCommand(cli);
depsCommand(cli);
checkCommand(cli);
lintCommand(cli);
serveCommand(cli);

cli.version("0.0.0", "-v, --version");
cli.help();
cli.parse();

#!/usr/bin/env node

import yargs from "yargs";

import { commands } from "./commands";

const cli = yargs(process.argv.slice(2));

for (const [name, register] of Object.entries(commands)) register(cli, name);

cli.help().argv;

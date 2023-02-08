#!/usr/bin/env node
import appRoot from 'app-root-path';
import chalk from 'chalk';
import { Command } from 'commander';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';
import pkg from '../package.json' assert { type: 'json' };

import generateComponent from './templates/component';
import generateConfig from './templates/config';
import generateSprite from './templates/sprite';
import { IconConfig } from './types';
import { validateIcons } from './validates/icons';

const program = new Command();
const configPath = path.resolve(appRoot.path, 'icon.config.yml');
const version = pkg.version;

const initCommand = new Command('init')
  .alias('-i')
  .description('Initialize icon.config.yml')
  .action(() => {
    try {
      const config = generateConfig();
      fs.writeFileSync(configPath, config);
      console.log(chalk.green('icon.config.yml generated!'));
    } catch (e) {
      console.error(e);
    }
  });

const generateCommand = new Command('generate')
  .alias('gen')
  .description('Generate SVG sprite and SeedIcon component')
  .action(() => {
    try {
      const fileContents = yaml.load(fs.readFileSync(configPath, 'utf8')) as IconConfig;

      const icons = fileContents.icons;

      const spriteFileName = fileContents.spriteFileName || 'sprite';
      const spriteOutputPath = fileContents.spriteOutputPath || 'assets';

      const componentFileName = fileContents.componentFileName || 'SeedIcon';
      const componentOutputPath = fileContents.componentOutputPath || 'src';

      validateIcons(icons);
      
      const seedIconComponent = generateComponent({ componentOutputPath, spriteOutputPath, spriteFileName, version, icons });
      const spriteSvg = generateSprite({ icons });
      
      const spriteOutputDir = path.resolve(spriteOutputPath);
      const iconComponentOutputDir = path.resolve(componentOutputPath);

      if (!fs.existsSync(spriteOutputDir)) {
        fs.mkdirSync(spriteOutputDir, { recursive: true });
      }

      if (!fs.existsSync(iconComponentOutputDir)) {
        fs.mkdirSync(iconComponentOutputDir, { recursive: true });
      }
  
      fs.writeFileSync(path.resolve(spriteOutputPath, `${spriteFileName}.svg`), spriteSvg);
      fs.writeFileSync(path.resolve(componentOutputPath, `${componentFileName}.tsx`), seedIconComponent);
      
      console.log(chalk.green(`SVG sprite generate complete at ${spriteOutputPath}/${spriteFileName}.svg!`));
      console.log(chalk.green(`SeedIcon component generate complete at ${componentOutputPath}/${componentFileName}.tsx!`));
    } catch (error) {
      if (error instanceof Error) {
        if (error.message) {
          console.error(error.message);
        }
      }
      process.exit(1);
    }
  });

program
  .version(version, '-v, --version')
  .description('Generate SVG sprite and SeedIcon component')
  .addCommand(initCommand)
  .addCommand(generateCommand)
  .parse(process.argv);

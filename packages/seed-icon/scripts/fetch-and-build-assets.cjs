const path = require('path');
const { mkdirSync } = require('fs');
const fs = require('fs/promises');
const task = require('tasuku');
const got = require('got');
const svgo = require('svgo');
const svgr = require('@svgr/core');
const svg2vectordrawable = require('svg2vectordrawable');
const _ = require('lodash');

require('dotenv').config();

const iconData = require('../data/icondata.json');

const concurrency = +(process.env.CONCURRENCY || '10');
const figmaFileKey = process.env.FIGMA_FILE_KEY;
const figmaAccessToken = process.env.FIGMA_ACCESS_TOKEN;
const skipSVG = process.env.SKIP_SVG === 'true';
const skipPDF = process.env.SKIP_PDF === 'true';

if (!figmaFileKey) {
  throw new Error('FIGMA_FILE_KEY is required');
}

if (!figmaAccessToken) {
  throw new Error('FIGMA_ACCESS_TOKEN is required');
}

const figmaEndpoint = 'https://api.figma.com/v1';
const iconNameMap = new Map(iconData);
const ids = iconData.map(icon => icon[0]).join(',');

const basePath = path.resolve(__dirname, '..');

const svgPath = path.resolve(basePath, 'svg');
mkdirSync(svgPath, { recursive: true });

const drawablePath = path.resolve(basePath, 'drawable');
mkdirSync(drawablePath, { recursive: true });

const componentPath = path.resolve(basePath, 'src/react');
mkdirSync(componentPath, { recursive: true });

const pdfPath = path.resolve(basePath, 'pdf');
mkdirSync(pdfPath, { recursive: true });

task.group(task => [
  !skipSVG && task('Fetch SVG URLs', async ({ task, setTitle }) => {
    const { body } = await got(`${figmaEndpoint}/images/${figmaFileKey}`, {
      responseType: 'json',
      headers: {
        'X-FIGMA-TOKEN': figmaAccessToken,
      },
      searchParams: {
        ids,
        format: 'svg',
      },
    });
    const imageEntries = Object.entries(body.images);
    const imageEntriesChunks = _.chunk(imageEntries, concurrency);
    for (let i = 0; i < imageEntriesChunks.length; i++) {
      setTitle(`Processing chunks (${i+1}/${imageEntriesChunks.length})`);
      const chunk = imageEntriesChunks[i];
      const chunkTask = await task.group(task =>
        chunk.map(([nodeId, downloadUrl]) => {
          const iconName = iconNameMap.get(nodeId);
          return task(`Downloading ${iconName}`, async ({ task, setTitle }) => {
            const { body } = await got(downloadUrl);
            const exportingTask = await task.group(task => [
              task('Save as SVG', async ({ task }) => {
                const filePath = path.join(svgPath, `${iconName}.svg`);
                let { data: svg } = svgo.optimize(body, {
                  js2svg: {
                    indent: 2,
                    pretty: true,
                  },
                  plugins: [
                    {
                      name: 'addAttributesToSVGElement',
                      params: {
                        attributes: [{ 'data-karrot-ui-icon': true }],
                      },
                    },
                  ],
                });
                svg = svg.replace(/#212124/g, 'currentColor');
                await fs.writeFile(filePath, svg, 'utf-8');
              }),
              task('Save as React Component', async ({ task }) => {
                const componentName = iconName
                  .replace(/^[a-z]/, ch => ch.toUpperCase())
                  .replace(/_[a-z]/g, ch => ch[1].toUpperCase());
                const filePath = path.join(componentPath, `${componentName}.tsx`);
                let component = await svgr.transform(body, {
                  plugins: [
                    '@svgr/plugin-svgo',
                    '@svgr/plugin-jsx',
                    '@svgr/plugin-prettier',
                  ],
                  replaceAttrValues: {
                    '#212124': 'currentColor',
                  },
                  prettierConfig: {
                    tabWidth: 2,
                    useTabs: false,
                    singleQuote: true,
                    semi: true,
                  },
                  svgoConfig: {
                    plugins: [
                      {
                        name: 'addAttributesToSVGElement',
                        params: {
                          attributes: [{ 'data-karrot-ui-icon': true }],
                        },
                      },
                    ],
                  },
                  typescript: true,
                  dimensions: false,
                }, { componentName });
                component = component.slice(`import * as React from "react";\n`.length);
                await fs.writeFile(filePath, component, 'utf-8');
              }),
              task('Save as Vector Drawable', async ({ task }) => {
                const filePath = path.join(drawablePath, `${iconName}.xml`);

                let drawable = await svg2vectordrawable(body);
                drawable = drawable.replace(/#FF212124/g, '@color/gray900');

                await fs.writeFile(filePath, drawable, 'utf-8');
              }),
            ]);

            exportingTask.clear();
            setTitle(`Successfully exported ${iconName}`);
          });
        }),
        { concurrency },
      );

      chunkTask.clear();
    }
  }),
  !skipPDF && task('Fetch PDF URLs', async ({ task, setTitle }) => {
    const { body } = await got(`${figmaEndpoint}/images/${figmaFileKey}`, {
      responseType: 'json',
      headers: {
        'X-FIGMA-TOKEN': figmaAccessToken,
      },
      searchParams: {
        ids,
        format: 'pdf',
      },
    });
    const imageEntries = Object.entries(body.images);
    const imageEntriesChunks = _.chunk(imageEntries, concurrency);
    for (let i = 0; i < imageEntriesChunks.length; i++) {
      setTitle(`Processing chunks (${i+1}/${imageEntriesChunks.length})`);
      const chunk = imageEntriesChunks[i];
      const chunkTask = await task.group(task =>
        chunk.map(([nodeId, downloadUrl]) => {
          const iconName = iconNameMap.get(nodeId);
          return task(`Downloading ${iconName}`, async ({ task, setTitle }) => {
            const { body } = await got(downloadUrl);

            setTitle('Save as PDF');
            const filePath = path.join(pdfPath, `${iconName}.pdf`);
            await fs.writeFile(filePath, body);
          });
        }),
        { concurrency },
      );

      chunkTask.clear();
    }
  }),
].filter(Boolean), { concurrency: 1 });

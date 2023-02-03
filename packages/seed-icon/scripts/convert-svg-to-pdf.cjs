const path = require('path');
const { mkdirSync } = require('fs');
const fs = require('fs/promises');
const { JSDOM } = require('jsdom');
const { jsPDF } = require('jspdf');
require('svg2pdf.js');

const basePath = path.resolve(__dirname, '..');
const svgPath = path.resolve(basePath, 'svg');
const pdfPath = path.resolve(basePath, 'pdf');
mkdirSync(pdfPath, { recursive: true });

(async () => {
  const jsdom = new JSDOM(`<!DOCTYPE html><body></body>`);

  global.window = jsdom.window;
  global.document = jsdom.window.document;

  const svgFiles = await fs.readdir(svgPath);

  console.log(`converting ${svgFiles.length} files...`);

  for (const svgFile of svgFiles) {
    const id = path.parse(svgFile).name;
    const svg = await fs.readFile(path.resolve(svgPath, svgFile), 'utf-8');

    const container = document.body;
    container.innerHTML = svg;

    const element = container.firstElementChild;

    const doc = new jsPDF('l', 'pt', [24, 24]);
    const pdf = await doc.svg(element, { width: 24, height: 24 });
    await pdf.save(
      path.resolve(pdfPath, id + '.pdf'),
      { returnPromise: true },
    );
  }
})();

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router';
import { AppRoutes } from '../src/App';

const siteRoutes = [
  '/',
  '/appartement',
  '/galerie',
  '/disponibilites',
  '/reservation',
  '/sete',
  '/guide',
  '/partenaires',
  '/faq',
  '/contact',
  '/mentions-legales',
  '/confidentialite',
  '/conditions-de-reservation',
];

const distDirectory = join(process.cwd(), 'dist');
const template = await readFile(join(distDirectory, 'index.html'), 'utf8');

for (const route of siteRoutes) {
  const helmetContext: { helmet?: { title: { toString(): string }; meta: { toString(): string }; link: { toString(): string }; script: { toString(): string } } } = {};
  const app = renderToString(
    createElement(
      HelmetProvider,
      { context: helmetContext },
      createElement(StaticRouter, { location: route }, createElement(AppRoutes)),
    ),
  );
  // React 19 hoists document metadata into the rendered stream. Move those
  // elements into <head> so the generated document is valid static HTML.
  const metadataPattern = /<title[\s\S]*?<\/title>|<meta\b[^>]*\/>|<link\b[^>]*\/>|<script\b[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/g;
  const renderedMetadata = app.match(metadataPattern)?.join('') ?? '';
  const body = app.replace(metadataPattern, '');
  const helmet = helmetContext.helmet;
  const collectedMetadata = helmet ? `${helmet.title.toString()}${helmet.meta.toString()}${helmet.link.toString()}${helmet.script.toString()}` : '';
  const head = renderedMetadata || collectedMetadata;
  const page = template
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)
    .replace('</head>', `${head}</head>`);
  const outputPath = route === '/' ? join(distDirectory, 'index.html') : join(distDirectory, route.slice(1), 'index.html');

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, page);
}

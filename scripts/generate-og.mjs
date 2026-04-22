#!/usr/bin/env node
// Generates per-post Open Graph preview images and static HTML stubs
// so that sharing a link like https://leiro.dev/blog/{slug}/ yields a
// rich embed with the post title and "leiro.dev" in the corner.

import { mkdir, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createCanvas, GlobalFonts } from '@napi-rs/canvas';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = resolve(ROOT, existsSync(resolve(ROOT, 'dist')) ? 'dist' : 'public');

const API_BASE = 'https://utils.leiro.dev';
const SITE_URL = 'https://leiro.dev';
const SITE_NAME = 'leiro.dev';
const AUTHOR = 'Abraham Leiro Fernández';

const WIDTH = 1200;
const HEIGHT = 630;

GlobalFonts.registerFromPath(resolve(__dirname, 'assets/Tinos-Bold.ttf'), 'TinosBold');
GlobalFonts.registerFromPath(resolve(__dirname, 'assets/Tinos-Regular.ttf'), 'TinosRegular');

async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  let lastPage = 1;
  do {
    const res = await fetch(`${API_BASE}/posts?page=${page}`);
    if (!res.ok) throw new Error(`Failed to fetch page ${page}: ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json.data)) posts.push(...json.data);
    lastPage = json.last_page ?? 1;
    page++;
  } while (page <= lastPage);
  return posts;
}

function wrapLines(ctx, text, maxWidth) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function renderOgImage(title) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  // Paper-white background matching the site
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Heavy bottom + right border, mimicking the site's card style
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, HEIGHT - 12, WIDTH, 12);
  ctx.fillRect(WIDTH - 12, 0, 12, HEIGHT);

  // Inner margin
  const padX = 80;
  const padY = 80;
  const maxTitleWidth = WIDTH - padX * 2;

  // Top label
  ctx.fillStyle = '#6b7280';
  ctx.font = 'italic 28px TinosRegular';
  ctx.textBaseline = 'top';
  ctx.fillText('Blog', padX, padY);

  // Title, auto-sized to fit the available vertical space
  ctx.fillStyle = '#000000';
  let fontSize = 96;
  let lines = [];
  const titleTop = padY + 70;
  const titleMaxBottom = HEIGHT - padY - 80;
  const maxLines = 5;

  while (fontSize >= 44) {
    ctx.font = `${fontSize}px TinosBold`;
    lines = wrapLines(ctx, title, maxTitleWidth);
    const lineHeight = Math.round(fontSize * 1.15);
    const totalHeight = lines.length * lineHeight;
    if (lines.length <= maxLines && titleTop + totalHeight <= titleMaxBottom) break;
    fontSize -= 6;
  }
  if (lines.length > maxLines) {
    lines = lines.slice(0, maxLines);
    lines[maxLines - 1] = `${lines[maxLines - 1].replace(/\s*\S*$/, '')}…`;
  }

  const lineHeight = Math.round(fontSize * 1.15);
  lines.forEach((line, i) => {
    ctx.fillText(line, padX, titleTop + i * lineHeight);
  });

  // Bottom corner: site name (left) + author (right)
  ctx.textBaseline = 'bottom';
  ctx.fillStyle = '#000000';
  ctx.font = '28px TinosBold';
  ctx.fillText(SITE_NAME, padX, HEIGHT - padY + 40);

  ctx.fillStyle = '#6b7280';
  ctx.font = 'italic 24px TinosRegular';
  const author = AUTHOR;
  const authorWidth = ctx.measureText(author).width;
  ctx.fillText(author, WIDTH - padX - authorWidth, HEIGHT - padY + 38);

  return canvas.toBuffer('image/png');
}

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildDescription(post) {
  if (post.excerpt) return post.excerpt;
  if (post.body) {
    const plain = String(post.body)
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#>*_~`-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (plain.length > 180) return `${plain.slice(0, 177).trimEnd()}…`;
    return plain;
  }
  return `${AUTHOR} — Blog`;
}

function renderStubHtml(post, imagePath) {
  const title = `${post.title} — ${AUTHOR}`;
  const description = buildDescription(post);
  const url = `${SITE_URL}/blog/${post.slug}/`;
  const imageUrl = `${SITE_URL}${imagePath}`;
  const hashUrl = `${SITE_URL}/#/blog/${post.slug}`;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<meta name="description" content="${escapeHtml(description)}" />
<link rel="canonical" href="${escapeHtml(url)}" />
<link rel="icon" type="image/png" href="/img/favicon.png" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="${escapeHtml(AUTHOR)}" />
<meta property="og:url" content="${escapeHtml(url)}" />
<meta property="og:title" content="${escapeHtml(post.title)}" />
<meta property="og:description" content="${escapeHtml(description)}" />
<meta property="og:image" content="${escapeHtml(imageUrl)}" />
<meta property="og:image:width" content="${WIDTH}" />
<meta property="og:image:height" content="${HEIGHT}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:domain" content="leiro.dev" />
<meta name="twitter:url" content="${escapeHtml(url)}" />
<meta name="twitter:title" content="${escapeHtml(post.title)}" />
<meta name="twitter:description" content="${escapeHtml(description)}" />
<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
<meta http-equiv="refresh" content="0; url=${escapeHtml(hashUrl)}" />
<script>window.location.replace(${JSON.stringify(hashUrl)});</script>
</head>
<body>
<p><a href="${escapeHtml(hashUrl)}">Continue to ${escapeHtml(post.title)}</a></p>
</body>
</html>
`;
}

async function main() {
  console.log(`[og] output dir: ${OUT_DIR}`);

  let posts;
  try {
    posts = await fetchAllPosts();
  } catch (err) {
    console.warn(`[og] skipping: could not fetch posts (${err.message})`);
    return;
  }
  if (posts.length === 0) {
    console.warn('[og] no posts returned from API, nothing to generate');
    return;
  }
  console.log(`[og] generating embeds for ${posts.length} posts`);

  const imgDir = resolve(OUT_DIR, 'blog/og');
  await mkdir(imgDir, { recursive: true });

  for (const post of posts) {
    if (!post.slug || !post.title) continue;
    const png = renderOgImage(post.title);
    const imagePath = `/blog/og/${post.slug}.png`;
    await writeFile(resolve(OUT_DIR, `blog/og/${post.slug}.png`), png);

    const stubDir = resolve(OUT_DIR, `blog/${post.slug}`);
    await mkdir(stubDir, { recursive: true });
    await writeFile(resolve(stubDir, 'index.html'), renderStubHtml(post, imagePath));
    console.log(`[og]  ✓ ${post.slug}`);
  }

  console.log('[og] done');
}

main().catch((err) => {
  console.error('[og] failed:', err);
  // Do not fail the build on OG generation errors.
});

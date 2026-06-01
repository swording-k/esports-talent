import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const read = (path) => readFileSync(join(root, path), 'utf8');

assert.ok(existsSync(join(root, 'index.html')), 'index.html must exist at project root');
assert.ok(existsSync(join(root, 'styles.css')), 'styles.css must be split out locally');
assert.ok(existsSync(join(root, 'src/app.js')), 'src/app.js must be split out locally');
assert.ok(existsSync(join(root, 'assets/icon.png')), '300x300 PNG product icon must exist locally');
assert.ok(existsSync(join(root, 'assets/douyin-qr.png')), 'Douyin QR code image must exist locally');

const index = read('index.html');
const css = read('styles.css');
const app = read('src/app.js');

assert.match(index, /<link rel="stylesheet" href="\.\/styles\.css">/);
assert.match(index, /href="\.\/assets\/icon\.png"/);
assert.match(index, /<script src="\.\/src\/app\.js" defer><\/script>/);
assert.match(read('README.md'), /!\[抖音扫码体验二维码\]\(assets\/douyin-qr\.png\)/);
assert.doesNotMatch(index, /maximum-scale|user-scalable\s*=\s*no/i);

const publishSurface = `${index}\n${css}\n${app}`;
for (const blocked of [
  /\bfetch\s*\(/,
  /\bXMLHttpRequest\b/,
  /\bWebSocket\b/,
  /<iframe\b/i,
  /https?:\/\//i,
  /\bonload\s*=/i,
  /\bonerror\s*=/i,
  /\bonclick\s*=/i,
  /\bontouchstart\s*=/i
]) {
  assert.doesNotMatch(publishSurface, blocked, `blocked platform pattern found: ${blocked}`);
}

assert.match(app, /esportsTalent\.v2\.best\./, 'versioned best-score keys are required');
assert.match(app, /esportsTalent\.v2\.summary/, 'summary storage key is required');
assert.match(app, /controlOffsetY/, 'touch offset controls must be implemented');
assert.match(app, /correctCountForRound/, 'vision game must preserve the shown count');
assert.match(app, /class TrackingGame/, 'tracking game must exist');
assert.match(app, /class CoordinationGame/, 'coordination game must exist');

const totalBytes = ['index.html', 'styles.css', 'src/app.js', 'README.md', '项目介绍文档.md']
  .filter((file) => existsSync(join(root, file)))
  .reduce((sum, file) => sum + statSync(join(root, file)).size, 0);
assert.ok(totalBytes < 8 * 1024 * 1024, 'publishable files must stay under 8MB');

const icon = readFileSync(join(root, 'assets/icon.png'));
assert.equal(icon.readUInt32BE(16), 300, 'icon width must be 300px');
assert.equal(icon.readUInt32BE(20), 300, 'icon height must be 300px');
assert.ok(icon.byteLength < 2 * 1024 * 1024, 'icon must be smaller than 2MB');

console.log('static checks passed');

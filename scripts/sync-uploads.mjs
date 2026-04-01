import { existsSync, rmSync, cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const source = resolve(root, 'uploads');
const target = resolve(root, 'public', 'uploads');

if (!existsSync(source)) {
  console.warn('[sync-uploads] Source folder not found:', source);
  process.exit(0);
}

mkdirSync(resolve(root, 'public'), { recursive: true });

if (existsSync(target)) {
  rmSync(target, { recursive: true, force: true });
}

cpSync(source, target, { recursive: true });
console.log('[sync-uploads] Copied uploads -> public/uploads');

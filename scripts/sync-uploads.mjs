import { existsSync, cpSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const source = resolve(root, 'uploads');
const target = resolve(root, 'public', 'uploads');

if (!existsSync(source)) {
  console.warn('[sync-uploads] Source folder not found:', source);
  process.exit(0);
}

mkdirSync(resolve(root, 'public'), { recursive: true });
mkdirSync(target, { recursive: true });

/* Merge into public/uploads — do not delete the whole tree (wiped contact/hero/research, etc.). */
cpSync(source, target, { recursive: true });
console.log('[sync-uploads] Merged uploads/ -> public/uploads');

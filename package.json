import { cpSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
mkdirSync('./dist', { recursive: true });
cpSync('./index.html', './dist/index.html');
cpSync('./service-worker-nuclear.js', './dist/service-worker-nuclear.js');
console.log('✅ Build Success');

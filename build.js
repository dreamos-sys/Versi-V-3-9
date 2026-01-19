const fs = require('fs');
const path = require('path');

// Buat folder dist
fs.mkdirSync('dist', { recursive: true });

// Copy file
fs.copyFileSync('index.html', 'dist/index.html');
fs.copyFileSync('service-worker-nuclear.js', 'dist/service-worker-nuclear.js');

console.log('✅ Build Success');

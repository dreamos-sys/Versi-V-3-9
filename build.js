const fs = require('fs');
  if (!fs.existsSync('dist')) fs.mkdirSync('dist');
  fs.copyFileSync('index.html', 'dist/index.html');
  fs.copyFileSync('service-worker-nuclear.js', 'dist/service-worker-nuclear.js');
  console.log('✅ Build Success');

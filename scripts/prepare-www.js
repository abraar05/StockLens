const fs = require('fs');
const path = require('path');

const wwwDir = path.resolve(__dirname, '..', 'www');
if (fs.existsSync(wwwDir)) {
  fs.rmSync(wwwDir, { recursive: true, force: true });
}
fs.mkdirSync(wwwDir, { recursive: true });

const copyList = [
  'index.html',
  'styles.css',
  'app.js',
  'manifest.json',
  'sw.js',
  'supabase-config.js',
  'supabase-schema.sql'
];

copyList.forEach(file => {
  const src = path.resolve(__dirname, '..', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(wwwDir, file));
    console.log(`Copied ${file} to www/`);
  }
});

// Copy directories
['data', 'icons'].forEach(dir => {
  const srcDir = path.resolve(__dirname, '..', dir);
  const destDir = path.join(wwwDir, dir);
  if (fs.existsSync(srcDir)) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`Copied directory ${dir} to www/`);
  }
});

console.log('www bundle successfully prepared for Capacitor Android build.');

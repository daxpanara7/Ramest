const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const newHtml = html.replace(/<div class="glass-card card-1">[\s\S]*?<\/div>[\s\S]*?<div class="glass-card card-2">[\s\S]*?<\/div>[\s\S]*?<div class="glass-card card-3">[\s\S]*?<\/div>/g, '');
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Cards removed');

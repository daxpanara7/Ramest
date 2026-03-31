const fs = require('fs');
const path = require('path');

const dir = 'd:\\Ramest_Technolabs';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'hire-developers.html');

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Replace Nav
    const navTarget = '<li class="nav-item"><a href="services.html" class="nav-link">Services</a></li>';
    const navReplacement = '<li class="nav-item"><a href="services.html" class="nav-link">Services</a></li>\n                    <li class="nav-item"><a href="hire-developers.html" class="nav-link">Hire Developers</a></li>';

    // Replace Footer
    const footerTarget = '<li><a href="services.html">Services</a></li>';
    const footerReplacement = '<li><a href="services.html">Services</a></li>\n                    <li><a href="hire-developers.html">Hire Developers</a></li>';

    let changed = false;
    if (content.includes(navTarget) && !content.includes('href="hire-developers.html" class="nav-link"')) {
        content = content.replace(navTarget, navReplacement);
        changed = true;
    }
    if (content.includes(footerTarget) && !content.includes('href="hire-developers.html">Hire Developers')) {
        content = content.replace(footerTarget, footerReplacement);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated ${file}`);
    }
}

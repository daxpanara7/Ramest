const fs = require('fs');
const path = require('path');

const dir = 'd:\\Ramest_Technolabs';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const newFooter = `<footer class="footer">
        <div class="container footer-container footer-container-4">
            <div class="footer-col">
                <a href="index.html" class="logo footer-logo">Ramest <span class="highlight">Technolabs</span></a>
                <p class="footer-text">Empowering businesses with next-gen technology. We turn ideas into powerful
                    digital products.</p>
                <div class="social-links" style="margin-top:1.25rem;">
                    <a href="#" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                    <a href="#" aria-label="Twitter"><i class="fa-brands fa-twitter"></i></a>
                    <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="#" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
                </div>
            </div>
            <div class="footer-col">
                <h3 class="footer-title">Quick Links</h3>
                <ul class="footer-links">
                    <li><a href="index.html">Home</a></li>
                    <li><a href="services.html">Services</a></li>
                    <li><a href="company.html">Company</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3 class="footer-title">Company</h3>
                <ul class="footer-links">
                    <li><a href="about.html">About Us</a></li>
                    <li><a href="team.html">Our Team</a></li>
                    <li><a href="methodology.html">Methodology</a></li>
                    <li><a href="certifications.html">Certifications</a></li>
                    <li><a href="careers.html">Careers</a></li>
                </ul>
            </div>
            <div class="footer-col">
                <h3 class="footer-title">Contact</h3>
                <ul class="footer-links footer-contact">
                    <li><i class="fa-solid fa-envelope"></i> hr@ramesttechnolabs.com</li>
                    <li><i class="fa-solid fa-phone"></i> +91 9510903725</li>
                    <li><i class="fa-solid fa-location-dot"></i> satellite road ahmedabad, Gujarat, India</li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; 2026 Ramest Technolabs. All rights reserved. &nbsp;|&nbsp; Built with <i class="fa-solid fa-heart"
                    style="color:var(--first-color);"></i> in India</p>
        </div>
    </footer>`;

for (const file of files) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Use regex to match the old footer and replace it with the new layout
    const footerRegex = /<footer class="footer">[\s\S]*?<\/footer>/;

    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, newFooter);
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Updated footer in ${file}`);
    } else {
        console.log(`Footer not found in ${file}`);
    }
}

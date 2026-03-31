const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace Hero Section
const heroOld = /<section class="home section" id="home">[\s\S]*?<\/section>/;
const heroNew = `<section class="home section page-hero" id="home" style="padding-top: 10rem; padding-bottom: 6rem; position: relative; overflow: hidden; text-align: center;">
            <div class="container" style="position: relative; z-index: 10;">
                <div class="page-hero-badge" style="margin-bottom: 1.5rem; display: inline-block;">Results-Driven Technology Partner</div>
                <h1 class="page-hero-title" style="font-size: clamp(2.5rem, 5vw, 4rem); line-height: 1.1; margin-bottom: 1.5rem; max-width: 900px; margin-inline: auto;">
                    Sparking Digital <br>
                    <span class="gradient-text">Revolutions!</span>
                </h1>
                <p class="page-hero-desc" style="margin-inline: auto; margin-bottom: 2.5rem; max-width: 700px; font-size: 1.2rem; color: var(--text-color);">
                    We provide Custom Software Development, Mobile & Web Apps, and AI/ML Solutions tailored for your business growth.
                </p>
                <div class="home-buttons" style="justify-content: center; gap: 1.25rem; display: flex;">
                    <a href="contact.html" class="button button-primary" style="padding: 1.1rem 2.2rem; font-size: 1.1rem;">Schedule a Call <i class="fa-solid fa-arrow-right"></i></a>
                    <a href="services.html" class="button button-secondary" style="padding: 1.1rem 2.2rem; font-size: 1.1rem;">Explore Services</a>
                </div>
            </div>
            <!-- Background ambient glow -->
            <div class="glowing-circle" style="top: 50%; left: 50%; transform: translate(-50%, -50%); width: 600px; height: 600px; z-index: 0; opacity: 0.3; pointer-events: none; position: absolute;"></div>
        </section>`;

html = html.replace(heroOld, heroNew);

// Replace Stats Section
const statsOld = /<section class="stats-section">[\s\S]*?<\/section>/;
const statsNew = `<section class="stats-section" style="padding: 4rem 0; background: linear-gradient(180deg, transparent 0%, rgba(var(--hue), 60%, 55%, 0.05) 100%);">
            <div class="container stats-container" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; border-radius: 1rem; border: 1px solid var(--border-color); background: var(--container-color); padding: 3rem 2rem; justify-items: center; align-items: center;">
                <div class="stat-bar-item" style="text-align: center;">
                    <span class="stat-bar-number" style="font-size: 3rem; background: var(--text-gradient); -webkit-background-clip: text; color: transparent; font-weight: 700;">5+</span>
                    <span class="stat-bar-label" style="display: block; margin-top: 0.5rem; color: var(--text-color); font-weight: 500;">Years of Experience</span>
                </div>
                <div class="stat-bar-divider" style="width: 1px; height: 60px; background: var(--border-color);"></div>
                <div class="stat-bar-item" style="text-align: center;">
                    <span class="stat-bar-number" style="font-size: 3rem; background: var(--text-gradient); -webkit-background-clip: text; color: transparent; font-weight: 700;">100+</span>
                    <span class="stat-bar-label" style="display: block; margin-top: 0.5rem; color: var(--text-color); font-weight: 500;">Projects Delivered</span>
                </div>
                <div class="stat-bar-divider" style="width: 1px; height: 60px; background: var(--border-color);"></div>
                <div class="stat-bar-item" style="text-align: center;">
                    <span class="stat-bar-number" style="font-size: 3rem; background: var(--text-gradient); -webkit-background-clip: text; color: transparent; font-weight: 700;">50+</span>
                    <span class="stat-bar-label" style="display: block; margin-top: 0.5rem; color: var(--text-color); font-weight: 500;">Happy Clients</span>
                </div>
                <div class="stat-bar-divider" style="width: 1px; height: 60px; background: var(--border-color);"></div>
                <div class="stat-bar-item" style="text-align: center;">
                    <span class="stat-bar-number" style="font-size: 3rem; background: var(--text-gradient); -webkit-background-clip: text; color: transparent; font-weight: 700;">24/7</span>
                    <span class="stat-bar-label" style="display: block; margin-top: 0.5rem; color: var(--text-color); font-weight: 500;">Dedicated Support</span>
                </div>
            </div>
        </section>`;

html = html.replace(statsOld, statsNew);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully');

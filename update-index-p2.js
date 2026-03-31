const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Replace Services Section
const servicesOld = /<section class="section" id="services-preview">[\s\S]*?<\/section>/;
const servicesNew = `<section class="section" id="services-preview" style="background-color: transparent;">
            <div class="container">
                <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
                    <h2 class="section-title" style="font-size: 2.5rem; margin-bottom: 1rem;">What We Build</h2>
                    <p class="section-subtitle" style="font-size: 1.1rem; color: var(--text-color); max-width: 600px; margin: 0 auto;">End-to-end digital solutions tailored for real business impact</p>
                </div>
                <div class="services-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
                    
                    <div class="service-card" style="background: var(--container-color); border: 1px solid var(--border-color); padding: 2.5rem 2rem; border-radius: 1rem; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                        <div class="service-icon" style="font-size: 2.5rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-laptop-code"></i></div>
                        <h3 class="service-title" style="font-size: 1.5rem; margin-bottom: 1rem;">Custom Software Dev</h3>
                        <p class="service-description" style="color: var(--text-color); margin-bottom: 1.5rem; line-height: 1.6;">Tailor-made software solutions designed to meet your specific business requirements and overcome complex challenges.</p>
                        <a href="services.html" class="service-link" style="color: var(--first-color); font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem;">Learn More <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i></a>
                    </div>
                    
                    <div class="service-card" style="background: var(--container-color); border: 1px solid var(--border-color); padding: 2.5rem 2rem; border-radius: 1rem; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                        <div class="service-icon" style="font-size: 2.5rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-mobile-button"></i></div>
                        <h3 class="service-title" style="font-size: 1.5rem; margin-bottom: 1rem;">Mobile &amp; Web Apps</h3>
                        <p class="service-description" style="color: var(--text-color); margin-bottom: 1.5rem; line-height: 1.6;">Scalable and robust mobile and web applications that drive user engagement and fuel your business growth.</p>
                        <a href="services.html" class="service-link" style="color: var(--first-color); font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem;">Learn More <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i></a>
                    </div>
                    
                    <div class="service-card" style="background: var(--container-color); border: 1px solid var(--border-color); padding: 2.5rem 2rem; border-radius: 1rem; transition: transform 0.3s ease, box-shadow 0.3s ease;">
                        <div class="service-icon" style="font-size: 2.5rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-brain"></i></div>
                        <h3 class="service-title" style="font-size: 1.5rem; margin-bottom: 1rem;">AI/ML Solutions</h3>
                        <p class="service-description" style="color: var(--text-color); margin-bottom: 1.5rem; line-height: 1.6;">Leveraging modern AI and Machine Learning to automate processes and provide smart, actionable business insights.</p>
                        <a href="services.html" class="service-link" style="color: var(--first-color); font-weight: 500; display: inline-flex; align-items: center; gap: 0.5rem;">Learn More <i class="fa-solid fa-arrow-right" style="font-size: 0.8rem;"></i></a>
                    </div>
                    
                </div>
            </div>
        </section>`;

html = html.replace(servicesOld, servicesNew);

// Replace Why Choose Us Section
const whyOld = /<section class="section why-section">[\s\S]*?<\/section>/;
const whyNew = `<section class="section why-section" style="background: linear-gradient(180deg, rgba(var(--hue), 60%, 55%, 0.05) 0%, transparent 100%); padding-top: 6rem; padding-bottom: 6rem;">
            <div class="container">
                <div class="section-header" style="text-align: center; margin-bottom: 4rem;">
                    <h2 class="section-title" style="font-size: 2.5rem; margin-bottom: 1rem;">Why Choose Us</h2>
                    <p class="section-subtitle" style="font-size: 1.1rem; color: var(--text-color); max-width: 600px; margin: 0 auto;">What sets Ramest Technolabs apart from the rest</p>
                </div>
                <div class="why-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 2rem;">
                    
                    <div class="why-card" style="background: transparent; border: none; padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <div class="why-icon" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(var(--hue), 60%, 55%, 0.1); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-bolt"></i></div>
                        <h3 class="why-title" style="font-size: 1.3rem; margin-bottom: 1rem;">Fast Delivery</h3>
                        <p class="why-desc" style="color: var(--text-color); line-height: 1.6;">Agile sprints and CI/CD pipelines ensure your product ships on time, every time.</p>
                    </div>
                    
                    <div class="why-card" style="background: transparent; border: none; padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <div class="why-icon" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(var(--hue), 60%, 55%, 0.1); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-lock"></i></div>
                        <h3 class="why-title" style="font-size: 1.3rem; margin-bottom: 1rem;">Secure by Default</h3>
                        <p class="why-desc" style="color: var(--text-color); line-height: 1.6;">Security-first architecture and regular audits protect your data at every layer.</p>
                    </div>
                    
                    <div class="why-card" style="background: transparent; border: none; padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <div class="why-icon" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(var(--hue), 60%, 55%, 0.1); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-headset"></i></div>
                        <h3 class="why-title" style="font-size: 1.3rem; margin-bottom: 1rem;">24/7 Support</h3>
                        <p class="why-desc" style="color: var(--text-color); line-height: 1.6;">Our team is always on call — monitoring, maintaining, and improving your product.</p>
                    </div>
                    
                    <div class="why-card" style="background: transparent; border: none; padding: 2rem; text-align: center; display: flex; flex-direction: column; align-items: center;">
                        <div class="why-icon" style="width: 80px; height: 80px; border-radius: 50%; background: rgba(var(--hue), 60%, 55%, 0.1); display: flex; align-items: center; justify-content: center; font-size: 2rem; color: var(--first-color); margin-bottom: 1.5rem;"><i class="fa-solid fa-chart-line"></i></div>
                        <h3 class="why-title" style="font-size: 1.3rem; margin-bottom: 1rem;">Scalable Solutions</h3>
                        <p class="why-desc" style="color: var(--text-color); line-height: 1.6;">Built to grow with your business — from startup MVP to enterprise-scale platform.</p>
                    </div>
                    
                </div>
            </div>
        </section>`;

html = html.replace(whyOld, whyNew);

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully part 2');

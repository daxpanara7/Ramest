/* ==================== THEME TOGGLE ==================== */
const themeButton = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const darkTheme = 'dark-theme'; // This is actually handled by data-theme attribute, but we check preference
const iconMoon = 'fa-moon';
const iconSun = 'fa-sun';

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme');
const selectedIcon = localStorage.getItem('selected-icon');

// We obtain the current theme that the interface has by validating the dark-theme class
const getCurrentTheme = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
const getCurrentIcon = () => themeIcon.classList.contains(iconSun) ? iconSun : iconMoon;

// Validate if the user previously chose a topic
if (selectedTheme) {
    // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the dark
    document.documentElement.setAttribute('data-theme', selectedTheme === 'dark' ? 'dark' : 'light');
    themeIcon.classList[selectedTheme === 'dark' ? 'add' : 'remove'](iconSun);
    themeIcon.classList[selectedTheme === 'dark' ? 'remove' : 'add'](iconMoon);

    // Fix icon logic: if dark mode, screen shows SUN (to switch to light). If light mode, shows MOON.
    if (selectedTheme === 'dark') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
    }
} else {
    // Default to dark
    themeIcon.classList.add('fa-sun');
}

// Activate / deactivate the theme manually with the button
if (themeButton) {
    themeButton.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        let savedTheme = 'light';

        if (current === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            savedTheme = 'light';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            savedTheme = 'dark';
        }

        // We save the theme and the current icon that the user chose
        localStorage.setItem('selected-theme', savedTheme);
        localStorage.setItem('selected-icon', getCurrentIcon());
    });
}


/* ==================== MOBILE MENU ==================== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const header = document.getElementById('header');
const MOBILE_BREAKPOINT = 768;

function isMobile() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function placeNavMenu() {
    if (!navMenu || !header) return;

    const navContainer = header.querySelector('.nav-container');
    const navBtns = header.querySelector('.nav-btns');

    if (isMobile()) {
        if (navMenu.parentElement !== document.body) {
            document.body.appendChild(navMenu);
        }
        return;
    }

    if (navContainer && navBtns && navMenu.parentElement !== navContainer) {
        navContainer.insertBefore(navMenu, navBtns);
    }

    closeMobileMenu();
}

function openMobileMenu() {
    if (!navMenu) return;
    placeNavMenu();
    navMenu.classList.add('show-menu');
    document.body.classList.add('menu-open');
}

function closeMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('show-menu');
    document.body.classList.remove('menu-open');
    document.querySelectorAll('.has-dropdown.open').forEach(el => {
        el.classList.remove('open');
    });
}

function navigateFromMenu(link) {
    const href = link.getAttribute('href');
    if (!href || href === '#') return;
    closeMobileMenu();
    window.location.href = href;
}

function bindMobileMenuActions() {
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            if (!isMobile()) return;
            e.preventDefault();
            e.stopPropagation();
            openMobileMenu();
        });
    }

    if (navClose) {
        navClose.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            closeMobileMenu();
        });
    }

    document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
        link.addEventListener('click', (e) => {
            if (!isMobile() || !navMenu.classList.contains('show-menu')) return;
            e.preventDefault();
            e.stopPropagation();
            navigateFromMenu(link);
        });
    });

    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (!isMobile() || !navMenu.classList.contains('show-menu')) return;
            e.preventDefault();
            e.stopPropagation();
            navigateFromMenu(item);
        });
    });

    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            if (!isMobile() || !navMenu.classList.contains('show-menu')) return;
            e.preventDefault();
            e.stopPropagation();
            toggle.closest('.has-dropdown')?.classList.toggle('open');
        });
    });
}

document.addEventListener('click', (e) => {
    if (!isMobile()) return;

    if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(el => {
            el.classList.remove('open');
        });
    }
});

placeNavMenu();
bindMobileMenuActions();
window.addEventListener('resize', placeNavMenu);

/* ==================== SCROLL HEADER ==================== */
function scrollHeader() {
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scrolled class
    if (this.scrollY >= 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled')
}

window.addEventListener('scroll', scrollHeader)

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


/* ==================== MOBILE MENU ==================== */
const navMenu = document.getElementById('nav-menu'),
    navToggle = document.getElementById('nav-toggle'),
    navClose = document.getElementById('nav-close')

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu')
    })
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu')
    })
}

// Remove menu when clicking a link (but not dropdown toggles)
const navLink = document.querySelectorAll('.nav-link:not(.dropdown-toggle)')

function linkAction() {
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show-menu')
}
navLink.forEach(n => n.addEventListener('click', linkAction))


/* ==================== COMPANY DROPDOWN (MOBILE TOGGLE) ==================== */
const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        // On mobile, toggle the open class
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const parentLi = toggle.closest('.has-dropdown');
            parentLi.classList.toggle('open');
        }
    });
});

// Close dropdown when clicking outside (mobile/safari compat)
document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
        document.querySelectorAll('.has-dropdown.open').forEach(el => {
            el.classList.remove('open');
        });
    }
});
/* ==================== SCROLL HEADER ==================== */
function scrollHeader() {
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scrolled class
    if (this.scrollY >= 50) header.classList.add('scrolled');
    else header.classList.remove('scrolled')
}
/* ==================== LOGO MENU TOGGLE ==================== */
const logo = document.querySelector('.logo');
const header = document.getElementById('header');

if (logo) {
    // Logo always navigates to home — no menu toggle on click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.has-dropdown')) {
            document.querySelectorAll('.has-dropdown.open').forEach(el => {
                el.classList.remove('open');
            });
        }
        if (!header.contains(e.target)) {
            header.classList.remove('menu-open');
        }
    });
}
window.addEventListener('scroll', scrollHeader)

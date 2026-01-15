// Theme Toggle Functionality
const themeToggle = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

// Set dark mode as default
const savedTheme = localStorage.getItem('theme');
if (!savedTheme) {
    // First time visitor - set dark mode as default
    htmlElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
} else {
    // Use saved preference
    htmlElement.setAttribute('data-theme', savedTheme);
}

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    themeToggle.style.transform = 'scale(1.1) rotate(360deg)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Horizontal Scrolling Navigation
const panels = document.querySelectorAll('.panel');
const progressDots = document.querySelectorAll('.progress-dot');
const navLinks = document.querySelectorAll('.nav-link');
const sectionButtons = document.querySelectorAll('[data-section]');

// Scroll to section function
function scrollToSection(index) {
    const panel = panels[index];
    if (panel) {
        // Check if we're in mobile/vertical mode
        if (window.innerWidth <= 968) {
            panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // Horizontal scroll
            const scrollAmount = index * window.innerWidth;
            document.documentElement.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // Close mobile menu
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
}

// Add click handlers to all section navigation elements
sectionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const sectionIndex = parseInt(btn.getAttribute('data-section'));
        scrollToSection(sectionIndex);
    });
});

// Update progress dots based on scroll position
function updateProgressDots() {
    if (window.innerWidth <= 968) return; // Skip in mobile mode

    const scrollLeft = document.documentElement.scrollLeft || window.scrollX;
    const viewportWidth = window.innerWidth;
    const currentSection = Math.round(scrollLeft / viewportWidth);

    progressDots.forEach((dot, index) => {
        if (index === currentSection) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });

    // Update nav links
    navLinks.forEach((link, index) => {
        if (index === currentSection) {
            link.style.color = 'var(--color-accent)';
        } else {
            link.style.color = '';
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', updateProgressDots);

// Mouse wheel horizontal scrolling (for desktop)
document.addEventListener('wheel', (e) => {
    if (window.innerWidth <= 968) return; // Skip in mobile mode

    // Only handle vertical scroll and convert to horizontal
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        document.documentElement.scrollLeft += e.deltaY * 3;
    }
}, { passive: false });

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (window.innerWidth <= 968) return;

    const scrollLeft = document.documentElement.scrollLeft || window.scrollX;
    const currentSection = Math.round(scrollLeft / window.innerWidth);

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentSection < panels.length - 1) {
            scrollToSection(currentSection + 1);
        }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentSection > 0) {
            scrollToSection(currentSection - 1);
        }
    }
});

// Touch swipe support for horizontal scrolling
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    if (window.innerWidth <= 968) return;

    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
        const scrollLeft = document.documentElement.scrollLeft || window.scrollX;
        const currentSection = Math.round(scrollLeft / window.innerWidth);

        if (diff > 0 && currentSection < panels.length - 1) {
            // Swipe left - go to next section
            scrollToSection(currentSection + 1);
        } else if (diff < 0 && currentSection > 0) {
            // Swipe right - go to previous section
            scrollToSection(currentSection - 1);
        }
    }
}, { passive: true });

// Typing effect for hero title
const titles = ['Full Stack Developer', 'Django Expert', 'Python Developer', 'Backend Engineer'];
let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const heroTitle = document.querySelector('.hero-title');

function typeEffect() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        heroTitle.textContent = currentTitle.substring(0, charIndex - 1);
        charIndex--;
    } else {
        heroTitle.textContent = currentTitle.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && charIndex === currentTitle.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        typeSpeed = 500;
    }

    setTimeout(typeEffect, typeSpeed);
}

// Start typing effect after page load
setTimeout(typeEffect, 1500);

// Initialize
updateProgressDots();

// Console Easter Egg
console.log('%c👋 Hey there, fellow developer!', 'color: #818cf8; font-size: 20px; font-weight: bold;');
console.log('%cLooking at the source code? Nice!', 'color: #a5b4fc; font-size: 14px;');
console.log('%c📧 sangeethdevn@gmail.com', 'color: #98c379; font-size: 12px;');

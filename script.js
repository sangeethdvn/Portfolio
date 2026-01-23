// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
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

        // Animate the toggle button
        gsap.to(themeToggle, {
            rotation: 360,
            scale: 1.1,
            duration: 0.3,
            onComplete: () => {
                gsap.set(themeToggle, { rotation: 0, scale: 1 });
            }
        });
    });

    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // GSAP Horizontal Scroll Logic
    const panels = gsap.utils.toArray('.panel');
    const wrapper = document.querySelector('.horizontal-scroll-wrapper');
    const progressDots = document.querySelectorAll('.progress-dot');
    const navLinks = document.querySelectorAll('.nav-link');

    // We'll use a single timeline for the horizontal scroll
    // This makes it easy to scrub and pin
    const horizontalScroll = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none", // Important for scroll linking
        scrollTrigger: {
            trigger: wrapper,
            pin: true,
            scrub: 1, // Smooth scrubbing
            snap: 1 / (panels.length - 1), // Snap to sections
            end: () => "+=" + (panels.length - 1) * window.innerHeight * 2, // Scroll distance = 2 screen heights per panel
            onUpdate: (self) => {
                updateActiveState(self.progress);
            }
        }
    });

    // Function to update active state of dots and nav links
    function updateActiveState(progress) {
        // Calculate current section index (0 to panels.length - 1)
        // We use Math.round to find the closest integer index
        const totalSections = panels.length - 1;
        const currentSectionIndex = Math.round(progress * totalSections);

        // Update dots
        progressDots.forEach((dot, index) => {
            if (index === currentSectionIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });

        // Update nav links
        navLinks.forEach((link, index) => {
            if (index === currentSectionIndex) {
                link.style.color = 'var(--color-accent)';
            } else {
                link.style.color = '';
            }
        });
    }

    // Navigation Click Handling
    function scrollToSection(index) {
        // Calculate the scroll position based on the wrapper's width
        // The total scroll distance is wrapper.offsetWidth * (panels.length - 1)
        // So we want to scroll to: trigger.start + (totalDistance * (index / totalSections))

        const totalWidth = wrapper.offsetWidth * (panels.length - 1);
        const scrollAmount = (index / (panels.length - 1)) * totalWidth;

        // We need to get the scroll position relative to the document
        // ScrollTrigger calculates this for us
        const st = horizontalScroll.scrollTrigger;

        // GSAP's scroll logging might be tricky with pinning, so we calculate exact scroll y
        const targetY = st.start + scrollAmount;

        gsap.to(window, {
            scrollTo: targetY,
            duration: 1,
            ease: "power2.inOut"
        });

        // Close mobile menu if open
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    }

    // Add click listeners to nav links and buttons
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const index = parseInt(el.getAttribute('data-section'));
            scrollToSection(index);
        });
    });

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

    // Start typing effect
    setTimeout(typeEffect, 1500);

    // Console Easter Egg
    console.log('%c👋 Hey there, fellow developer!', 'color: #818cf8; font-size: 20px; font-weight: bold;');
    console.log('%cLooking at the source code? Nice!', 'color: #a5b4fc; font-size: 14px;');
    console.log('%c📧 sangeethdevn@gmail.com', 'color: #98c379; font-size: 12px;');
});

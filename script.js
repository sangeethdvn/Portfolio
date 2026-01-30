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

    // GSAP Responsive Scroll Logic
    const panels = gsap.utils.toArray('.panel');
    const wrapper = document.querySelector('.horizontal-scroll-wrapper');
    const progressDots = document.querySelectorAll('.progress-dot');
    const navLinks = document.querySelectorAll('.nav-link');
    let horizontalScrollTween; // To store the tween instance

    ScrollTrigger.matchMedia({
        // DESKTOP: Horizontal Scroll (> 968px)
        "(min-width: 969px)": function () {
            // Setup horizontal scroll
            horizontalScrollTween = gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: wrapper,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (panels.length - 1),
                    end: () => "+=" + (panels.length - 1) * window.innerHeight * 2,
                    onUpdate: (self) => {
                        updateActiveState(self.progress);
                    }
                }
            });
        },

        // MOBILE: Vertical Scroll (<= 968px)
        "(max-width: 968px)": function () {
            // Kill horizontal scroll if it exists (handled by matchMedia usually, but good for cleanup)
            if (horizontalScrollTween) {
                horizontalScrollTween.kill();
                gsap.set(panels, { clearProps: "all" });
                gsap.set(wrapper, { clearProps: "all" });
            }

            // Create triggers for each panel to update active state on vertical scroll
            panels.forEach((panel, i) => {
                ScrollTrigger.create({
                    trigger: panel,
                    start: "top center",
                    end: "bottom center",
                    onToggle: (self) => {
                        if (self.isActive) {
                            updateActiveState(i / (panels.length - 1));
                        }
                    }
                });
            });
        },

        // ALL: Common setup
        "all": function () {
            // Any common ScrollTrigger setup
        }
    });

    // Function to update active state of dots and nav links
    function updateActiveState(progress) {
        const totalSections = panels.length - 1;
        // In vertical mode, progress might not be linear 0-1 for the whole page depending on how we calculate it,
        // but for the updateActiveState function we expect a value that maps to the index.
        // Actually, let's simplify: pass the index directly if possible, or handle float.

        let currentSectionIndex = Math.round(progress * totalSections);

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
        const isMobile = window.innerWidth <= 968;

        if (isMobile) {
            // Vertical Scroll
            const targetPanel = panels[index];
            gsap.to(window, {
                scrollTo: { y: targetPanel, autoKill: false },
                duration: 1,
                ease: "power2.inOut"
            });
        } else {
            // Horizontal Scroll
            const totalWidth = wrapper.offsetWidth * (panels.length - 1);
            const scrollAmount = (index / (panels.length - 1)) * totalWidth;

            // Ensure scrollTrigger exists before accessing properties
            // We need to query the ScrollTrigger instance created inside matchMedia
            const st = ScrollTrigger.getAll().find(st => st.vars.trigger === wrapper && st.pin);

            if (st) {
                const targetY = st.start + scrollAmount;
                gsap.to(window, {
                    scrollTo: targetY,
                    duration: 1,
                    ease: "power2.inOut"
                });
            }
        }

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

    // ========================================
    // INTERACTIVE TERMINAL
    // ========================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const terminalBody = document.getElementById('terminal-body');

    // Section mapping for cd command
    const sections = {
        'home': 0,
        'about': 1,
        'experience': 2,
        'projects': 3,
        'skills': 4,
        'contact': 5
    };

    // Command history
    let commandHistory = [];
    let historyIndex = -1;

    // Available commands
    const commands = {
        help: () => {
            return `<span class="terminal-text">Available commands:</span>
<span class="terminal-text">  <span class="cmd">help</span>        - Show this help message</span>
<span class="terminal-text">  <span class="cmd">ls</span>          - List available sections</span>
<span class="terminal-text">  <span class="cmd">cd [section]</span> - Navigate to a section</span>
<span class="terminal-text">  <span class="cmd">whoami</span>      - About me</span>
<span class="terminal-text">  <span class="cmd">cat resume.pdf</span> - Open my resume</span>
<span class="terminal-text">  <span class="cmd">theme</span>       - Toggle dark/light mode</span>
<span class="terminal-text">  <span class="cmd">clear</span>       - Clear terminal</span>
<span class="terminal-text">  <span class="cmd">date</span>        - Show current date</span>
<span class="terminal-text">  <span class="cmd">echo [text]</span> - Echo back text</span>
<span class="terminal-text">  <span class="cmd">exit</span>        - Close the terminal/tab</span>`;
        },

        ls: () => {
            return `<span class="terminal-text">
<span class="success">home/</span>
<span class="success">about/</span>
<span class="success">experience/</span>
<span class="success">projects/</span>
<span class="success">skills/</span>
<span class="success">contact/</span>
resume.pdf</span>`;
        },

        cd: (args) => {
            const target = args[0]?.toLowerCase();

            if (!target || target === '~' || target === '/') {
                scrollToSection(0);
                return `<span class="terminal-text"><span class="success">→ Navigating to home...</span></span>`;
            }

            if (target === '..') {
                // Go to previous section
                const st = horizontalScroll.scrollTrigger;
                const currentIndex = Math.round(st.progress * (panels.length - 1));
                const newIndex = Math.max(0, currentIndex - 1);
                scrollToSection(newIndex);
                return `<span class="terminal-text"><span class="success">→ Going back...</span></span>`;
            }

            // Check if target exists in sections
            const sectionIndex = sections[target.replace('/', '')];
            if (sectionIndex !== undefined) {
                scrollToSection(sectionIndex);
                return `<span class="terminal-text"><span class="success">→ Navigating to ${target}...</span></span>`;
            }

            return `<span class="terminal-text"><span class="error">bash: cd: ${target}: No such directory</span></span>`;
        },

        whoami: () => {
            return `<span class="terminal-text">
<span class="highlight">P S Sangeeth Devan</span>
Full Stack Developer | Python | Django

📍 Kerala, India
📧 sangeethdevn@gmail.com
🔗 github.com/sangeethdevn</span>`;
        },

        cat: (args) => {
            const file = args.join(' ').toLowerCase();
            if (file === 'resume.pdf' || file === 'resume') {
                window.open('https://drive.google.com/file/d/1hGDN_pu26KIXjJqXoKlyDN_E1D_UpNFR/view?usp=sharing', '_blank');
                return `<span class="terminal-text"><span class="success">Opening resume.pdf in new tab...</span></span>`;
            }
            return `<span class="terminal-text"><span class="error">cat: ${file || 'no file specified'}: No such file</span></span>`;
        },

        theme: () => {
            themeToggle.click();
            const newTheme = document.documentElement.getAttribute('data-theme');
            return `<span class="terminal-text"><span class="success">Theme switched to ${newTheme} mode</span></span>`;
        },

        clear: () => {
            terminalOutput.innerHTML = '';
            return null; // No output for clear
        },

        date: () => {
            const now = new Date();
            return `<span class="terminal-text">${now.toString()}</span>`;
        },

        echo: (args) => {
            return `<span class="terminal-text">${args.join(' ') || ''}</span>`;
        },

        sudo: (args) => {
            const cmd = args.join(' ').toLowerCase();
            if (cmd.includes('make') && cmd.includes('sandwich')) {
                return `<span class="terminal-text"><span class="error">Permission denied: Go make it yourself! 🥪</span></span>`;
            }
            if (cmd.includes('rm') && cmd.includes('-rf')) {
                return `<span class="terminal-text"><span class="error">Nice try! 😏</span></span>`;
            }
            return `<span class="terminal-text"><span class="error">[sudo] password for visitor: Access denied</span></span>`;
        },

        pwd: () => {
            return `<span class="terminal-text">/home/visitor/sangeeth-portfolio</span>`;
        },

        exit: () => {
            // First try to close
            const win = window.open('', '_self');
            win.close();

            // Fallback: Simulate shutdown
            setTimeout(() => {
                terminalOutput.innerHTML += `<div class="terminal-line"><span class="terminal-text"><span class="error">Alert: Browser security prevented tab close. Initiating visual shutdown...</span></span></div>`;

                // Visual shutdown sequence
                setTimeout(() => {
                    terminalBody.style.transition = 'opacity 1s ease';
                    terminalBody.style.opacity = '0';
                    setTimeout(() => {
                        terminalBody.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#333;font-family:monospace;">[SESSION TERMINATED]</div>';
                        terminalBody.style.opacity = '1';
                    }, 1000);
                }, 1000);
            }, 500);

            return `<span class="terminal-text"><span class="success">👋 Goodbye! Closing session...</span></span>`;
        },

        neofetch: () => {
            return `<span class="terminal-text">
<span class="highlight">       ____  ____  </span>   visitor@portfolio
<span class="highlight">      / ___||  _ \\ </span>  ----------------
<span class="highlight">      \\___ \\| | | |</span>   OS: Portfolio.js v1.0
<span class="highlight">       ___) | |_| |</span>   Host: GitHub Pages
<span class="highlight">      |____/|____/ </span>   Uptime: Always online
                       Shell: bash 5.0
                       Theme: ${document.documentElement.getAttribute('data-theme')}
                       Stack: Python, Django, JS</span>`;
        },

        hire: () => {
            scrollToSection(5);
            return `<span class="terminal-text"><span class="success">🎉 Great choice! Taking you to contact...</span></span>`;
        },

        close: () => {
            // Try to close the tab - only works if opened via JS
            setTimeout(() => {
                window.close();
            }, 500);
            return `<span class="terminal-text"><span class="success">👋 Goodbye! Closing tab...</span>
<span class="terminal-text">(If this doesn't work, your browser blocked it for security)</span></span>`;
        },

        quit: () => {
            return commands.close();
        }
    };

    // Process command
    function processCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) return null;

        const parts = trimmed.split(' ');
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Add to history
        commandHistory.push(trimmed);
        historyIndex = commandHistory.length;

        // Check if command exists
        if (commands[cmd]) {
            return commands[cmd](args);
        }

        // Unknown command
        return `<span class="terminal-text"><span class="error">bash: ${cmd}: command not found</span></span>
<span class="terminal-text">Type <span class="cmd">help</span> for available commands.</span>`;
    }

    // Add output line to terminal
    function addOutput(command, result) {
        // Add the command line
        const cmdLine = document.createElement('div');
        cmdLine.className = 'terminal-line';
        cmdLine.innerHTML = `<span class="terminal-prompt">visitor@portfolio:~$</span><span class="terminal-text">${command}</span>`;
        terminalOutput.appendChild(cmdLine);

        // Add the result if any
        if (result) {
            const resultLine = document.createElement('div');
            resultLine.className = 'terminal-line output';
            resultLine.innerHTML = result;
            terminalOutput.appendChild(resultLine);
        }

        // Scroll to bottom
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Handle input
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const input = terminalInput.value;
                const result = processCommand(input);

                if (input.trim().toLowerCase() !== 'clear') {
                    addOutput(input, result);
                } else {
                    processCommand('clear');
                }

                terminalInput.value = '';
            }

            // Command history navigation
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = commandHistory[historyIndex] || '';
                }
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < commandHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = commandHistory[historyIndex] || '';
                } else {
                    historyIndex = commandHistory.length;
                    terminalInput.value = '';
                }
            }
        });

        // Focus terminal on click
        terminalBody?.addEventListener('click', () => {
            terminalInput.focus();
        });
    }

    // ========================================
    // AMBIENT STARFIELD BACKGROUND (Dark Mode only)
    // With Shooting Stars / Meteor Showers
    // ========================================

    const canvas = document.getElementById('starfield-canvas');
    if (!canvas) return; // Safety check

    const ctx = canvas.getContext('2d');
    let stars = [];
    let shootingStars = [];
    let animationId = null;
    let isRunning = false;

    // Configuration - Easy to tweak
    const CONFIG = {
        // Background stars
        starCount: 100,            // Number of background stars
        minSize: 0.5,              // Minimum star size
        maxSize: 2,                // Maximum star size
        minSpeed: 0.05,            // Minimum movement speed
        maxSpeed: 0.2,             // Maximum movement speed
        twinkleChance: 0.005,      // Probability of twinkling per frame
        baseOpacity: 0.3,          // Base opacity (subtle)
        maxOpacity: 0.7,           // Max opacity when twinkling

        // Shooting stars
        shootingStarChance: 0.02,  // Probability per frame (frequent showers)
        shootingStarSpeed: 8,      // Speed of shooting stars
        shootingStarLength: 80,    // Trail length
        shootingStarSize: 2,       // Head size
        maxShootingStars: 3        // Max simultaneous shooting stars
    };

    // Background Star class
    class Star {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = CONFIG.minSize + Math.random() * (CONFIG.maxSize - CONFIG.minSize);
            this.baseOpacity = CONFIG.baseOpacity + Math.random() * 0.2;
            this.opacity = this.baseOpacity;
            this.targetOpacity = this.baseOpacity;

            // Velocity for slow floating
            const angle = Math.random() * Math.PI * 2;
            const speed = CONFIG.minSpeed + Math.random() * (CONFIG.maxSpeed - CONFIG.minSpeed);
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
        }

        update() {
            // Move particle
            this.x += this.vx;
            this.y += this.vy;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;

            // Twinkling effect (subtle)
            if (Math.random() < CONFIG.twinkleChance) {
                this.targetOpacity = this.baseOpacity + Math.random() * (CONFIG.maxOpacity - this.baseOpacity);
            } else if (Math.random() < CONFIG.twinkleChance * 2) {
                this.targetOpacity = this.baseOpacity;
            }

            // Smooth opacity transition
            this.opacity += (this.targetOpacity - this.opacity) * 0.05;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Shooting Star class with trail
    class ShootingStar {
        constructor() {
            this.reset();
        }

        reset() {
            // Start from random edge
            const side = Math.floor(Math.random() * 2); // 0: top, 1: right

            if (side === 0) {
                // Start from top, move diagonally down-right
                this.x = Math.random() * canvas.width;
                this.y = -50;
                this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.5; // ~45 degrees with variance
            } else {
                // Start from right, move diagonally down-left
                this.x = canvas.width + 50;
                this.y = Math.random() * canvas.height * 0.5; // Top half
                this.angle = Math.PI * 3 / 4 + (Math.random() - 0.5) * 0.5; // ~135 degrees
            }

            this.speed = CONFIG.shootingStarSpeed + Math.random() * 4;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;

            this.size = CONFIG.shootingStarSize;
            this.trailLength = CONFIG.shootingStarLength;
            this.opacity = 0;
            this.targetOpacity = 1;
            this.fadeIn = true;
            this.dead = false;
        }

        update() {
            // Move
            this.x += this.vx;
            this.y += this.vy;

            // Fade in/out effect
            if (this.fadeIn) {
                this.opacity += 0.1;
                if (this.opacity >= 1) {
                    this.opacity = 1;
                    this.fadeIn = false;
                }
            }

            // Check if off-screen
            if (this.x < -100 || this.x > canvas.width + 100 ||
                this.y < -100 || this.y > canvas.height + 100) {
                this.dead = true;
            }
        }

        draw() {
            if (this.opacity <= 0) return;

            // Calculate trail end point
            const trailX = this.x - this.vx * (this.trailLength / this.speed);
            const trailY = this.y - this.vy * (this.trailLength / this.speed);

            // Draw glowing trail with gradient
            const gradient = ctx.createLinearGradient(this.x, this.y, trailX, trailY);
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(0.3, `rgba(200, 220, 255, ${this.opacity * 0.6})`);
            gradient.addColorStop(0.7, `rgba(150, 180, 255, ${this.opacity * 0.3})`);
            gradient.addColorStop(1, `rgba(100, 150, 255, 0)`);

            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(trailX, trailY);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = this.size;
            ctx.lineCap = 'round';
            ctx.stroke();

            // Draw bright head with glow
            const headGradient = ctx.createRadialGradient(
                this.x, this.y, 0,
                this.x, this.y, this.size * 3
            );
            headGradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            headGradient.addColorStop(0.4, `rgba(220, 240, 255, ${this.opacity * 0.6})`);
            headGradient.addColorStop(1, `rgba(180, 200, 255, 0)`);

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fillStyle = headGradient;
            ctx.fill();

            // Draw bright core
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Initialize particles
    function initStarfield() {
        stars = [];
        for (let i = 0; i < CONFIG.starCount; i++) {
            stars.push(new Star());
        }
        shootingStars = [];
    }

    // Spawn shooting star
    function spawnShootingStar() {
        if (shootingStars.length < CONFIG.maxShootingStars &&
            Math.random() < CONFIG.shootingStarChance) {
            shootingStars.push(new ShootingStar());
        }
    }

    // Resize canvas to match window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Reinitialize particles on resize
        if (isRunning) {
            initStarfield();
        }
    }

    // Animation loop
    function animate() {
        if (!isRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw background stars (behind shooting stars)
        stars.forEach(star => {
            star.update();
            star.draw();
        });

        // Spawn shooting stars
        spawnShootingStar();

        // Update and draw shooting stars
        shootingStars.forEach((shootingStar, index) => {
            shootingStar.update();
            shootingStar.draw();

            // Remove dead shooting stars
            if (shootingStar.dead) {
                shootingStars.splice(index, 1);
            }
        });

        animationId = requestAnimationFrame(animate);
    }

    // Start starfield
    function startStarfield() {
        if (isRunning) return;
        isRunning = true;
        resizeCanvas();
        initStarfield();
        animate();
    }

    // Stop starfield
    function stopStarfield() {
        isRunning = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Check theme and start/stop accordingly
    function updateStarfieldForTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            startStarfield();
        } else {
            stopStarfield();
        }
    }

    // Initialize on load
    updateStarfieldForTheme();

    // Listen for theme changes
    const themeObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                updateStarfieldForTheme();
            }
        });
    });

    themeObserver.observe(htmlElement, {
        attributes: true,
        attributeFilter: ['data-theme']
    });

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Cleanup on page unload (good practice)
    window.addEventListener('beforeunload', () => {
        stopStarfield();
        themeObserver.disconnect();
    });
});

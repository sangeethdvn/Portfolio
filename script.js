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
});

document.addEventListener('DOMContentLoaded', () => {

    // --- THEME SWITCHER ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        themeIcon.classList.toggle('fa-sun', theme === 'dark');
        themeIcon.classList.toggle('fa-moon', theme === 'bright');
        localStorage.setItem('theme', theme);
    };

    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.getAttribute('data-theme') === 'bright' ? 'dark' : 'bright';
        applyTheme(newTheme);
    });

    // Load saved theme or default to dark mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'dark');
    applyTheme(initialTheme);

    
    // --- SMOOTH SCROLLING FOR NAV LINKS (NEWLY ADDED) ---
    document.querySelectorAll('.nav-link[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // 1. Prevent the default jump behavior
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 2. Perform the smooth scroll
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Aligns the top of the element to the top of the viewport
                });
            }
        });
    });


    // --- FADE-IN ANIMATION FOR SECTIONS ---
    const animatedSections = document.querySelectorAll('.animated-section');
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15 // Trigger when 15% of the section is visible
    });

    animatedSections.forEach(section => {
        fadeInObserver.observe(section);
    });


    // --- ACTIVE NAV LINK TRACKING FOR TAB INDICATOR ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.main-nav a.nav-link');

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Remove 'active' from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add 'active' to the corresponding link
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, {
        rootMargin: '-50% 0px -50% 0px' // Makes the section in the middle of the viewport active
    });

    sections.forEach(section => {
        activeNavObserver.observe(section);
    });


    // --- PARTICLES.JS INITIALIZATION ---
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 50,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#4b5563"
                },
                "shape": {
                    "type": "circle"
                },
                "opacity": {
                    "value": 0.3,
                    "random": true
                },
                "size": {
                    "value": 3,
                    "random": true
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#374151",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out"
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": false
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    }
                }
            },
            "retina_detect": true
        });
    }
});
/* Portfolio interactions.
 *
 * Every behaviour below is bound to markup that actually exists in index.html.
 * Two subsystems used to live here and no longer do: a horizontal-carousel
 * timeline (.milestone / .timeline-track / #detail-*) and a project-card filter
 * (.filter-btn / .project-card). Both belonged to earlier layouts; the carousel
 * code also threw a TypeError on every page load, which silently killed the
 * listeners registered after it.
 */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

/* Respect the user's motion preference for programmatic scrolling. */
const scrollBehavior = () => (prefersReducedMotion.matches ? 'auto' : 'smooth');

// ========== Mobile Navigation Toggle ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger && navMenu) {
    const setMenu = (open) => {
        hamburger.classList.toggle('active', open);
        navMenu.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    };

    hamburger.addEventListener('click', () => {
        setMenu(!navMenu.classList.contains('active'));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    // Escape closes the menu and returns focus to the toggle.
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            setMenu(false);
            hamburger.focus();
        }
    });
}

// ========== Hero Grid Cell Highlight ==========
const hero = document.querySelector('.hero');
if (hero && !prefersReducedMotion.matches) {
    const CELL = 40; // must match the hero grid background-size
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    hero.appendChild(cell);

    let ticking = false;
    let lastX = 0;
    let lastY = 0;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        lastX = e.clientX - rect.left;
        lastY = e.clientY - rect.top;
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(() => {
                const col = Math.floor(lastX / CELL);
                const row = Math.floor(lastY / CELL);
                cell.style.transform = `translate(${col * CELL}px, ${row * CELL}px)`;
                cell.style.opacity = '1';
                ticking = false;
            });
        }
    });

    hero.addEventListener('mouseleave', () => {
        cell.style.opacity = '0';
    });
}

// ========== Navbar Shadow + Scroll-Spy ==========
const navbar = document.getElementById('navbar');
const sections = Array.from(document.querySelectorAll('section[id]'));
const scrollTopBtn = document.querySelector('.scroll-top-btn');

/* One scroll listener, rAF-throttled, driving all three scroll-dependent
 * behaviours. Previously these were three separate unthrottled listeners. */
let scrollQueued = false;

function onScroll() {
    const y = window.scrollY;

    if (navbar) {
        navbar.classList.toggle('scrolled', y > 50);
    }

    if (scrollTopBtn) {
        scrollTopBtn.classList.toggle('visible', y > 500);
    }

    let current = '';
    for (const section of sections) {
        if (y >= section.offsetTop - 100) {
            current = section.id;
        }
    }
    navLinks.forEach((link) => {
        const isActive = current !== '' && link.getAttribute('href') === `#${current}`;
        link.classList.toggle('active', isActive);
        if (isActive) {
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

window.addEventListener('scroll', () => {
    if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(() => {
            onScroll();
            scrollQueued = false;
        });
    }
}, { passive: true });

onScroll();

// ========== Typewriter Effect ==========
const typewriter = document.getElementById('typewriter');
const phrases = [
    'AI Engineering',
    'Generative AI',
    'LLM Systems',
    'Applied AI',
    'Research Intern at CEA List — LASTI Team'
];

if (typewriter) {
    if (prefersReducedMotion.matches) {
        // No animation: show the primary positioning statically.
        typewriter.textContent = phrases[0];
    } else {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const phrase = phrases[phraseIndex];
            let delay;

            if (isDeleting) {
                charIndex -= 1;
                delay = 50;
            } else {
                charIndex += 1;
                delay = 100;
            }
            typewriter.textContent = phrase.substring(0, charIndex);

            if (!isDeleting && charIndex === phrase.length) {
                delay = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                delay = 500;
            }

            setTimeout(type, delay);
        };

        setTimeout(type, 1000);
    }
}

// ========== Smooth Anchor Scrolling ==========
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
        // Keep the URL and focus in sync for keyboard/screen-reader users.
        history.replaceState(null, '', href);
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    });
});

// ========== Reveal-on-Scroll ==========
const revealTargets = document.querySelectorAll(
    '.about-content, .contact-content, .ach-card, .cert-card, .timeline-item, .skill-row'
);

if (prefersReducedMotion.matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach((el) => el.classList.add('fade-in'));
} else {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -100px 0px' });

    revealTargets.forEach((el) => observer.observe(el));
}

// ========== Scroll to Top ==========
if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: scrollBehavior() });
    });
}

// ========== Dynamic Year in Footer ==========
const yearElement = document.querySelector('.footer-year');
if (yearElement) {
    yearElement.textContent = String(new Date().getFullYear());
}

// ========== Show More / Less on timeline items ==========
function toggleDetails(button) {
    const details = button.nextElementSibling;
    if (!details) return;

    const isOpen = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!isOpen));
    details.hidden = isOpen;
    button.textContent = isOpen ? 'Show More ▼' : 'Show Less ▲';
}

// Invoked from inline onclick handlers in index.html.
window.toggleDetails = toggleDetails;

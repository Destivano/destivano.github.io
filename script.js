// ========== Mobile Navigation Toggle ==========
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ============================================
// Timeline Navigation & Detail Panel Logic
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Select all milestones in DOM order (left to right = newest to oldest)
    const milestones = Array.from(document.querySelectorAll('.milestone'));
    const track = document.querySelector('.timeline-track');
    const leftBtn = document.querySelector('.nav-btn.left');
    const rightBtn = document.querySelector('.nav-btn.right');
    
    let activeIndex = 0;

    // ============================================
    // Update Detail Panel Function
    // ============================================
    function updateDetailPanel(milestone) {
        // Read data attributes
        const title = milestone.getAttribute('data-title');
        const company = milestone.getAttribute('data-company');
        const role = milestone.getAttribute('data-role');
        const date = milestone.getAttribute('data-date');
        const description = milestone.getAttribute('data-description');
        const tags = milestone.getAttribute('data-tags');
        const link = milestone.getAttribute('data-link');

        // Update detail panel elements
        document.getElementById('detail-title').textContent = title;
        document.getElementById('detail-company').textContent = company;
        document.getElementById('detail-role').textContent = role;
        document.getElementById('detail-date').textContent = date;
        document.getElementById('detail-description').innerHTML = description;

        // Create tags
        const tagsContainer = document.getElementById('detail-tags');
        tagsContainer.innerHTML = '';
        if (tags) {
            tags.split(',').forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = 'tag';
                tagSpan.textContent = tag.trim();
                tagsContainer.appendChild(tagSpan);
            });
        }

        // Update link
        const linkElement = document.getElementById('detail-link');
        if (link && link.trim() !== '') {
            linkElement.href = link;
            linkElement.style.display = 'inline-flex';
            
            // Set link text based on URL
            if (link.includes('linkedin.com')) {
                linkElement.textContent = 'View LinkedIn Post';
            } else {
                linkElement.textContent = 'View Project';
            }
        } else {
            linkElement.style.display = 'none';
        }

        // Update active state
        milestones.forEach(m => m.classList.remove('active'));
        milestone.classList.add('active');
    }

    // ============================================
    // Smooth Scroll to Center Milestone
    // ============================================
    function scrollToMilestone(milestone) {
        const rect = milestone.getBoundingClientRect();
        const trackRect = track.getBoundingClientRect();
        const offset = rect.left - trackRect.left + rect.width / 2 - trackRect.width / 2;
        track.scrollBy({ left: offset, behavior: 'smooth' });
    }

    // ============================================
    // Milestone Click Handler
    // ============================================
    milestones.forEach((milestone, index) => {
        milestone.addEventListener('click', () => {
            activeIndex = index;
            updateDetailPanel(milestone);
            scrollToMilestone(milestone);
        });
    });

    // ============================================
    // Left Button (Go to Older Project → Right)
    // ============================================
    leftBtn.addEventListener('click', () => {
        if (activeIndex < milestones.length - 1) {
            activeIndex++;
            milestones[activeIndex].click();
        }
    });

    // ============================================
    // Right Button (Go to Newer Project ← Left)
    // ============================================
    rightBtn.addEventListener('click', () => {
        if (activeIndex > 0) {
            activeIndex--;
            milestones[activeIndex].click();
        }
    });

    // ============================================
    // Initial Load: Display First Milestone
    // ============================================
    if (milestones.length > 0) {
        updateDetailPanel(milestones[0]);
        setTimeout(() => {
            scrollToMilestone(milestones[0]);
        }, 100);
    }
});

// ========== Typewriter Effect ==========




// ========== Active Navigation on Scroll ==========
const sections = document.querySelectorAll('section');
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    // Add shadow to navbar on scroll
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Highlight active nav link
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ========== Typewriter Effect ==========
const typewriter = document.getElementById('typewriter');
const phrases = [
    'AI Engineering Student',
    'Passionate about Research and Innovation',
    'Currently working on LVLMs, VLAs and Embodied AI',
    'Under the supervision of Mr. Gianni FRANCHI'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function type() {
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriter.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typewriter.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        typingSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }

    setTimeout(type, typingSpeed);
}

// Start typewriter effect
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});

// ========== Project Filtering ==========
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');

        const filterValue = button.getAttribute('data-filter');

        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filterValue === 'all' || category === filterValue) {
                card.classList.remove('hidden');
                card.style.display = 'block';
                // Add animation
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// ========== Smooth Scroll ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== Scroll Animations ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-card, .project-card, .about-content, .contact-content').forEach(el => {
    observer.observe(el);
});

// ========== Scroll to Top Button (Optional Enhancement) ==========
// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    display: none;
    z-index: 999;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.style.display = 'block';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', () => {
    scrollTopBtn.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseleave', () => {
    scrollTopBtn.style.transform = 'scale(1)';
});

// ========== Dynamic Year in Footer ==========
const yearElement = document.querySelector('.footer p');
if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
}

// ========== Toggle Details Function ==========
function toggleDetails(button) {
    const detailsDiv = button.nextElementSibling;
    const isHidden = detailsDiv.style.display === 'none' || detailsDiv.style.display === '';
    
    if (isHidden) {
        detailsDiv.style.display = 'block';
        button.textContent = 'Show Less ▲';
        button.style.background = 'linear-gradient(135deg, #764ba2, #667eea)';
    } else {
        detailsDiv.style.display = 'none';
        button.textContent = 'Show More ▼';
        button.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    }
}

// Make function globally available
window.toggleDetails = toggleDetails;

// ========== Console Message ==========
console.log('%c👋 Hello Developer!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cThanks for checking out the code!', 'color: #764ba2; font-size: 14px;');
console.log('%cFeel free to reach out if you have any questions.', 'color: #718096; font-size: 12px;');

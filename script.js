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
    'Deep Learning Researcher',
    'Trustworthy AI Enthusiast',
    'Future PhD Candidate'
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

// ========== Contact Form Handling ==========
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;

    // Simulate form submission (replace with actual backend logic)
    formStatus.textContent = 'Sending message...';
    formStatus.className = '';

    // Simulate API call
    setTimeout(() => {
        // Success
        formStatus.textContent = 'Message sent successfully! I\'ll get back to you soon.';
        formStatus.className = 'success';
        contactForm.reset();

        // Clear status after 5 seconds
        setTimeout(() => {
            formStatus.textContent = '';
            formStatus.className = '';
        }, 5000);

        // For actual implementation, you would use fetch or XMLHttpRequest
        // Example:
        // fetch('your-api-endpoint', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, subject, message })
        // })
        // .then(response => response.json())
        // .then(data => {
        //     formStatus.textContent = 'Message sent successfully!';
        //     formStatus.className = 'success';
        //     contactForm.reset();
        // })
        // .catch(error => {
        //     formStatus.textContent = 'Error sending message. Please try again.';
        //     formStatus.className = 'error';
        // });
    }, 1500);
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
    
    if (detailsDiv.style.display === 'none' || detailsDiv.style.display === '') {
        detailsDiv.style.display = 'block';
        button.textContent = 'Show Less ▲';
        // Add smooth reveal animation
        detailsDiv.style.animation = 'fadeIn 0.3s ease';
    } else {
        detailsDiv.style.display = 'none';
        button.textContent = 'Show More ▼';
    }
}

// ========== Console Message ==========
console.log('%c👋 Hello Developer!', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cThanks for checking out the code!', 'color: #764ba2; font-size: 14px;');
console.log('%cFeel free to reach out if you have any questions.', 'color: #718096; font-size: 12px;');

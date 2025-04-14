document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const backToTopButton = document.getElementById('backToTop');
    const contactForm = document.getElementById('contactForm');
    const downloadResume = document.getElementById('downloadResume');
    const navLinksAll = document.querySelectorAll('.nav-links a');
    
    // 1. Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // 2. Mobile navigation toggle
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Toggle body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    hamburger.addEventListener('click', toggleMobileMenu);

    // Close mobile menu when clicking a link
    navLinksAll.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // 3. Dark mode toggle
    function initDarkMode() {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        const currentTheme = localStorage.getItem('theme');
        
        // Apply saved preference or system preference
        if (currentTheme === 'dark' || (!currentTheme && prefersDarkScheme.matches)) {
            document.body.setAttribute('data-theme', 'dark');
            darkModeToggle.checked = true;
        }
        
        // Listen for system preference changes
        prefersDarkScheme.addListener(e => {
            if (!localStorage.getItem('theme')) {
                document.body.setAttribute('data-theme', e.matches ? 'dark' : '');
                darkModeToggle.checked = e.matches;
            }
        });
    }

    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        }
    });

    // 4. Smooth scrolling for anchor links
    function smoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = 80; // Height of fixed navbar
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // 5. Scroll to top button
    function handleScroll() {
        if (window.pageYOffset > 300) {
            backToTopButton.style.display = 'flex';
            backToTopButton.setAttribute('aria-expanded', 'true');
        } else {
            backToTopButton.style.display = 'none';
            backToTopButton.setAttribute('aria-expanded', 'false');
        }
    }

    backToTopButton.addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        // Move focus to top of page for accessibility
        document.querySelector('header').setAttribute('tabindex', '-1');
        document.querySelector('header').focus();
    });

    // 6. Form validation
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            let isValid = true;
            
            // Reset error states
            [name, email, message].forEach(field => {
                field.classList.remove('error');
                const errorElement = document.getElementById(`${field.id}Error`);
                if (errorElement) errorElement.remove();
            });
            
            // Validate name
            if (!name.value.trim()) {
                showError(name, 'Name is required');
                isValid = false;
            }
            
            // Validate email
            if (!email.value.trim()) {
                showError(email, 'Email is required');
                isValid = false;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate message
            if (!message.value.trim()) {
                showError(message, 'Message is required');
                isValid = false;
            }
            
            if (isValid) {
                // Here you would typically send the form data to a server
                // For now, we'll just show a success message
                showSuccessMessage();
                this.reset();
            }
        });
    }

    function showError(field, message) {
        field.classList.add('error');
        const errorElement = document.createElement('div');
        errorElement.id = `${field.id}Error`;
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        field.parentNode.insertBefore(errorElement, field.nextSibling);
    }

    function showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for your message! I will get back to you soon.';
        successMessage.setAttribute('role', 'alert');
        
        const formHeader = contactForm.querySelector('h3') || contactForm.querySelector('h2');
        if (formHeader) {
            contactForm.insertBefore(successMessage, formHeader.nextSibling);
        } else {
            contactForm.prepend(successMessage);
        }
        
        // Remove message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    }

    // 7. Download resume button
    if (downloadResume) {
        downloadResume.addEventListener('click', function(e) {
            e.preventDefault();
            // In a real implementation, this would download a PDF file
            // For now, we'll simulate it with a confirmation
            const confirmation = confirm('Would you like to download my resume?');
            if (confirmation) {
                // Simulate download (in real implementation, use window.location.href or fetch)
                console.log('Resume download started');
                // window.location.href = 'path/to/resume.pdf';
            }
        });
    }

    // 8. Initialize functions
    function init() {
        initDarkMode();
        smoothScroll();
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Run once on load to check initial position
    }

    init();
});
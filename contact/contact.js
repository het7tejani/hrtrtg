document.addEventListener('DOMContentLoaded', function () {
    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Simple validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value.trim();
            const notRobot = document.getElementById('not-robot').checked;

            if (!name || !email || !service || !message || !notRobot) {
                alert('Please fill in all required fields');
                return;
            }

            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Sent!';

                // Reset form after 2 seconds
                setTimeout(() => {
                    contactForm.reset();
                    submitBtn.innerHTML = '<span>Send Message</span><i class="fas fa-paper-plane"></i>';
                    submitBtn.disabled = false;

                    // Reset labels
                    document.querySelectorAll('.form-group label').forEach(label => {
                        label.style.top = '10px';
                        label.style.fontSize = '1rem';
                        label.style.color = 'var(--gray)';
                    });
                }, 2000);
            }, 1500);
        });
    }

    // Input focus effects
    const formGroups = document.querySelectorAll('.form-group');

    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea, select');
        const label = group.querySelector('label');

        input.addEventListener('focus', () => {
            label.style.top = '-15px';
            label.style.fontSize = '0.8rem';
            label.style.color = 'var(--primary)';
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                label.style.top = '10px';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--gray)';
            }
        });
    });

    // Animate elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const animationPoint = windowHeight * 0.85;

            if (elementPosition < animationPoint) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // Run animation on load
    animateOnScroll();

    // Run animation on scroll
    window.addEventListener('scroll', animateOnScroll);
});


// ------------------------------------database handling------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    // Display any form errors from session
    if (typeof formErrors !== 'undefined' && formErrors.length > 0) {
        const errorContainer = document.createElement('div');
        errorContainer.className = 'form-errors';
        errorContainer.style.color = 'red';
        errorContainer.style.marginBottom = '20px';
        
        formErrors.forEach(error => {
            const errorElement = document.createElement('p');
            errorElement.textContent = error;
            errorContainer.appendChild(errorElement);
        });
        
        const form = document.querySelector('.contact-form');
        form.insertBefore(errorContainer, form.firstChild);
    }
    
    // Pre-fill form data if available
    if (typeof formData !== 'undefined') {
        for (const field in formData) {
            const input = document.querySelector(`[name="${field}"]`);
            if (input) {
                input.value = formData[field];
            }
        }
    }
});
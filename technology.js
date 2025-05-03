

// --------------------------------------------------------
// horizontal four container 
// --------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    // Animate hero text
    const heroText = document.querySelector('.title-animation p');
    heroText.style.animation = 'fadeInUp 1s ease forwards 0.3s';

    // Animate category cards
    const categories = document.querySelectorAll('.category');
    categories.forEach((category, index) => {
        category.style.animation = `fadeInUp 0.8s ease forwards ${index * 0.2 + 0.5}s`;
    });
});

// img down 
document.addEventListener('DOMContentLoaded', function () {
    // Animate categories on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
            }
        });
    }, { threshold: 0.1 });

    // Observe all categories
    document.querySelectorAll('.category').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});




// --------------------------------------------------------
// details series animation
// --------------------------------------------------------

document.addEventListener('DOMContentLoaded', function () {
    // Animation for the content
    const contentElements = document.querySelectorAll('.pre-title, h1, .subtitle, .description, .cta-link, .view-more-btn');

    contentElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.5s ${index * 0.1}s ease, transform 0.5s ${index * 0.1}s ease`;

        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100);
    });

    // You could add more interactive elements here
    // For example, a click handler for the CTA link
    document.querySelector('.cta-link').addEventListener('click', function (e) {
        e.preventDefault();
        alert('Navigation would go here in a real implementation');
        // In a real site, you would navigate to another page
        // window.location.href = '/about';
    });
});

// --------------------------------------------------------
// section extend
// --------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
    const viewMoreButtons = document.querySelectorAll('.view-more-btn');

    viewMoreButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            const expandableContent = this.closest('.content-column').querySelector('.expandable-content');

            this.setAttribute('aria-expanded', !isExpanded);
            expandableContent.classList.toggle('expanded');

            // Change button text
            this.textContent = isExpanded ? 'VIEW MORE' : 'VIEW LESS';

            // Add the icon back (since textContent removes it)
            if (!isExpanded) {
                this.innerHTML = 'VIEW LESS <svg class="view-more-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            } else {
                this.innerHTML = 'VIEW MORE <svg class="view-more-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 9L12 16L5 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            }
        });
    });
});
// digital section 
"use strict";

        function zikzag_counter_init() {
            jQuery('.wgl-counter').each(function () {
                var $counter = jQuery(this);
                var $value = $counter.find('.wgl-counter__value');

                if (!$counter.hasClass('animated')) {
                    $counter.addClass('animated');
                    $counter.find('.wgl-counter__placeholder').hide();

                    $value.countTo({
                        from: parseInt($value.data('start-value')) || 0,
                        to: parseInt($value.data('end-value')) || 100,
                        speed: parseInt($value.data('speed')) || 2000,
                        refreshInterval: 50
                    });
                }
            });
        }

        jQuery(document).ready(function () {
            zikzag_counter_init();

            jQuery('.wgl-counter').appear(function () {
                zikzag_counter_init();
            });
        });

        // countTo Plugin (if not already available)
        (function ($) {
            $.fn.countTo = function (options) {
                options = options || {};
                return $(this).each(function () {
                    var settings = $.extend({}, $.fn.countTo.defaults, options);
                    var loops = Math.ceil(settings.speed / settings.refreshInterval);
                    var increment = (settings.to - settings.from) / loops;
                    var current = settings.from;
                    var $this = $(this);
                    var loopCount = 0;
                    var interval = setInterval(updateTimer, settings.refreshInterval);

                    function updateTimer() {
                        current += increment;
                        loopCount++;
                        $this.text(Math.round(current));
                        if (loopCount >= loops) {
                            $this.text(settings.to);
                            clearInterval(interval);
                        }
                    }
                });
            };

            $.fn.countTo.defaults = {
                from: 0,
                to: 100,
                speed: 1000,
                refreshInterval: 100
            };
        })(jQuery);

        zikzag_counter_init(); 



// History animation 
document.addEventListener('DOMContentLoaded', function () {
    
    // Select all sections with the featured-right class
    const sections = document.querySelectorAll('.featured-right');

    // Options for the Intersection Observer
    const options = {
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    // Callback function for the observer
    const callback = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                const contentWrapper = section.querySelector('.side-content-wrapper');
                const featuredWrapper = section.querySelector('.side-featured-wrapper');

                // Get animation delay from data attribute or use default
                const delay = contentWrapper.getAttribute('data-animation-delay') || 200;

                // Apply sliding animations
                setTimeout(() => {
                    contentWrapper.style.opacity = '1';
                    contentWrapper.style.transform = 'translateX(0)';

                    featuredWrapper.style.opacity = '1';
                    featuredWrapper.style.transform = 'translateX(0)';
                }, parseInt(delay));

                // Stop observing this section after animation triggers
                observer.unobserve(section);
            }
        });
    };

    // Create the observer
    const observer = new IntersectionObserver(callback, options);

    // Observe each section
    sections.forEach(section => {
        // Initialize styles for animation
        const contentWrapper = section.querySelector('.side-content-wrapper');
        const featuredWrapper = section.querySelector('.side-featured-wrapper');

        // Set initial state for animation
        if (contentWrapper) {
            contentWrapper.style.opacity = '0';
            contentWrapper.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

            // Determine direction based on class (fadeInLeft or fadeInRight)
            if (contentWrapper.classList.contains('fadeInLeft')) {
                contentWrapper.style.transform = 'translateX(-50px)';
            } else {
                contentWrapper.style.transform = 'translateX(50px)';
            }
        }

        if (featuredWrapper) {
            featuredWrapper.style.opacity = '0';
            featuredWrapper.style.transition = 'opacity 0.5s ease-out, transform 0.5s ease-out';

            if (featuredWrapper.classList.contains('fadeInRight')) {
                featuredWrapper.style.transform = 'translateX(50px)';
            } else {
                featuredWrapper.style.transform = 'translateX(-50px)';
            }
        }

        // Start observing the section
        observer.observe(section);
    });
});



// logo sliding
document.addEventListener('DOMContentLoaded', function () {
    // Clone logo items for seamless looping
    const logoTracks = document.querySelectorAll('.logo-track');

    logoTracks.forEach(track => {
        // Clone all children
        const children = Array.from(track.children);
        children.forEach(child => {
            const clone = child.cloneNode(true);
            track.appendChild(clone);
        });

        // Animate the track
        let animation;
        let speed = 30; // pixels per second
        let requestId;
        let startTime;
        let progress = 0;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            progress = (elapsed / 700) * speed;

            // Reset progress when half of content is scrolled
            if (progress >= track.scrollWidth / 2) {
                progress = 0;
                startTime = timestamp;
            }

            track.style.transform = `translateX(-${progress}px)`;
            requestId = requestAnimationFrame(animate);
        }

        function startAnimation() {
            // Adjust speed based on screen size
            speed = window.innerWidth < 768 ? 20 : 30;
            if (!requestId) {
                requestId = requestAnimationFrame(animate);
            }
        }

        function stopAnimation() {
            if (requestId) {
                cancelAnimationFrame(requestId);
                requestId = null;
            }
        }

        // Pause on hover
        track.addEventListener('mouseenter', stopAnimation);
        track.addEventListener('touchstart', stopAnimation);
        track.addEventListener('mouseleave', startAnimation);
        track.addEventListener('touchend', startAnimation);

        // Start animation
        startAnimation();

        // Handle visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAnimation();
            } else {
                startAnimation();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            speed = window.innerWidth < 768 ? 20 : 30;
        });
    });
});



  // JavaScript for the counter animation on scroll
  document.addEventListener('DOMContentLoaded', function () {
    // Function to animate the numbers
    function animateValue(element, start, end, duration, interval) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to handle scroll events
    function handleScroll() {
        const elements = document.querySelectorAll('[data-appear-animation="animateDigits"]');

        elements.forEach(element => {
            if (isInViewport(element) && !element.hasAttribute('data-animated')) {
                const from = parseInt(element.getAttribute('data-from'));
                const to = parseInt(element.getAttribute('data-to'));
                const interval = parseInt(element.getAttribute('data-interval')) || 1;
                const duration = 2500; // Animation duration in milliseconds

                animateValue(element, from, to, duration, interval);
                element.setAttribute('data-animated', 'true');
            }
        });

        // Handle the ExpYear element separately if needed
        const expYearElement = document.getElementById('ExpYear');
        if (expYearElement && isInViewport(expYearElement) && !expYearElement.hasAttribute('data-animated')) {
            const currentYear = new Date().getFullYear();
            const startYear = currentYear - 10; // Assuming company started 10 years ago
            const yearsOfExperience = currentYear - startYear;

            animateValue(expYearElement, 0, yearsOfExperience, 2000, 1);
            expYearElement.setAttribute('data-animated', 'true');
        }
    }

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    handleScroll();
});






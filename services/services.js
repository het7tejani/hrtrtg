document.addEventListener('DOMContentLoaded', function () {
    const stackItems = document.querySelectorAll('.stack-item');
    const container = document.querySelector('.image-stack-container');

    // Convert container to a stacking context
    container.style.position = 'relative';
    // container.style.height = '300vh';

    // Initial setup
    function setupInitialStack() {
        stackItems.forEach((item, index) => {
            // Start with all images stacked and slightly transparent
            // item.style.opacity = 1 - (index * 0.1);
            item.style.zIndex = stackItems.length - index;
        });
    }

    // Scroll animation
    function animateOnScroll() {
        const scrollPosition = window.scrollY;
        const containerTop = container.offsetTop;
        const containerHeight = container.offsetHeight;
        const windowHeight = window.innerHeight;

        // Calculate scroll progress (0 to 1) through the container
        const scrollProgress = Math.min(Math.max((scrollPosition - containerTop + windowHeight * 0.3) / (containerHeight * 0.7), 0, 1));

        stackItems.forEach((item, index) => {
            const itemIndex = parseInt(item.getAttribute('data-index'));
            const reverseIndex = stackItems.length - 1 - index;

            // Each item animates at a different rate
            const itemProgress = Math.min(Math.max((scrollProgress - index * 0.15) / 0.7, 0, 1));

        });
    }

    // Initialize
    setupInitialStack();
    window.addEventListener('scroll', animateOnScroll);
    window.addEventListener('resize', function () {
        // container.style.height = '225vh'; // Reset container height on resize
    });
});
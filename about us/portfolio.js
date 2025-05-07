document.addEventListener('DOMContentLoaded', function () {
    const sliderWrapper = document.querySelector('.swiper-wrapper');
    const slides = document.querySelectorAll('.swiper-slide');
    const backdrop = document.querySelector('.bg_backdrop');

    // Create background element if it doesn't exist
    if (!backdrop.querySelector('.dynamic-bg')) {
        const bgElement = document.createElement('div');
        bgElement.className = 'dynamic-bg';
        bgElement.style.position = 'absolute';
        bgElement.style.top = '0';
        bgElement.style.left = '0';
        bgElement.style.width = '100%';
        bgElement.style.height = '100%';
        bgElement.style.backgroundSize = 'cover';
        bgElement.style.backgroundPosition = 'center';
        bgElement.style.backgroundRepeat = 'no-repeat';
        bgElement.style.filter = 'blur(10px) brightness(0.4)';
        bgElement.style.zIndex = '1';
        bgElement.style.transition = 'opacity 0.8s ease-in-out';
        backdrop.appendChild(bgElement);
    }

    // Clone first and last slides for infinite loop
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');

    // Add clones to the wrapper
    sliderWrapper.appendChild(firstClone);
    sliderWrapper.insertBefore(lastClone, slides[0]);

    // Get updated slides list
    const allSlides = document.querySelectorAll('.swiper-slide');
    const totalSlides = allSlides.length;
    let currentIndex = 1;
    let isAnimating = false;
    const slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);

    // Set initial position
    sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    sliderWrapper.style.transition = 'transform 0.8s ease-in-out';

    // Update background image
    function updateBackground(imageUrl) {
        const bgElement = backdrop.querySelector('.dynamic-bg');
        const newBg = document.createElement('div');
        newBg.className = 'dynamic-bg';
        newBg.style.position = 'absolute';
        newBg.style.top = '0';
        newBg.style.left = '0';
        newBg.style.width = '100%';
        newBg.style.height = '100%';
        newBg.style.backgroundImage = `url('${imageUrl}')`;
        newBg.style.backgroundSize = 'cover';
        newBg.style.backgroundPosition = 'center';
        newBg.style.backgroundRepeat = 'no-repeat';
        newBg.style.filter = ' brightness(0.15)';
        newBg.style.zIndex = '1';
        newBg.style.opacity = '0';
        newBg.style.transition = 'opacity 0.2s ease-in-out';

        backdrop.appendChild(newBg);

        // Fade in new background
        setTimeout(() => {
            newBg.style.opacity = '1';

            // Remove old background after transition
            setTimeout(() => {
                const oldBackgrounds = backdrop.querySelectorAll('.dynamic-bg');
                if (oldBackgrounds.length > 1) {
                    backdrop.removeChild(oldBackgrounds[0]);
                }
            }, 800);
        }, 10);
    }

    // Update active state
    function updateActiveState() {
        allSlides.forEach(slide => slide.classList.remove('active'));

        // Get the background image URL from data attribute
        const bgImg = allSlides[currentIndex].getAttribute('data-bgImg');

        // Update the background
        if (bgImg) {
            updateBackground(bgImg);
        }

        allSlides[currentIndex].classList.add('active');
    }

    // Handle slide transition end
    function handleTransitionEnd() {
        if (currentIndex === 0) {
            sliderWrapper.style.transition = 'none';
            currentIndex = totalSlides - 2;
            sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            void sliderWrapper.offsetWidth;
            sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        }
        else if (currentIndex === totalSlides - 1) {
            sliderWrapper.style.transition = 'none';
            currentIndex = 1;
            sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            void sliderWrapper.offsetWidth;
            sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        }

        isAnimating = false;
        updateActiveState();
    }

    // Navigation functions
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = index;
        sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function nextSlide() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex++;
        sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    function prevSlide() {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex--;
        sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    // Keyboard navigation
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === 'ArrowLeft') prevSlide();
    });

    // Slide transition end - handle loop
    sliderWrapper.addEventListener('transitionend', function () {
        if (allSlides[currentIndex].classList.contains('clone')) {
            sliderWrapper.style.transition = 'none';

            if (currentIndex === 0) {
                currentIndex = totalSlides - 2;
            } else if (currentIndex === totalSlides - 1) {
                currentIndex = 1;
            }

            sliderWrapper.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
            void sliderWrapper.offsetWidth; // Force reflow

            sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        }

        isAnimating = false;
        updateActiveState();
    });

    // Touch events
    let touchStartX = 0;
    let touchEndX = 0;

    sliderWrapper.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });

    sliderWrapper.addEventListener('touchmove', function (e) {
        touchEndX = e.touches[0].clientX;
    }, { passive: true });

    sliderWrapper.addEventListener('touchend', function () {
        const threshold = 50;
        const difference = touchStartX - touchEndX;
        if (difference > threshold) nextSlide();
        if (difference < -threshold) prevSlide();
    }, { passive: true });

    window.addEventListener('resize', function () {
        const newSlideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        if (Math.abs(newSlideWidth - slideWidth) > 5) {
            sliderWrapper.style.transition = 'none';
            sliderWrapper.style.transform = `translateX(-${currentIndex * newSlideWidth}px)`;
            void sliderWrapper.offsetWidth;
            sliderWrapper.style.transition = 'transform 0.6s ease-in-out';
        }
    });

    // Initialize
    updateActiveState();

    // Optional: Auto-slide
    let autoplay = setInterval(nextSlide, 5000);
    sliderWrapper.addEventListener('mouseenter', () => clearInterval(autoplay));
    sliderWrapper.addEventListener('mouseleave', () => {
        autoplay = setInterval(nextSlide, 5000);
    });
});
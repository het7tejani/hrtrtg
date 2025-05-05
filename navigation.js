// navigation 
(function () {
    // DOM Elements
    const body = document.querySelector("body");
    const bodyWrapper = document.querySelector(".body-wrapper");
    const header = document.querySelector("header");
    const navItems = document.querySelectorAll(".nav-container > div:has(.nav-item__header)");
    const bg = document.querySelector(".dropdown__bg");
    const arrow = document.querySelector(".dropdown__arrow");
    const nav = document.querySelector(".nav");
    const dropdowns = document.querySelectorAll(".dropdown");
    const mobileTrigger = document.querySelector(".mobile-trigger");
    const mobileTriggerClose = document.querySelector(".mobile-trigger--close");
    const mobileOverlay = document.querySelector(".header-mobile-overlay");
    const activeClass = "active";

    // State variables
    let bodyWidth = body.offsetWidth;
    let activeDevice = bodyWidth < 1024 ? "mobile" : "desktop";

    // Initialize based on device
    if (activeDevice === "mobile") {
        mobileInit();
    } else {
        desktopInit();
    }

    // Resize observer for device detection
    const observer = new ResizeObserver(debounce(150, (entries) => {
        bodyWidth = entries[0].contentRect.width;
        const newDevice = bodyWidth < 1024 ? "mobile" : "desktop";

        if (activeDevice !== newDevice) {
            if (newDevice === "mobile") {
                // Switch to mobile
                navItems.forEach(navItem => {
                    navItem.removeEventListener("mouseenter", onMouseEnter);
                    navItem.removeEventListener("mouseleave", onMouseLeave);
                });
                bg.classList.remove("open");
                mobileInit();
            } else {
                // Switch to desktop
                closeMobileNav();
                mobileTrigger.removeEventListener("click", openMobileNav);
                nav.classList.remove("nav--mobile");
                nav.style.height = "auto";
                dropdowns.forEach(dropdown => dropdown.style.height = "auto");
                desktopInit();
            }
            activeDevice = newDevice;
        }
    }));

    observer.observe(body);

    // Desktop functions
    function desktopInit() {
        navItems.forEach(navItem => {
            navItem.addEventListener("mouseenter", onMouseEnter);
            navItem.addEventListener("mouseleave", onMouseLeave);
        });
    }

    

    function onMouseEnter() {
        this.classList.add("navitem-enter");

        setTimeout(() => {
            if (this.classList.contains("navitem-enter")) {
                this.classList.add("navitem-enter-active");
            }
        }, 100);

        bg.classList.add("open");

        const dropdown = this.querySelector(".dropdown");
        const dropdownCoords = dropdown.getBoundingClientRect();
        const navCoords = nav.getBoundingClientRect();
        const navItemCoords = this.getBoundingClientRect();

        const coords = {
            itemCenter: navItemCoords.left + navItemCoords.width / 2,
            navCenter: navCoords.left + navCoords.width / 2,
            height: dropdown.offsetHeight,
            width: dropdownCoords.width,
            left: ""
        };

        if (coords.itemCenter > coords.navCenter) {
            coords.left = coords.itemCenter - navCoords.left - dropdownCoords.width / 2 - dropdownCoords.width / 4;
            arrow.style.left = "75%";
        } else {
            coords.left = coords.itemCenter - navCoords.left - dropdownCoords.width / 2 + dropdownCoords.width / 4;
            arrow.style.left = "25%";
        }

        bg.style.width = `${coords.width}px`;
        bg.style.height = `${coords.height}px`;
        bg.style.transform = `translateX(${coords.left}px)`;
    }

    function onMouseLeave() {
        this.classList.remove("navitem-enter-active");
        this.classList.remove("navitem-enter");
        bg.classList.remove("open");

        setTimeout(() => {
            if (!bg.classList.contains("open")) {
                bg.style.height = "0px";
            }
        }, 50);
    }

    // Mobile functions
    function mobileInit() {
        mobileTrigger.addEventListener("click", openMobileNav);
        nav.classList.add("nav--mobile");
        nav.style.height = "0px";
        dropdowns.forEach(dropdown => dropdown.style.height = "0px");
    }

    function openMobileNav() {
        mobileTriggerClose.addEventListener("click", closeMobileNav);
        mobileOverlay.addEventListener("click", closeMobileNav);
        navItems.forEach(navItem => navItem.addEventListener("click", toggleMobileDropdown));
        nav.classList.add("open");
        bodyWrapper.classList.add("hidden");
        calcMobileNavHeight();
    }

    function closeMobileNav() {
        mobileTriggerClose.removeEventListener("click", closeMobileNav);
        mobileOverlay.removeEventListener("click", closeMobileNav);
        nav.classList.remove("open");
        nav.style.height = "0px";
        bodyWrapper.classList.remove("hidden");

        navItems.forEach(navItem => {
            navItem.removeEventListener("click", toggleMobileDropdown);
            navItem.classList.remove(activeClass);
            const dropdown = navItem.querySelector(".dropdown");
            if (dropdown) dropdown.style.height = "0px";
        });
    }

    function toggleMobileDropdown() {
        const dropdown = this.querySelector(".dropdown");
        if (!dropdown) return;

        const dropdownHeight = dropdown.querySelector(".dropdown-inner-container").offsetHeight;

        navItems.forEach(item => {
            if (item !== this) {
                const otherDropdown = item.querySelector(".dropdown");
                item.classList.remove(activeClass);
                if (otherDropdown) otherDropdown.style.height = "0px";
            }
        });

        if (this.classList.contains(activeClass)) {
            this.classList.remove(activeClass);
            dropdown.style.height = "0px";
        } else {
            this.classList.add(activeClass);
            dropdown.style.height = `${dropdownHeight}px`;
        }
    }

    function calcMobileNavHeight() {
        const headerHeight = nav.querySelector(".mobile-nav-header").offsetHeight;
        const navHeight = nav.querySelector(".nav-container").offsetHeight;
        const btnsHeight = nav.querySelector(".nav-btns").offsetHeight;
        const totalHeight = headerHeight + navHeight + btnsHeight;
        nav.style.height = `${totalHeight}px`;
    }

    // Header scroll effect
    let lastKnownScrollPosition = 0;
    let ticking = false;

    document.addEventListener("scroll", () => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastKnownScrollPosition > 20) {
                    header.classList.add("has-scrolled");
                } else {
                    header.classList.remove("has-scrolled");
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // Debounce function
    function debounce(ms, fn) {
        let timer;
        return function () {
            clearTimeout(timer);
            const args = arguments;
            const context = this;
            timer = setTimeout(() => fn.apply(context, args), ms);
        };
    }
})();

// Initialize other components when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
    // LazyLoad images
    if (typeof LazyLoad !== "undefined") {
        new LazyLoad();
    }

    // HubSpot Conversations - load with delay
    if (window.hsConversationsSettings) {
        window.hsConversationsSettings.loadImmediately = false;
        setTimeout(() => {
            if (window.HubSpotConversations) {
                window.HubSpotConversations.widget.load();
            }
        }, 7000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href*="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();

            const targetId = this.getAttribute("href");
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerHeight = document.querySelector("header").offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});

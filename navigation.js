// navigation 
!function () {
    const body = document.querySelector("body"),
        bodyWrapper = body.querySelector(".body-wrapper"),
        header = document.querySelector("header"),
        navItems = document.querySelectorAll(".nav-container div.nav-item"),
        bg = document.querySelector(".dropdown__bg"),
        arrow = bg.querySelector(".dropdown__arrow"),
        nav = document.querySelector(".nav"),
        dropdowns = document.querySelectorAll(".dropdown"),
        mobileTrigger = document.querySelector(".mobile-trigger"),
        mobileTriggerClose = document.querySelector(".mobile-trigger--close"),
        mobileOverlay = document.querySelector(".header-mobile-overlay"),
        activeClass = "active",
        mobileNavElHeight = { header: "", nav: "", btns: "" },
        navObserver = new ResizeObserver(calcMobileNavHeight),
        observer = new ResizeObserver(debounce(150, (entries => {
            bodyWidth = entries[0].contentRect.width,
                function (newDevice) {
                    let isMobile = activeDevice != newDevice && "mobile" == newDevice,
                        isDesktop = activeDevice != newDevice && "desktop" == newDevice;
                    isMobile ? (
                        navItems.forEach((navItem => navItem.removeEventListener("mouseenter", onMouseEnter))),
                        navItems.forEach((navItem => navItem.removeEventListener("mouseleave", onMouseLeave))),
                        bg.classList.remove("open"),
                        arrow.style.setProperty("left", "50%"),
                        mobileInit(),
                        activeDevice = newDevice) : isDesktop && (
                            closeMobileNav(),
                            mobileTrigger.removeEventListener("click", openMobileNav),
                            nav.classList.remove("nav--mobile"),
                            nav.style.setProperty("height", "auto"),
                            dropdowns.forEach((dropdown => {
                                dropdown.style.setProperty("height", "auto")
                            })),
                            desktopInit(),
                            activeDevice = newDevice)
                }(bodyWidth < 1024 ? "mobile" : "desktop")
        })));

    let bodyWidth = body.offsetWidth,
        activeDevice = bodyWidth < 1024 ? "mobile" : "desktop";

    function desktopInit() {
        navItems.forEach((navItem => navItem.addEventListener("mouseenter", onMouseEnter))),
            navItems.forEach((navItem => navItem.addEventListener("mouseleave", onMouseLeave)))
    }

    function onMouseEnter() {
        this.classList.add("navitem-enter"),
            setTimeout((() => this.classList.contains("navitem-enter") && this.classList.add("navitem-enter-active")), 100),
            bg.classList.add("open");
        const dropdown = this.querySelector(".dropdown"),
            dropdownCoords = dropdown.getBoundingClientRect(),
            navCoords = nav.getBoundingClientRect(),
            navItemCoords = this.getBoundingClientRect(),
            coords = {
                itemCenter: navItemCoords.left + navItemCoords.width / 2,
                navCenter: navCoords.left + navCoords.width / 2,
                height: dropdown.offsetHeight,
                width: dropdownCoords.width,
                left: ""
            };
        coords.itemCenter > coords.navCenter ? (
            coords.left = coords.itemCenter - navCoords.left - dropdownCoords.width / 2 - dropdownCoords.width / 4,
            arrow.style.setProperty("left", "75%")) : (
            coords.left = coords.itemCenter - navCoords.left - dropdownCoords.width / 2 + dropdownCoords.width / 4,
            arrow.style.setProperty("left", "25%")),
            bg.style.setProperty("width", `${coords.width}px`),
            bg.style.setProperty("height", `${coords.height}px`),
            bg.style.setProperty("transform", `translateX(${coords.left}px)`)
    }

    function onMouseLeave() {
        this.classList.remove("navitem-enter-active"),
            this.classList.remove("navitem-enter"),
            bg.classList.remove("open"),
            setTimeout((() => !bg.classList.contains("open") && bg.style.setProperty("height", "0px")), 50)
    }

    function mobileInit() {
        mobileTrigger.addEventListener("click", openMobileNav),
            nav.classList.add("nav--mobile"),
            nav.style.setProperty("height", "0px"),
            dropdowns.forEach((dropdown => {
                dropdown.style.setProperty("height", "0px")
            }))
    }

    function openMobileNav() {
        mobileTriggerClose.addEventListener("click", closeMobileNav),
            mobileOverlay.addEventListener("click", closeMobileNav),
            navItems.forEach((navItem => navItem.addEventListener("click", toggleMobileDropdown))),
            nav.classList.add("open"),
            bodyWrapper.classList.add("hidden"),
            calcMobileNavHeight()
    }

    function closeMobileNav() {
        mobileTriggerClose.removeEventListener("click", closeMobileNav),
            nav.classList.remove("open"),
            nav.style.setProperty("height", "0px"),
            bodyWrapper.classList.remove("hidden"),
            navItems.forEach((navItem => {
                let dropdown = navItem.querySelector(".dropdown");
                navItem.removeEventListener("click", toggleMobileDropdown),
                    navItem.classList.remove(activeClass),
                    dropdown.style.setProperty("height", "0px")
            })),
            navObserver.unobserve(nav.querySelector(".nav-container"))
    }

    function toggleMobileDropdown() {
        const dropdown = this.querySelector(".dropdown"),
            dropdownHeight = this.querySelector(".dropdown-inner-container").offsetHeight;
        navObserver.observe(nav.querySelector(".nav-container")),
            navItems.forEach((item => {
                if (item != this) {
                    let dropdown = item.querySelector(".dropdown");
                    item.classList.remove(activeClass),
                        dropdown.style.setProperty("height", "0px")
                }
            })),
            this.classList.contains(activeClass) ? (
                this.classList.remove(activeClass),
                dropdown.style.setProperty("height", "0px")) : (
                this.classList.add(activeClass),
                dropdown.style.setProperty("height", `${dropdownHeight}px`))
    }

    function calcMobileNavHeight() {
        mobileNavElHeight.header = nav.querySelector(".mobile-nav-header").offsetHeight,
            mobileNavElHeight.nav = nav.querySelector(".nav-container").offsetHeight,
            mobileNavElHeight.btns = nav.querySelector(".nav-btns").offsetHeight,
            nav.style.setProperty("height", `${mobileNavElHeight.header + mobileNavElHeight.nav + mobileNavElHeight.btns}px`)
    }

    // Debounce function required for the ResizeObserver
    function debounce(ms, fn) {
        var timer;
        return function () {
            clearTimeout(timer);
            var args = Array.prototype.slice.call(arguments);
            args.unshift(this), (timer = setTimeout(fn.bind.apply(fn, args), ms));
        };
    }

    // Initialize
    observer.observe(body),
        "mobile" == activeDevice ? mobileInit() : "desktop" == activeDevice && desktopInit(),

        // Scroll effect for header
        (function () {
            let lastKnownScrollPosition = 0,
                ticking = !1;
            document.addEventListener("scroll", (function (e) {
                lastKnownScrollPosition = window.scrollY,
                    ticking || (window.requestAnimationFrame((function () {
                        lastKnownScrollPosition > 20 ? header.classList.add("has-scrolled") : header.classList.remove("has-scrolled"),
                            ticking = !1
                    }))),
                    ticking = !0
            }))
        })()
}();




// smoot scrolling anchor tag 

document.addEventListener('DOMContentLoaded', function () {
    // Select all anchor tags with href starting with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    // Add click event listener to each anchor link
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // Prevent default anchor behavior
            e.preventDefault();

            // Get the target element's ID from the href attribute
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip if href is just #

            // Find the target element
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return; // Exit if target doesn't exist

            // Calculate the target position (accounting for fixed headers if needed)
            const headerOffset = 80; // Adjust this value to match your header height
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            // Smooth scroll to the target
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update URL (optional)
            history.pushState(null, null, targetId);
        });
    });
});
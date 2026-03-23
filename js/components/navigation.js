export function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const navIndicator = document.querySelector('.nav-indicator');
    const navItems = document.querySelectorAll('.nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrap = document.querySelector('.nav-menu-wrap');
    const desktopMediaQuery = window.matchMedia('(min-width: 900px)');
    let isNavigating = false;

    if(!navMenu || !navItems.length) {
        console.error('Navigation initialization failed: Required elements not found.');
        return () => {}; // Return a no-op cleanup function
    }

    /**
     * Moves the navigation indicator to the specified target item.
     * 
     * @param {HTMLElement} targetItem 
     */
    function moveIndicator(targetItem, animate = true) {
        if(!navIndicator || !targetItem || !desktopMediaQuery.matches) {
            return;
        }

        // const targetLink = targetItem.querySelector('a');
        const menuRect = navMenu.getBoundingClientRect();
        const itemRect = targetItem.getBoundingClientRect();

        if(!animate) {
            navIndicator.classList.remove('is-ready');
        }

        navIndicator.style.width = `${itemRect.width}px`;
        navIndicator.style.left = `${itemRect.left - menuRect.left}px`;

        if(!animate) {
            requestAnimationFrame(() => {
                navIndicator.classList.add('is-ready');
            });
        }
    }

    /**
     * Gets the currently active navigation item.
     * @returns {HTMLElement|null}
     */
    function getActiveItem() {
        return document.querySelector('.nav-item--active');
    }

    /**
     * Resets the navigation indicator to the active item position.
     */
    function resetToActiveItem() {
        const activeItem = getActiveItem();
        if (activeItem) {
            moveIndicator(activeItem);
        }
    }

    /**
     * Clears the hovered state from all navigation items.
     */
    function clearHoveredState() {
        navItems.forEach(item => {
            item.classList.remove('is-hovered');
        });
    }

    /**
     * Handles the mouse enter event for navigation items.
     * 
     * @param {Event} event 
     */
    function handleMouseEnter(event) {
        if(isNavigating) return;
        const targetItem = event.currentTarget;

        navMenu.classList.add('is-hovering');
        clearHoveredState();
        targetItem.classList.add('is-hovered');
        moveIndicator(targetItem);
    }

    /**
     * Handles the mouse leave event for the navigation menu.
     */
    function handleMouseLeave() {
        if(isNavigating) return;
        const activeNavItem = getActiveItem();
        navMenu.classList.remove('is-hovering');
        clearHoveredState();
        moveIndicator(activeNavItem);
    }

    /**
     * Handles the click event for the navigation toggle.
     * @returns {void}
     */
    function handleToggleClick() {
        const navIcon = navToggle.querySelector('.nav-toggle-icon');
        
        if(!navMenuWrap || !navToggle || !navIcon) {
            console.error('Navigation toggle elements not found.');
            return;
        }

        const isOpen = navMenuWrap.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
        navIcon.setAttribute('aria-hidden', String(false));
    }

    /**
     * Handles the click event for navigation items with href="#", preventing default behavior and updating active state.
     */
    function onNavigationItemClick(event) {
        const targetItem = event.currentTarget;
        const link = targetItem.querySelector('a');

        if (!link) {
            return;
        }

        if (targetItem.classList.contains('nav-item--active')) {
            event.preventDefault();
            return;
        }

        isNavigating = true;
    }

    /**
     * Handles the window resize event to reset the navigation indicator and close the menu if necessary.
     */
    function handleResize() {
        if(desktopMediaQuery.matches) {
            if(navMenuWrap && navToggle) {
                navMenuWrap.classList.remove('is-open');
                navToggle.setAttribute('aria-expanded', 'false');
            }
            resetToActiveItem();
        }
    }

    // Attach event listeners to navigation items and menu
    navItems.forEach(item => {
        item.addEventListener('mouseenter', handleMouseEnter);
        item.addEventListener('click', onNavigationItemClick);
    });

    // Reset indicator on mouse leave and window resize
    navMenu.addEventListener('mouseleave', handleMouseLeave);

    if(navToggle && navMenuWrap) {
        navToggle.addEventListener('click', handleToggleClick);
        window.addEventListener('resize', handleResize);
    } else {
        window.addEventListener('resize', handleMouseLeave);
    }

    // Initialize the indicator position to the active item
    moveIndicator(getActiveItem(), false);

    // Return a cleanup function to remove event listeners when needed
    return function cleanupNavigation() {
        if(navIndicator) {
            navIndicator.classList.remove('is-ready');
        }

        if(navMenuWrap){
            navMenuWrap.classList.remove('is-open');
        }

        if(navToggle && navMenuWrap) {
            navToggle.removeEventListener('click', handleToggleClick);
            navToggle.setAttribute('aria-expanded', 'false');
        }

        navItems.forEach(item => {
            item.removeEventListener('mouseenter', handleMouseEnter);
            item.removeEventListener('click', onNavigationItemClick);
        });

        navMenu.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
    };
}
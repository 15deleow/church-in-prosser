export function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const navIndicator = document.querySelector('.nav-indicator');
    const navItems = document.querySelectorAll('.nav-item');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenuWrap = document.querySelector('.nav-menu-wrap');
    const desktopMediaQuery = window.matchMedia('(min-width: 900px)');

    if(!navMenu || !navItems.length) {
        console.error('Navigation initialization failed: Required elements not found.');
        return () => {}; // Return a no-op cleanup function
    }

    /**
     * Moves the navigation indicator to the specified target item.
     * 
     * @param {HTMLElement} targetItem 
     */
    function moveIndicator(targetItem) {
        if(!navIndicator || !targetItem || !desktopMediaQuery.matches) {
            return;
        }

        const targetLink = targetItem.querySelector('a');
        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = targetLink.getBoundingClientRect();

        if(!targetLink || !menuRect || !linkRect){
            console.error('Failed to calculate positions for navigation indicator.');
            return;
        }

        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.left = `${linkRect.left - menuRect.left}px`;
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
     * Handles the mouse enter event for navigation items.
     * 
     * @param {Event} event 
     */
    function handleMouseEnter(event) {
        const targetItem = event.currentTarget;
        moveIndicator(targetItem);
    }

    /**
     * Handles the mouse leave event for the navigation menu.
     */
    function handleMouseLeave() {
        const activeNavItem = getActiveItem();
        moveIndicator(activeNavItem);
    }

    /**
     * Handles the click event for the navigation toggle.
     * @returns {void}
     */
    function handleToggleClick() {
        if(!navMenuWrap || !navToggle) {
            console.error('Navigation toggle elements not found.');
            return;
        }

        const isOpen = navMenuWrap.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
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

    if(desktopMediaQuery.matches) {
        resetToActiveItem();
    }

    // Attach event listeners to navigation items and menu
    navItems.forEach(item => {
        item.addEventListener('mouseenter', handleMouseEnter);
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
    moveIndicator(activeNavItem);

    // Return a cleanup function to remove event listeners when needed
    return function cleanupNavigation() {
        if(navIndicator) {
            navIndicator.style.width = '';
            navIndicator.style.left = '';
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
        });

        navMenu.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleResize);
    };
}
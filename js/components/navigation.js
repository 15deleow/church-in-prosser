export function initNavigation() {
    const navMenu = document.querySelector('.nav-menu');
    const navIndicator = document.querySelector('.nav-indicator');
    const navItems = document.querySelectorAll('.nav-item');
    const activeNavItem = document.querySelector('.nav-item--active');

    console.log(`Active nav item:`, activeNavItem);

    if (!navMenu || !navIndicator || !navItems.length || !activeNavItem) {
        return () => {};
    }

    /**
     * Moves the navigation indicator to the specified target item.
     * 
     * @param {HTMLElement} targetItem 
     */
    function moveIndicator(targetItem) {
        const targetLink = targetItem.querySelector('a');
        const menuRect = navMenu.getBoundingClientRect();
        const linkRect = targetLink.getBoundingClientRect();

        if(!targetLink || !menuRect || !linkRect){
            console.error('Failed to calculate positions for navigation indicator.');
            return;
        }

        navIndicator.style.width = `${linkRect.width}px`;
        navIndicator.style.transform = `translateX(${linkRect.left - menuRect.left}px)`;
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
        moveIndicator(activeNavItem);
    }

    // Attach event listeners to navigation items and menu
    navItems.forEach(item => {
        item.addEventListener('mouseenter', handleMouseEnter);
    });

    // Reset indicator on mouse leave and window resize
    navMenu.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleMouseLeave);

    // Initialize the indicator position to the active item
    moveIndicator(activeNavItem);

    // Return a cleanup function to remove event listeners when needed
    return function cleanupNavigation() {
        navItems.forEach(item => {
            item.removeEventListener('mouseenter', handleMouseEnter);
        });
        navMenu.removeEventListener('mouseleave', handleMouseLeave);
        window.removeEventListener('resize', handleMouseLeave);

        // Reset indicator styles
        navIndicator.style.width = '';
        navIndicator.style.left = '';

            console.log('Initializing navigation...');
        console.log('navMenu:', navMenu);
        console.log('navIndicator:', navIndicator);
        console.log('navItems:', navItems);
        console.log('activeNavItem:', activeNavItem);
    };
}
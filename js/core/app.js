import { createCleanupManager } from './cleanup-manager.js';
import { initNavigation } from "../components/navigation.js";
import { initHomePage } from "../pages/home.js";
import { initAboutPage } from "../pages/about.js";
import { initEventsPage } from "../pages/events.js";
import { initLivePage } from "../pages/live.js";

export function initApp() {
    const cleanupManager = createCleanupManager();
    const currentPage = document.body.dataset.page;

    // Page-specific initialization
    const pageInitializers = {
        home: initHomePage,
        about: initAboutPage,   
        events: initEventsPage,
        live: initLivePage
    };

    // Initialize navigation and add its cleanup function to the manager
    cleanupManager.add(initNavigation());

    // Call the initializer for the current page, if it exists, and add its cleanup function to the manager
    const initPage = pageInitializers[currentPage];
    if(initPage && typeof initPage === 'function') {
        cleanupManager.add(initPage());
    }

    // Ensure all cleanup functions are called when the page is unloaded
    window.addEventListener('beforeunload', () => {
        cleanupManager.runAll();
    });

    return cleanupManager;
}
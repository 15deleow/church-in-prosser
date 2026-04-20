import { initGoogleSheetManager } from "../data/google-sheet-manager.js";

export function initEventsPage() {
    function loadEventPageEvents() {
        // Access the Google Sheet Manager to fetch and display events
        const googleSheetManager = initGoogleSheetManager();
        googleSheetManager.getUpcomingEvents()
            .then(events => {
                renderEventsPage(eventList, events);
            })
            .catch(error => {
                console.error('Error loading events:', error);
                renderEventsPageError();
            });
    }

    const eventList = document.querySelector('#events-list');
    var isDisposed = false;
    
    loadEventPageEvents();

    return function cleanupEventsPage() {
        isDisposed = true;
    };
}

function renderEventsPage(eventList, events) {
    // Determine if we have access to eventList
    if (!eventList) {
        console.error('Event list container not found. Cannot render events.');
        return;
    }

    events.forEach(event => {
        const listItem = document.createElement("li");
        listItem.classList.add("event-list-item");
        eventList.appendChild(listItem);

        const listArticle = document.createElement('article');
        listArticle.classList.add('event-item');
        listArticle.id = escapeHtml(event.slug);
        listItem.appendChild(listArticle);

        // Header Section
        const headerSection = document.createElement('div');
        headerSection.classList.add('header-section');
        listArticle.appendChild(headerSection);

        const headerTitle = document.createElement('h2');
        headerTitle.classList.add('event-title');
        headerTitle.textContent = escapeHtml(event.title);
        const date = document.createElement('p');
        date.classList.add('event-date');
        date.textContent = escapeHtml(event.dateDisplay);
        headerSection.appendChild(headerTitle);
        headerSection.appendChild(date);

        // Main Section
        const mainSection = document.createElement('div');
        mainSection.classList.add('main-section');
        listArticle.appendChild(mainSection);

        const time = document.createElement('p');
        time.classList.add('event-time');
        time.textContent = escapeHtml(event.timeSummary);
        const location = document.createElement('p');
        location.classList.add('event-location');
        location.textContent = escapeHtml(event.location);
        const address = document.createElement('p');
        address.classList.add('event-address');
        address.textContent = escapeHtml(event.address);
        mainSection.appendChild(time);
        mainSection.appendChild(location);
        mainSection.appendChild(address);

        // Link Section
        const linksSection = document.createElement('div');
        linksSection.classList.add('links-section');
        listArticle.appendChild(linksSection);

        // More Info Link
        const moreInfo = document.createElement('a');
        moreInfo.classList.add('event-link');
        moreInfo.textContent = "More Info";
        moreInfo.href = escapeHtml(event.linkUrl);
        linksSection.appendChild(moreInfo);

        // Get Directions
        const mapUrl = generateMapUrl(event.address);
        const getDirections = document.createElement('a');
        getDirections.classList.add('event-map');
        getDirections.textContent = "Get Directions";
        getDirections.href = mapUrl;
        linksSection.appendChild(getDirections);
    });

    requestAnimationFrame(() => {
        const tag = extractTag();

        if(tag) {
            const card = eventList.querySelector(`#${tag}`);
            if(card){
                card.scrollIntoView({ behavior: "smooth", block: "center"});

                card.classList.add('event-highlight');

                window.setTimeout(() => {
                    card.classList.remove('event-highlight');
                }, 2200);
            }
        }
    });
}

function renderEventsPageError(errorMessage) {
    const listItem = document.createElement("li");
    listItem.classList.add("event-list-item");
    eventList.appendChild(listItem);

    const listArticle = document.createElement('article');
    listArticle.classList.add('event-item');
    listArticle.id = escapeHtml(event.slug);
    listItem.appendChild(listArticle);

    // Header Section
    const headerSection = document.createElement('div');
    headerSection.classList.add('header-section');
    listArticle.appendChild(headerSection);

    const headerTitle = document.createElement('h2');
    headerTitle.classList.add('event-title');
    headerTitle.textContent = errorMessage;
    headerSection.appendChild(headerTitle);
}

function escapeHtml(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
}

function generateMapUrl(address) {
    const encodedAddress = encodeURIComponent(address);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    if (isIOS) {
        return `maps://?q=${encodedAddress}`;
    } else {
        return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    }
}

/**
 * 
 * @returns 
 */
function extractTag(){
    // Gets the Slug from the URL
    const { hash } = window.location;
    if(!hash) {
        return "";
    }

    // Safely handles URL-encoded values and cleans up accidental whitespaces
    return decodeURIComponent(hash.slice(1)).trim();

}
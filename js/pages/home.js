import { initGoogleSheetManager } from "../data/google-sheet-manager.js";

// Access the Google Sheet Manager to fetch and display events
const googleSheetManager = initGoogleSheetManager();

export function initHomePage() {
    // Access the event list container in the DOM
    const eventList = document.querySelector('#event-list');
    var isDisposed = false;  

    loadHomePageEvents();

    async function loadHomePageEvents() {
        // If the event list container is not found, we can't load events
        if(!eventList) {
            console.error('Event list container not found. Cannot load events.');
            return;
        }

        try {
            // Fetch events from the Google Sheet
            const events = await googleSheetManager.getUpcomingEvents();

            // If the page has been disposed while fetching, do not attempt to render
            if (isDisposed) return;

            const firstThreeEvents = events.slice(0, 3);

            // Render the events on the home page
            renderHomePageEvents(eventList, firstThreeEvents);

        } catch (error) {
            console.error('Error loading events:', error);

            // If the page has been disposed while fetching, do not attempt to render
            if (isDisposed) return;

            // Render an error message in the event list
            renderHomePageEventsError(eventList);
        }
    }

    return function cleanupHomePage() {
        isDisposed = true;
    };
}

function renderHomePageEvents(eventList, events) {
    eventList.innerHTML = ''; // Clear existing events

    if (events.length === 0) {
        const event_card = document.createElement('li');
        const event_item = document.createElement('p');
        event_item.textContent = 'No upcoming events found.';
        event_card.appendChild(event_item);
        eventList.appendChild(event_card);
        return;
    }

    // Render each event
    events.forEach(event => {
        // Create event card elements
        const event_card = document.createElement('li');
        const event_item = document.createElement('a');
        event_item.href = `/events.html#${escapeHtml(event.slug)}`;
        event_item.classList.add('event-item');

        const event_name = document.createElement('h3');
        event_name.classList.add('event-name');
        event_name.textContent = escapeHtml(event.title);
        event_item.appendChild(event_name);

        const event_date = document.createElement('p');
        event_date.classList.add('event-date');
    
        // If start and end dates are the same, show just one date. Otherwise, show a range.
        if (event.startDateDisplay === event.endDateDisplay) {
            event_date.textContent = escapeHtml(event.startDateDisplay);
        } else {
            event_date.textContent = `${escapeHtml(event.startDateDisplay)} - ${escapeHtml(event.endDateDisplay)}`;
        }

        event_item.appendChild(event_date);

        event_card.appendChild(event_item);
        eventList.appendChild(event_card);
    });

}

function renderHomePageEventsError(eventList){
            // Create event card elements
        const event_card = document.createElement('li');
        const event_item = document.createElement('p');
        event_item.textContent = 'Unable to load events at this time. Please try again later.';
        event_card.appendChild(event_item);
        eventList.appendChild(event_card);
}

function escapeHtml(value) {
    if (typeof value !== 'string') return '';
    return value.replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;');
}
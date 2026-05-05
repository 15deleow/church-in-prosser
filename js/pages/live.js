// Meeting Times
const meetings = [
    {
        start: new Date("2026-05-15T19:00:00-07:00"),
        durationMinutes: 120
    },
    {
        start: new Date("2026-05-16T10:00:00-07:00"),
        durationMinutes: 120
    },
    {
        start: new Date("2026-05-16T13:00:00-07:00"),
        durationMinutes: 120
    },
    {
        start: new Date("2026-05-17T09:45:00-07:00"),
        durationMinutes: 135 // 2 hrs 15 mins
    }
];

const MINUTE = 60 * 1000; // milliseconds in a minute

export function initLivePage() {
    // Check if a valid zoom link has been provided
    updateJoinButtonStatus();

    // Set up an interval to check every 30 seconds if the join button should be enabled
    setInterval(updateJoinButtonStatus, 30 * 1000);

    // Scroll to center the live page content
    requestAnimationFrame(() => {
        scrollPastHero();
    });

    return function cleanupLivePage() {
        // Cleanup code for the live page can be added here if needed
        clearInterval(updateJoinButtonStatus);
    };
}

function scrollPastHero() {
    const header = document.querySelector("header"); // hero + nav wrapper

    if (!header) return;

    const top = header.offsetHeight; // add some extra space after the hero section

    window.scrollTo({
        top,
        behavior: "smooth"
    });
}

/**
 * Checks if a meeting is joinable based on the current time.
 * 
 * @param {{ start: Date, durationMinutes: number }} meeting 
 * @param {Date} now 
 * @returns {boolean}
 */
function isJoinable(meeting, now) {
    const joinWindowStart = meeting.start.getTime() - 10 * MINUTE; // 10 minutes before the meeting starts
    const joinWindowEnd = meeting.start.getTime() + meeting.durationMinutes * MINUTE; // until the meeting ends
    const currentTime = now.getTime(); // current time in milliseconds

    // Check if the current time is within the join window
    return currentTime >= joinWindowStart && currentTime <= joinWindowEnd;
}


function updateJoinButtonStatus() {
    const joinButton = document.getElementById('join-button');
    const noLinkText = document.querySelector(".join-note");
    if (joinButton && noLinkText) {
        const activeMeeting = meetings.find(meeting => isJoinable(meeting, new Date()));
        if (activeMeeting) {
            noLinkText.classList.add("hidden");
            joinButton.classList.remove('button-disabled');
        } else {
            noLinkText.classList.remove('hidden');
            joinButton.classList.add('button-disabled');
        }
    }
}
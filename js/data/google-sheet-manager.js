export function initGoogleSheetManager() {  
    /**
     * Fetch upcoming events from the Google Sheets CSV export, parse it, and return an array of event objects.
     * @returns {Promise<Array>} A promise resolving to an array of upcoming event objects
     */
    async function fetchEventRows() {
        // Fetch CSV Data from Google Sheets
        const url = `https://docs.google.com/spreadsheets/d/e/2PACX-1vQUsXQvqiA9RuNZmHYLEEk8A5M9c5tvsN8ZNeoV6sZcdRyiHqqnAjtc29ECIwSk4md99YFIt3FyGTMX/pub?gid=0&single=true&output=csv`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const csvText = await response.text();
            return parseCSV(csvText);
        } catch (error) {
            console.error('Error fetching or parsing CSV:', error);
            return [];
        }
    }

    /**
     * Parses CSV text into an array of event objects. The first line is expected to be headers.
     * @param {string} csvText 
     * @returns {Array} An array of event objects
     */
    function parseCSV(csvText) {
        if (!csvText) return [];
        const lines = csvText.trim().split(/\r?\n/);
        const headers = parseCSVLine(lines[0]).map(h => h.trim());
        const events = lines.slice(1).map(line => {
            const values = parseCSVLine(line);
            const event = {};
            headers.forEach((header, index) => {
                event[header] = values[index] !== undefined ? values[index] : '';
            });
            return event;
        });
        return events;
    }

    /**
     * Parses a single line of CSV data, handling quoted fields and commas within quotes
     * @param {string} line 
     * @returns {Array} An array of parsed values
     */
    function parseCSVLine(line) {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (ch === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    cur += '"';
                    i++; // skip escaped quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (ch === ',' && !inQuotes) {
                result.push(cur);
                cur = '';
            } else {
                cur += ch;
            }
        }
        result.push(cur);
        return result.map(s => s.trim());
    }

    /**
     * Normalizes an event row by converting data types and validating values
     * @param {Object} event 
     * @returns {Object|null} A normalized event object or null if the event is invalid or unpublished
     */
    function normalizeEventRow(event){
        const published = ['true', 'yes', '1'].includes(String(event['published'] || '').trim().toLowerCase());
        const title = String(event['title'] || '').trim();
        const start_date = String(event['start_date'] || '').trim();
        const end_date = String(event['end_date'] || '').trim();

        // if event is not published, we can skip it
        if(!published) {
            return null;
        }

        if(!title) {
            return null;
        }

        // Convert date strings to Date objects, if they exist
        if(!start_date || !end_date) return null;
        const startDate = parseLocalDate(start_date);
        const endDate = parseLocalDate(end_date);
        const startDateDisplay = startDate ? startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
        const endDateDisplay = endDate ? endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '';
        if(!startDate || !endDate) return null;

        // Ensure end_date is not before start_date
        if(endDate < startDate) return null;

        // Return a normalized event object with consistent property names and types
        return {
            title,
            startDateText: start_date,
            endDateText: end_date,
            startDateDisplay,
            endDateDisplay,
            startDate,
            endDate,
            timeSummary: String(event.time_summary || '').trim(),
            location: String(event.location || '').trim(),
            address: String(event.address || '').trim(),
            linkUrl: String(event.link_url || '').trim(),
            slug: String(event.slug || '').trim() || createSlug(title, start_date)
        };
    }

    /**
     * Parses a local date string in YYYY-MM-DD format
     * @param {string} value The date string to parse
     * @returns {Date|null} A Date object if the input is valid, or null if the input is invalid
     */
    function parseLocalDate(value) {
        // If the value does not match the expected date format, return null
        if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

        // Parse the date string in YYYY-MM-DD format
        const [year, month, day] = value.split('-').map(Number);
        const date = new Date(year, month - 1, day); // month is 0-indexed in JavaScript

        // Check if the date is valid
        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;
    }

    /**
     * Determines if an event is upcoming based on its start date
     * @param {Object} event 
     * @returns {boolean}
     */
    function isUpcomingEvent(event) {
        // Get Midnight of the current day to compare with event end date
        const now = new Date();
        const todayAtMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return event.endDate >= todayAtMidnight;
    }

    /**
     * Sorts events by their start date in ascending order
     * @param {Array} events 
     * @returns {Array}
     */
    function sortByStartDateAscending(events) {
        return [...events].sort((a, b) => a.startDate - b.startDate);
    }

    /**
     * Fetches and returns the list of upcoming events
     * @returns {Promise<Array>} A promise resolving to an array of upcoming event objects
     */
    async function getUpcomingEvents() {
        // Fetch the upcoming events (already parsed by fetchEventRows)
        const rawEvents = await fetchEventRows();

        // Normalize the event data into a clean event object
        const normalizedEvents = rawEvents
            .map(normalizeEventRow)
            .filter(Boolean);

        // Filter out unpublished events and sort by start date.
        const upcoming = normalizedEvents.filter(isUpcomingEvent);
        return sortByStartDateAscending(upcoming);
    }

    return {
        getUpcomingEvents
    }
}
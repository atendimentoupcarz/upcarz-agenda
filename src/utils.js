/**
 * Utility functions for the Upcarz Scheduler
 */

/**
 * Format a date object to a localized date string
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string (e.g., "Seg, 15 Mai")
 */
function formatDate(date) {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    return date.toLocaleDateString('pt-BR', options);
}

/**
 * Get the week start and end dates for a given date
 * @param {Date} date - Any date within the target week
 * @returns {Object} Object containing start and end dates of the week
 */
function getWeekRange(date = new Date()) {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDay();
    const startDate = new Date(currentDate);
    
    // Adjust to Monday as the first day of the week
    const dayOffset = currentDay === 0 ? -6 : 1 - currentDay;
    startDate.setDate(currentDate.getDate() + dayOffset);
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    
    return { startDate, endDate };
}

/**
 * Generate an array of dates for a given week
 * @param {Date} startDate - The start date of the week
 * @returns {Array} Array of date objects for the week
 */
function getWeekDates(startDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(currentDate);
        date.setDate(currentDate.getDate() + i);
        dates.push(date);
    }
    
    return dates;
}

/**
 * Format time in 24h format to 12h format with AM/PM
 * @param {number} hour - Hour in 24h format
 * @param {number} [minute=0] - Minute (0 or 30)
 * @returns {string} Formatted time (e.g., '9:00 AM' or '2:30 PM')
 */
function formatTime(hour, minute = 0) {
    const period = hour < 12 ? 'AM' : 'PM';
    const displayHour = hour % 12 || 12; // Convert 0 to 12 for 12-hour format
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
}

/**
 * Parse a time string in 'HH:MM' format to an object with hour and minute
 * @param {string} timeStr - Time string in 'HH:MM' format
 * @returns {Object} Object with hour and minute as numbers
 */
function parseTimeString(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
}

/**
 * Debounce a function to limit how often it can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} The debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Show a notification to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // In a real app, this would show a nice notification
    console.log(`[${type.toUpperCase()}] ${message}`);
}

// Export the utility functions
window.utils = {
    formatDate,
    getWeekRange,
    getWeekDates,
    formatTime,
    debounce,
    showNotification
};

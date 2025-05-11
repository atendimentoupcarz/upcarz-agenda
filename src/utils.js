/**
 * Utility functions for the application
 */

// Format date to YYYY-MM-DD
export function formatDate(date) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

// Get day of the week in Portuguese
export function getDayOfWeek(date) {
    const days = ['domingo', 'segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'];
    return days[date.getDay()];
}

// Get week range (start and end dates)
export function getWeekRange(date = new Date()) {
    const currentDate = new Date(date);
    const currentDay = currentDate.getDay();
    const currentTime = currentDate.getTime();
    
    // Get the start of the week (Sunday)
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - currentDay);
    startDate.setHours(0, 0, 0, 0);
    
    // Get the end of the week (Saturday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 6);
    endDate.setHours(23, 59, 59, 999);
    
    return {
        startDate,
        endDate,
        currentDate: currentDate
    };
}

// Show notification to the user
export function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotification = document.getElementById('notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.id = 'notification';
    
    // Set notification classes based on type
    const baseClasses = 'fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white font-medium max-w-md z-50 transition-all duration-300 transform translate-y-2 opacity-0';
    let typeClasses = '';
    
    switch (type) {
        case 'success':
            typeClasses = 'bg-green-500';
            break;
        case 'error':
            typeClasses = 'bg-red-500';
            break;
        case 'warning':
            typeClasses = 'bg-yellow-500';
            break;
        case 'info':
        default:
            typeClasses = 'bg-blue-500';
            break;
    }
    
    notification.className = `${baseClasses} ${typeClasses}`;
    notification.textContent = message;
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
        notification.classList.remove('translate-y-2', 'opacity-0');
        notification.classList.add('translate-y-0', 'opacity-100');
    }, 10);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('translate-y-0', 'opacity-100');
        notification.classList.add('translate-y-2', 'opacity-0');
        
        // Remove from DOM after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Export all functions
export {
    formatDate,
    getDayOfWeek,
    getWeekRange,
    showNotification
};

// Add to window for backward compatibility
window.utils = {
    formatDate,
    getDayOfWeek,
    getWeekRange,
    showNotification
};

// Also add individual functions to window
window.formatDate = formatDate;
window.getDayOfWeek = getDayOfWeek;
window.getWeekRange = getWeekRange;
window.showNotification = showNotification;

// Initialize utility functions when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add any initialization code here if needed
});

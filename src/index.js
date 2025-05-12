// Re-export all necessary modules
export * from './config.js';
export * from './utils.js';
export * from './agenda.js';
export * from './main.js';
// Add any other exports you need

// Initialize the app when imported
// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.initApp) {
            window.initApp();
        } else {
            console.error('initApp function not found on window object');
        }
    });
} else {
    if (window.initApp) {
        window.initApp();
    } else {
        console.error('initApp function not found on window object');
    }
}

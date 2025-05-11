/**
 * Main Application Module
 * Handles initialization and event listeners for the scheduling interface
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize form elements
    const citySelect = document.getElementById('city');
    const condominiumSelect = document.getElementById('condominium');
    
    // Populate cities dropdown
    function populateCities() {
        const cities = Object.keys(window.CONFIG.locations);
        
        cities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
    
    // Update condominiums dropdown based on selected city
    function updateCondominiums() {
        const selectedCity = citySelect.value;
        const condominiums = window.CONFIG.locations[selectedCity] || [];
        
        // Clear and disable condominium select
        condominiumSelect.innerHTML = '<option value="">Selecione um condomínio</option>';
        
        if (selectedCity && condominiums.length > 0) {
            condominiumSelect.disabled = false;
            
            // Add condominium options
            condominiums.forEach(condominium => {
                const option = document.createElement('option');
                option.value = condominium;
                option.textContent = condominium;
                condominiumSelect.appendChild(option);
            });
        } else {
            condominiumSelect.disabled = true;
        }
        
        // Hide agenda when city changes
        document.getElementById('agenda-container').classList.add('hidden');
    }
    
    // Handle form submission
    function handleFormSubmit() {
        const city = citySelect.value;
        const condominium = condominiumSelect.value;
        
        if (!city || !condominium) {
            window.utils.showNotification('Por favor, selecione uma cidade e um condomínio', 'warning');
            return;
        }
        
        // Load agenda for the selected location
        window.agendaManager.loadAgenda(city, condominium);
    }
    
    // Initialize the application
    function init() {
        // Populate initial data
        populateCities();
        
        // Set up event listeners
        citySelect.addEventListener('change', updateCondominiums);
        condominiumSelect.addEventListener('change', handleFormSubmit);
        
        // Add debounced resize handler
        window.addEventListener('resize', window.utils.debounce(() => {
            if (window.agendaManager) {
                window.agendaManager.renderAgenda();
            }
        }, 250));
        
        // Show initial state
        updateCondominiums();
    }
    
    // Start the application
    init();
});

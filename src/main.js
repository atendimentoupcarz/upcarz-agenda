/**
 * Main application entry point
 * Handles DOM initialization and event listeners
 */

// Expose the init function to the global scope
window.main = {
    init: function() {
        try {
            console.log('Initializing Upcarz Scheduler...');
            // Initialize the agenda manager
            window.agendaManager = new AgendaManager();
            
            // Set up event listeners
            setupEventListeners();
            
            // Load the initial data
            loadInitialData();
            
            console.log('Upcarz Scheduler initialized successfully');
        } catch (error) {
            console.error('Error initializing application:', error);
            // Show error message to the user
            if (window.utils && window.utils.showNotification) {
                window.utils.showNotification(
                    'Ocorreu um erro ao carregar o aplicativo. Por favor, recarregue a página.',
                    'error'
                );
            } else {
                alert('Erro ao carregar o aplicativo. Por favor, recarregue a página.');
            }
        }
    }
};

// Initialize when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.main.init);
} else {
    // DOM is already ready
    window.main.init();
}

/**
 * Set up event listeners
 */
function setupEventListeners() {
    // City selection change (disabled since we only have Jundiaí)
    const citySelect = document.getElementById('city');
    if (citySelect) {
        citySelect.disabled = true; // Disable city selection
        citySelect.addEventListener('change', updateCondominiums);
    }
    
    // Form submission
    const form = document.getElementById('schedule-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Back button in agenda view
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', showFormView);
    }
}

/**
 * Show the form view and hide the agenda view
 */
function showFormView() {
    const formSection = document.getElementById('form-section');
    const agendaSection = document.getElementById('agenda-section');
    
    if (formSection && agendaSection) {
        formSection.classList.remove('hidden');
        agendaSection.classList.add('hidden');
        
        // Reset form
        const form = document.getElementById('schedule-form');
        if (form) form.reset();
        
        // Clear any selected time slot
        if (window.agendaManager) {
            window.agendaManager.clearSelection();
        }
    }
}

/**
 * Update condominiums dropdown based on selected city
 */
function updateCondominiums() {
    const citySelect = document.getElementById('city');
    const condominiumSelect = document.getElementById('condominium');
    
    if (!citySelect || !condominiumSelect) return;
    
    const selectedCity = citySelect.value;
    const condominiums = window.CONFIG.city.condominiums || [];
    
    // Clear existing options
    condominiumSelect.innerHTML = '<option value="">Selecione um condomínio</option>';
    
    // Add new options
    condominiums.forEach(condo => {
        const option = document.createElement('option');
        option.value = condo.slug;
        option.textContent = condo.name;
        condominiumSelect.appendChild(option);
    });
}

/**
 * Handle form submission
 * @param {Event} event - Form submit event
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    const citySelect = document.getElementById('city');
    const condominiumSelect = document.getElementById('condominium');
    
    if (!citySelect || !condominiumSelect) return;
    
    const city = citySelect.value;
    const condominiumSlug = condominiumSelect.value;
    
    if (!city || !condominiumSlug) {
        window.utils.showNotification('Por favor, selecione um condomínio.', 'warning');
        return;
    }
    
    // Load agenda data for the selected condominium
    loadAgendaData(city, condominiumSlug);
}

/**
 * Load initial data
 */
function loadInitialData() {
    try {
        // Set the city to Jundiaí
        const citySelect = document.getElementById('city');
        if (citySelect) {
            citySelect.innerHTML = `
                <option value="Jundiaí" selected>Jundiaí</option>
            `;
        }
        
        // Update condominiums for the selected city
        updateCondominiums();
        
        // Enable the condominium select
        const condominiumSelect = document.getElementById('condominium');
        if (condominiumSelect) {
            condominiumSelect.disabled = false;
        }
    } catch (error) {
        console.error('Error loading initial data:', error);
        window.utils.showNotification(
            'Ocorreu um erro ao carregar a lista de condomínios. Por favor, recarregue a página.',
            'error'
        );
    }
}

/**
 * Load agenda data for a specific city and condominium
 * @param {string} city - City name
 * @param {string} condominiumSlug - Condominium slug
 */
async function loadAgendaData(city, condominiumSlug) {
    // Show loading state
    const submitButton = document.querySelector('#schedule-form button[type="submit"]');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = `
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Carregando...
        `;
    }
    
    try {
        // In a real app, this would fetch from an API
        // For now, we'll use the local JSON file
        // Normalize city name by removing accents and spaces
        const normalizeString = (str) => {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');
        };
        
        const normalizedCity = normalizeString(city);
        const normalizedSlug = normalizeString(condominiumSlug);
        const fileName = `${normalizedCity}_${normalizedSlug}.json`;
        
        // Get the base URL for the current environment
        const baseUrl = window.location.hostname === 'localhost' ? '' : '/upcarz-agenda';
        
        // Try different path formats to work in both local and GitHub Pages environments
        const pathsToTry = [
            `${baseUrl}/data/${fileName}`,  // Production path with base URL
            `data/${fileName}`,             // Local development
            `/data/${fileName}`,            // Alternative local path
            `./data/${fileName}`            // Another alternative local path
        ];
        
        // Function to try loading from a path
        const tryLoadPath = async (pathIndex) => {
            if (pathIndex >= pathsToTry.length) {
                throw new Error('Failed to load data from any path');
            }
            
            const path = pathsToTry[pathIndex];
            console.log(`Trying to load from: ${path}`);
            
            try {
                const response = await fetch(path);
                if (!response.ok) {
                    console.warn(`Response not OK for ${path}:`, response.status, response.statusText);
                    throw new Error('Not found');
                }
                console.log(`Successfully loaded from: ${path}`);
                return { response, path };
            } catch (error) {
                console.warn(`Failed to load from ${path}:`, error);
                return tryLoadPath(pathIndex + 1);
            }
        };
        
        // Start trying paths
        const { response, path } = await tryLoadPath(0);
        console.log(`Successfully loaded data from: ${path}`);
        const data = await response.json();
        console.log('Loaded data:', data);
        
        // Update the UI with the loaded data
        window.agendaManager.setAgendaData(data);
        
        // Initialize the agenda with the current week
        window.agendaManager.init();
        
        // Show the agenda section
        const formSection = document.getElementById('form-section');
        const agendaSection = document.getElementById('agenda-section');
        
        if (formSection && agendaSection) {
            formSection.classList.add('hidden');
            agendaSection.classList.remove('hidden');
            
            // Scroll to the agenda section
            setTimeout(() => {
                agendaSection.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    } catch (error) {
        console.error('Error loading agenda data:', error);
        if (window.utils && window.utils.showNotification) {
            window.utils.showNotification(
                'Não foi possível carregar os horários disponíveis. Por favor, tente novamente.',
                'error'
            );
        } else {
            alert('Erro ao carregar os horários. Por favor, tente novamente.');
        }
    } finally {
        // Reset loading state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.textContent = 'Verificar Disponibilidade';
        }
    }
}

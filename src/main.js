import { CONFIG } from './config.js';
import { showNotification } from './utils.js';
import { AgendaManager } from './agenda.js';

// Main application initialization
console.log('Initializing Upcarz Scheduler...');

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

export function initApp() {
    try {
        // Initialize the agenda manager
        window.agendaManager = new AgendaManager();
        window.agendaManager.init();
        
        // Initial render
        renderHomeView();
        
        console.log('Upcarz Scheduler initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Ocorreu um erro ao inicializar o aplicativo. Por favor, recarregue a página.');
    }
}

// Initialize global variables for backward compatibility
window.CONFIG = CONFIG;
window.showNotification = showNotification;

// Helper function to show error messages
export function showError(message) {
    alert(`Erro: ${message}`);
    console.error(message);
}

// Add to window for backward compatibility
window.showError = showError;

// Export functions to global scope
export function renderHomeView() {
    const app = document.getElementById('app');
    if (!app) return;
    
    app.innerHTML = `
        <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <!-- Header -->
            <div class="bg-blue-600 p-6 text-white">
                <h1 class="text-2xl md:text-3xl font-bold">Agendamento Upcarz</h1>
                <p class="mt-2">Agende sua lavagem de carro em Jundiaí</p>
            </div>
            
            <!-- Main Content -->
            <div class="p-6">
                <!-- Selection Form -->
                <div id="form-section">
                    <form id="schedule-form" class="space-y-6">
                        <div class="grid grid-cols-1 gap-6">
                            <!-- City Selection (Disabled, only Jundiaí) -->
                            <div>
                                <label for="city" class="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
                                <select id="city" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" disabled>
                                    <option value="Jundiaí" selected>Jundiaí</option>
                                </select>
                            </div>
                            
                            <!-- Condominium Selection -->
                            <div>
                                <label for="condominium" class="block text-sm font-medium text-gray-700 mb-1">Condomínio</label>
                                <select id="condominium" class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                                    <option value="">Selecione um condomínio</option>
                                </select>
                            </div>
                            
                            <div class="mt-2 text-sm text-gray-500">
                                <p>Horários disponíveis em intervalos de 30 minutos, das 08:00 às 17:30.</p>
                            </div>
                        </div>
                        
                        <div class="flex justify-end">
                            <button type="submit" class="btn btn-primary flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                                </svg>
                                Verificar Disponibilidade
                            </button>
                        </div>
                    </form>
                </div>
                
                <!-- Agenda Container -->
                <div id="agenda-section" class="hidden mt-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold text-gray-800">Horários Disponíveis</h2>
                        <button id="back-button" class="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
                            </svg>
                            Voltar
                        </button>
                    </div>
                    
                    <!-- Loading State -->
                    <div id="loading-state" class="hidden flex justify-center items-center py-12">
                        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                    
                    <!-- Agenda Content -->
                    <div id="agenda-container" class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div id="agenda">
                            <p class="text-center text-gray-500 py-8">Selecione um condomínio para ver os horários disponíveis.</p>
                        </div>
                    </div>
                    
                    <!-- Legend -->
                    <div class="mt-6 flex flex-wrap gap-4 text-sm text-gray-600">
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-green-100 border border-green-300 rounded mr-2"></span>
                            Disponível
                        </div>
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2"></span>
                            Indisponível
                        </div>
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-gray-100 border border-gray-300 rounded mr-2"></span>
                            Fora do horário
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Footer -->
            <div class="bg-gray-50 px-6 py-4 border-t border-gray-200">
                <p class="text-center text-sm text-gray-500">
                    © ${new Date().getFullYear()} Upcarz - Todos os direitos reservados
                </p>
            </div>
        </div>
    `;
    
    // Set up event listeners
    setupEventListeners();
};

function setupEventListeners() {
    // Form submission
    const form = document.getElementById('schedule-form');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Back button
    const backButton = document.getElementById('back-button');
    if (backButton) {
        backButton.addEventListener('click', showFormView);
    }
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const condominiumSelect = document.getElementById('condominium');
    if (!condominiumSelect) return;
    
    const city = 'Jundiaí';
    const condominium = condominiumSelect.value;
    
    if (!condominium) {
        showError('Por favor, selecione um condomínio.');
        return;
    }
    
    try {
        // Show loading state
        const loadingState = document.getElementById('loading-state');
        const formSection = document.getElementById('form-section');
        const agendaSection = document.getElementById('agenda-section');
        
        if (loadingState && formSection && agendaSection) {
            formSection.classList.add('hidden');
            agendaSection.classList.remove('hidden');
            loadingState.classList.remove('hidden');
            
            // Load agenda data
            await window.agendaManager.loadAgenda(city, condominium);
            
            // Hide loading state
            loadingState.classList.add('hidden');
        }
    } catch (error) {
        console.error('Error handling form submission:', error);
        showError('Não foi possível carregar os horários disponíveis. Por favor, tente novamente.');
        showFormView();
    }
}

function showFormView() {
    const formSection = document.getElementById('form-section');
    const agendaSection = document.getElementById('agenda-section');
    
    if (formSection && agendaSection) {
        formSection.classList.remove('hidden');
        agendaSection.classList.add('hidden');
    }
}

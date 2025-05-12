import { CONFIG } from './config.js';
import { showNotification } from './utils.js';
import { AgendaManager } from './agenda.js';

// Show error message
function showError(message) {
    console.error(message);
    alert(`Erro: ${message}`);
}

// Render home view
function renderHomeView() {
    try {
        const app = document.getElementById('app');
        if (!app) return;
        
        // Initial render content
        app.innerHTML = `
            <div class="max-w-4xl mx-auto">
                <div class="text-center py-8">
                    <h1 class="text-3xl font-bold text-gray-800">Agendamento Upcarz</h1>
                    <p class="mt-2 text-gray-600">Selecione um condomínio para ver os horários disponíveis</p>
                    
                    <div class="mt-4">
                        <select id="condominium" class="w-64 px-4 py-2 border rounded-md">
                            <option value="">Selecione um condomínio</option>
                            <option value="ViladaTerra">Vila da Terra</option>
                            <option value="ViladoBosque">Vila do Bosque</option>
                            <option value="ViladosLagos">Vila dos Lagos</option>
                            <option value="CantodaNatureza">Canto da Natureza</option>
                        </select>
                    </div>
                </div>
                <div id="agenda">
                    <!-- Agenda will be rendered here -->
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error rendering home view:', error);
        showError('Erro ao carregar a página inicial');
    }
}

// Initialize the application
function initializeApplication() {
    try {
        console.log('Initializing Upcarz Scheduler...');
        
        // Initialize the agenda manager
        window.agendaManager = new AgendaManager();
        window.agendaManager.init();
        
        // Initial render
        renderHomeView();
        
        // Set up event listeners
        const condominioSelect = document.getElementById('condominium');
        if (condominioSelect) {
            condominioSelect.addEventListener('change', (e) => {
                const condominio = e.target.value;
                if (condominio) {
                    window.agendaManager.loadAgenda('Jundiai', condominio);
                }
            });
        }
        
        console.log('Upcarz Scheduler initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showError('Ocorreu um erro ao inicializar o aplicativo. Por favor, recarregue a página.');
    }
}

// Initialize global variables for backward compatibility
window.CONFIG = CONFIG;
window.showNotification = showNotification;
window.showError = showError;
window.renderHomeView = renderHomeView;

// Initialize the app when the DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApplication);
} else {
    initializeApplication();
}

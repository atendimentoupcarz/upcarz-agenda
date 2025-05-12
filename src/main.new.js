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
                            <option value="cantodanatureza">Canto da Natureza</option>
                            <option value="villadaterra">Vila da Terra</option>
                            <option value="villabosque">Vila do Bosque</option>
                            <option value="villadoslagos">Vila dos Lagos</option>
                            <option value="villamontesiena">Vila Monte Siena</option>
                            <option value="villanatureza">Vila Natureza</option>
                            <option value="villapark">Vila Park</option>
                            <option value="villareal">Vila Real</option>
                            <option value="villareale">Villa Reale</option>
                            <option value="villaregina">Vila Régia</option>
                            <option value="villaregina2">Vila Regina II</option>
                            <option value="villaregina3">Vila Regina III</option>
                            <option value="villaregina4">Vila Regina IV</option>
                            <option value="villaregina5">Vila Regina V</option>
                            <option value="villareginanovo">Vila Regina Novo</option>
                            <option value="villareginav">Vila Regina V</option>
                            <option value="villareginavi">Vila Regina VI</option>
                            <option value="villareginavii">Vila Regina VII</option>
                            <option value="villareginaviii">Vila Regina VIII</option>
                            <option value="villareginaix">Vila Regina IX</option>
                            <option value="villareginax">Vila Regina X</option>
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
                    window.agendaManager.loadAgenda('Jundiaí', condominio);
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

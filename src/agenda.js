/**
 * Agenda Management Module
 * Handles the rendering and interaction with the weekly agenda
 */

class AgendaManager {
    constructor() {
        this.currentWeekStart = null;
        this.agendaData = null;
        this.selectedDate = null;
        this.selectedTime = null;
        
        // Bind methods
        this.init = this.init.bind(this);
        this.loadAgenda = this.loadAgenda.bind(this);
        this.renderAgenda = this.renderAgenda.bind(this);
        this.changeWeek = this.changeWeek.bind(this);
        this.selectTimeSlot = this.selectTimeSlot.bind(this);
        this.updateWeekNavigation = this.updateWeekNavigation.bind(this);
    }
    
    /**
     * Initialize the agenda with the current week
     */
    init() {
        this.currentWeekStart = new Date();
        // Reset to the start of the current week
        const weekRange = window.utils.getWeekRange(this.currentWeekStart);
        this.currentWeekStart = weekRange.startDate;
        
        // Set up event listeners
        document.getElementById('prev-week').addEventListener('click', () => this.changeWeek(-1));
        document.getElementById('next-week').addEventListener('click', () => this.changeWeek(1));
        
        // Initial render
        this.updateWeekNavigation();
    }
    
    /**
     * Load agenda data for the selected city and condominium
     * @param {string} city - The selected city
     * @param {string} condominium - The selected condominium
     */
    async loadAgenda(city, condominium) {
        const loadingElement = document.getElementById('loading');
        const agendaContainer = document.getElementById('agenda-container');
        
        try {
            // Show loading state
            loadingElement.classList.remove('hidden');
            agendaContainer.classList.add('hidden');
            
            // In a real implementation, this would be an API call to Google Sheets
            const sheetName = window.getSheetName(city, condominium);
            const fileName = window.LOCAL_DATA_MAPPING[sheetName];
            
            if (!fileName) {
                throw new Error('Dados não encontrados para o condomínio selecionado');
            }
            
            // For demo purposes, we're loading from local JSON files
            const response = await fetch(`${window.CONFIG.localDataPath}${fileName}`);
            
            if (!response.ok) {
                throw new Error('Falha ao carregar a agenda');
            }
            
            this.agendaData = await response.json();
            
            // Render the agenda with the loaded data
            this.renderAgenda();
            
            // Show the agenda container
            agendaContainer.classList.remove('hidden');
        } catch (error) {
            console.error('Error loading agenda:', error);
            window.utils.showNotification(error.message, 'error');
        } finally {
            loadingElement.classList.add('hidden');
        }
    }
    
    /**
     * Render the agenda with the current week's data
     */
    renderAgenda() {
        if (!this.agendaData) return;
        
        const agendaElement = document.getElementById('agenda');
        const weekDates = window.utils.getWeekDates(this.currentWeekStart);
        
        // Create the header row with weekdays
        let agendaHTML = `
            <div class="grid grid-cols-1 md:grid-cols-7 gap-0 border-b border-gray-200">
                <div class="hidden md:block"></div> <!-- Empty cell for time slots column -->
                ${weekDates.map(date => {
                    const isToday = date.toDateString() === new Date().toDateString();
                    const dayClass = isToday ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-700';
                    return `
                        <div class="p-3 text-center border-r border-gray-200 ${dayClass}">
                            <div class="text-sm font-medium">${date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                            <div class="text-lg">${date.getDate()}</div>
                        </div>`;
                }).join('')}
            </div>
        `;
        
        // Add time slots for each period
        const timeSlots = window.CONFIG.timeSlots;
        
        Object.entries(timeSlots).forEach(([period, { start, end, label }]) => {
            // Add period label
            agendaHTML += `
                <div class="border-b border-gray-200 last:border-b-0">
                    <div class="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-500">${label}</div>
                    <div class="grid grid-cols-1 md:grid-cols-7 gap-0">
            `;
            
            // Add time slots for each day of the week
            for (let hour = start; hour <= end; hour++) {
                // Time slot label (first column)
                if (hour === start) {
                    agendaHTML += `
                        <div class="p-3 text-sm text-gray-500 border-r border-gray-200 flex items-center justify-center">
                            ${window.utils.formatTime(hour)}
                        </div>
                    `;
                } else {
                    // Empty cells for the time slot label column
                    agendaHTML += '<div class="hidden md:block"></div>';
                }
                
                // Time slots for each day
                weekDates.forEach((date, dayIndex) => {
                    const dateStr = date.toISOString().split('T')[0];
                    const isAvailable = this.isTimeSlotAvailable(dateStr, hour);
                    const isPast = this.isPastTimeSlot(date, hour);
                    const isSelected = this.selectedDate === dateStr && this.selectedTime === hour;
                    
                    let buttonClass = 'time-slot w-full py-2 px-1 text-sm rounded transition-colors ';
                    
                    if (isSelected) {
                        buttonClass += 'bg-blue-600 text-white';
                    } else if (isPast) {
                        buttonClass += 'bg-gray-100 text-gray-400 cursor-not-allowed';
                    } else if (isAvailable) {
                        buttonClass += 'bg-green-100 text-green-800 hover:bg-green-200';
                    } else {
                        buttonClass += 'bg-red-50 text-red-600 line-through cursor-not-allowed';
                    }
                    
                    agendaHTML += `
                        <div class="p-1 border-r border-b border-gray-100">
                            <button 
                                class="${buttonClass}"
                                data-date="${dateStr}"
                                data-time="${hour}"
                                ${!isAvailable || isPast ? 'disabled' : ''}
                                onclick="window.agendaManager.selectTimeSlot('${dateStr}', ${hour})"
                            >
                                ${isAvailable ? 'Disponível' : 'Indisponível'}
                            </button>
                        </div>
                    `;
                });
            }
            
            agendaHTML += '</div></div>';
        });
        
        agendaElement.innerHTML = agendaHTML;
    }
    
    /**
     * Check if a time slot is available
     * @param {string} date - Date string in YYYY-MM-DD format
     * @param {number} hour - Hour in 24h format
     * @returns {boolean} True if the time slot is available
     */
    isTimeSlotAvailable(date, hour) {
        if (!this.agendaData || !this.agendaData.availability) return false;
        
        const dateData = this.agendaData.availability[date];
        if (!dateData) return false;
        
        return dateData.some(slot => {
            const [startHour, endHour] = slot.time.split('-').map(Number);
            return hour >= startHour && hour < endHour && slot.available;
        });
    }
    
    /**
     * Check if a time slot is in the past
     * @param {Date} date - Date object
     * @param {number} hour - Hour in 24h format
     * @returns {boolean} True if the time slot is in the past
     */
    isPastTimeSlot(date, hour) {
        const now = new Date();
        const slotDate = new Date(date);
        slotDate.setHours(hour, 0, 0, 0);
        
        return slotDate < now;
    }
    
    /**
     * Change the current week by the specified number of weeks
     * @param {number} weeks - Number of weeks to change (can be negative)
     */
    changeWeek(weeks) {
        this.currentWeekStart.setDate(this.currentWeekStart.getDate() + (weeks * 7));
        this.updateWeekNavigation();
        this.renderAgenda();
    }
    
    /**
     * Update the week navigation display
     */
    updateWeekNavigation() {
        const weekRange = window.utils.getWeekRange(this.currentWeekStart);
        const weekRangeElement = document.getElementById('week-range');
        
        const startDate = weekRange.startDate.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'short' 
        });
        
        const endDate = weekRange.endDate.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
        
        weekRangeElement.textContent = `${startDate} - ${endDate}`;
        
        // Disable previous week button if we're in the current week
        const prevWeekButton = document.getElementById('prev-week');
        const today = new Date();
        const currentWeekStart = window.utils.getWeekRange(today).startDate;
        
        prevWeekButton.disabled = 
            this.currentWeekStart.toDateString() === currentWeekStart.toDateString();
    }
    
    /**
     * Handle time slot selection
     * @param {string} date - Selected date in YYYY-MM-DD format
     * @param {number} time - Selected hour in 24h format
     */
    selectTimeSlot(date, time) {
        // In a real implementation, this would open a booking modal
        this.selectedDate = date;
        this.selectedTime = time;
        
        // Re-render to show the selected state
        this.renderAgenda();
        
        // Show a confirmation message (in a real app, this would open a booking form)
        const formattedDate = new Date(date).toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        });
        
        const formattedTime = window.utils.formatTime(time);
        
        window.utils.showNotification(
            `Você selecionou ${formattedDate} às ${formattedTime}. Em breve, você poderá confirmar o agendamento aqui.`,
            'info'
        );
    }
}

// Initialize the agenda manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agendaManager = new AgendaManager();
    window.agendaManager.init();
});

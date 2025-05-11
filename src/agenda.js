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
    /**
     * Set the agenda data and re-render the agenda
     * @param {Object} data - The agenda data to display
     */
    setAgendaData(data) {
        console.log('Setting agenda data:', data);
        this.agendaData = data;
        // If we already have a week start, re-render with the new data
        if (this.currentWeekStart) {
            this.renderAgenda();
        }
    }
    
    init() {
        this.currentWeekStart = new Date();
        // Reset to the start of the current week
        const weekRange = window.utils.getWeekRange(this.currentWeekStart);
        this.currentWeekStart = weekRange.startDate;
        
        // Set up event listeners
        const prevWeekBtn = document.getElementById('prev-week');
        const nextWeekBtn = document.getElementById('next-week');
        
        if (prevWeekBtn) {
            prevWeekBtn.addEventListener('click', () => this.changeWeek(-1));
        }
        
        if (nextWeekBtn) {
            nextWeekBtn.addEventListener('click', () => this.changeWeek(1));
        }
        
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
        
        // Create the header with micro region info
        let agendaHTML = `
            <div class="bg-blue-50 p-4 mb-4 rounded-lg">
                <h3 class="text-lg font-semibold">${this.agendaData.condominio}</h3>
                <p class="text-sm text-gray-600">
                    Cidade: ${this.agendaData.cidade}
                </p>
                <p class="text-sm text-gray-600">
                    Micro Região: ${window.CONFIG.microRegions[this.agendaData.microRegiao]}
                </p>
            </div>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white">
                    <thead>
                        <tr class="border-b border-gray-200">
                            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horário</th>
                            ${weekDates.map(date => {
                                const isToday = date.toDateString() === new Date().toDateString();
                                const dayClass = isToday ? 'bg-blue-50 text-blue-700' : 'text-gray-700';
                                return `
                                    <th class="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${dayClass}">
                                        <div class="font-medium">${date.toLocaleDateString('pt-BR', { weekday: 'short' })}</div>
                                        <div class="text-lg font-semibold">${date.getDate()}</div>
                                    </th>`;
                            }).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
        `;
        
        // Add time slots for each period
        Object.entries(window.CONFIG.timeSlots).forEach(([period, { label, slots }]) => {
            // Add period label row
            agendaHTML += `
                <tr class="bg-gray-50">
                    <td colspan="${weekDates.length + 1}" class="px-4 py-2 text-sm font-medium text-gray-700">
                        ${label}
                    </td>
                </tr>
            `;

            // Add 30-minute slots
            slots.forEach(timeSlot => {
                const [hour, minute] = timeSlot.split(':').map(Number);
                const timeSlotStr = `${hour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
                
                agendaHTML += `
                    <tr class="hover:bg-gray-50">
                        <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 border-r">
                            ${timeSlotStr}
                        </td>
                `;

                // Add cells for each day of the week
                weekDates.forEach(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const slotKey = timeSlotStr;
                    const isAvailable = this.isTimeSlotAvailable(dateStr, slotKey);
                    const isPast = this.isPastTimeSlot(date, hour, minute);
                    const isSelected = this.selectedDate === dateStr && this.selectedTime === slotKey;
                    const slotExists = this.doesTimeSlotExist(dateStr, slotKey);
                    
                    let cellClass = 'px-1 py-2 text-center text-sm border-r border-gray-200 ';
                    let buttonClass = 'w-full py-1 px-1 rounded transition-colors text-xs ';
                    
                    if (isSelected) {
                        buttonClass += 'bg-blue-600 text-white';
                    } else if (isPast || !slotExists) {
                        buttonClass += 'bg-gray-100 text-gray-400 cursor-not-allowed';
                        if (!slotExists) {
                            buttonClass += ' opacity-50';
                        }
                    } else if (isAvailable) {
                        buttonClass += 'bg-green-100 text-green-800 hover:bg-green-200';
                    } else {
                        buttonClass += 'bg-red-50 text-red-600 line-through cursor-not-allowed';
                    }
                    
                    agendaHTML += `
                        <td class="${cellClass}">
                            <button 
                                class="${buttonClass} time-slot"
                                data-date="${dateStr}"
                                data-time="${slotKey}"
                                ${!isAvailable || isPast || !slotExists ? 'disabled' : ''}
                                onclick="window.agendaManager.selectTimeSlot('${dateStr}', '${slotKey}')"
                            >
                                ${slotExists ? (isAvailable ? '✓' : '✕') : '—'}
                            </button>
                        </td>
                    `;
                });

                agendaHTML += '</tr>';
            });
        });

        agendaHTML += `
                    </tbody>
                </table>
            </div>
        `;
        
        agendaElement.innerHTML = agendaHTML;
    }
    
    /**
     * Check if a time slot exists in the data
     * @param {string} date - Date string in YYYY-MM-DD format
     * @param {string} timeSlot - Time slot in 'HH:MM' format
     * @returns {boolean} True if the time slot exists in the data
     */
    doesTimeSlotExist(date, timeSlot) {
        if (!this.agendaData || !this.agendaData.horariosDisponiveis) return false;
        
        const dayOfWeek = window.utils.getDayOfWeek(new Date(date));
        const period = parseInt(timeSlot.split(':')[0]) < 12 ? 'manha' : 'tarde';
        
        const daySlots = this.agendaData.horariosDisponiveis[dayOfWeek];
        if (!daySlots) return false;
        
        const periodSlots = daySlots[period];
        if (!periodSlots) return false;
        
        return periodSlots.includes(timeSlot);
    }
    
    /**
     * Check if a time slot is available
     * @param {string} date - Date string in YYYY-MM-DD format
     * @param {string} timeSlot - Time slot in 'HH:MM' format
     * @returns {boolean} True if the time slot is available
     */
    isTimeSlotAvailable(date, timeSlot) {
        // In our current implementation, if a time slot exists, it's available
        // This can be enhanced later to handle booked slots
        return this.doesTimeSlotExist(date, timeSlot);
    }
    
    /**
     * Check if a time slot is in the past
     * @param {Date} date - Date object
     * @param {number} hour - Hour in 24h format
     * @param {number} minute - Minute (0 or 30)
     * @returns {boolean} True if the time slot is in the past
     */
    isPastTimeSlot(date, hour, minute) {
        const now = new Date();
        const slotDate = new Date(date);
        
        // Set the time for the slot
        const [slotHour, slotMinute] = [parseInt(hour), parseInt(minute) || 0];
        slotDate.setHours(slotHour, slotMinute, 0, 0);
        
        // Create a date object for comparison at the start of today
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        
        // If the slot date is before today, it's definitely in the past
        if (slotDate < today) {
            return true;
        }
        
        // If it's today, check the time
        if (slotDate.toDateString() === now.toDateString()) {
            return slotDate < now;
        }
        
        return false;
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
     * @param {string} timeSlot - Selected time slot in 'HH:MM' format
     */
    selectTimeSlot(date, timeSlot) {
        // In a real implementation, this would open a booking modal
        this.selectedDate = date;
        this.selectedTime = timeSlot;
        
        // Re-render to show the selected state
        this.renderAgenda();
        
        // Format the date in a user-friendly way
        const dateObj = new Date(date);
        const dayOfWeek = window.utils.getDayOfWeek(dateObj);
        const dayNames = {
            'domingo': 'Domingo',
            'segunda': 'Segunda-feira',
            'terca': 'Terça-feira',
            'quarta': 'Quarta-feira',
            'quinta': 'Quinta-feira',
            'sexta': 'Sexta-feira',
            'sabado': 'Sábado'
        };
        
        const formattedDate = dateObj.toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long'
        });
        
        window.utils.showNotification(
            `Você selecionou ${dayNames[dayOfWeek]}, ${formattedDate} às ${timeSlot}.`,
            'info'
        );
    }
}

// Initialize the agenda manager when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.agendaManager = new AgendaManager();
    window.agendaManager.init();
});

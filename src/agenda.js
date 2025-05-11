/**
 * Agenda Manager - Handles all agenda-related functionality
 */
class AgendaManager {
    constructor() {
        this.currentDate = new Date();
        this.currentCity = null;
        this.currentCondominium = null;
        this.agendaData = null;
        this.bookedSlots = new Set();
        this.selectedDate = null;
        this.selectedTime = null;
    }

    /**
     * Initialize the agenda manager
     */
    init() {
        try {
            console.log('Initializing AgendaManager...');
            this.setupEventListeners();
            this.populateCondominiumSelect();
            console.log('AgendaManager initialized');
        } catch (error) {
            console.error('Error initializing AgendaManager:', error);
            throw error;
        }
    }

    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Previous week button
        document.addEventListener('click', (e) => {
            if (e.target && e.target.closest('#prev-week')) {
                this.navigateWeek(-1);
            }
        });

        // Next week button
        document.addEventListener('click', (e) => {
            if (e.target && e.target.closest('#next-week')) {
                this.navigateWeek(1);
            }
        });

        // Time slot selection
        document.addEventListener('click', (e) => {
            if (e.target && e.target.closest('.time-slot')) {
                this.handleTimeSlotClick(e);
            }
        });

        // Form submission
        const bookingForm = document.getElementById('booking-form');
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitBooking();
            });
        }
    }

    /**
     * Handle time slot click
     * @param {Event} event - The click event
     */
    handleTimeSlotClick(event) {
        const button = event.target.closest('.time-slot');
        if (!button || button.disabled) return;
        
        const time = button.dataset.time;
        const date = button.dataset.date;
        
        if (!date || !time) return;
        
        this.selectedDate = date;
        this.selectedTime = time;
        
        // Show booking form
        this.showBookingForm(date, time);
    }

    /**
     * Show booking form/modal
     * @param {string} date - The selected date
     * @param {string} time - The selected time
     */
    showBookingForm(date, time) {
        const form = document.getElementById('booking-form');
        if (!form) return;
        
        // Set the selected date and time in the form
        const dateDisplay = document.getElementById('selected-date');
        const timeDisplay = document.getElementById('selected-time');
        
        if (dateDisplay) dateDisplay.textContent = date;
        if (timeDisplay) timeDisplay.textContent = time;
        
        // Show the form
        form.classList.remove('hidden');
    }
    
    /**
     * Submit a booking
     */
    async submitBooking() {
        const nameInput = document.getElementById('client-name');
        const phoneInput = document.getElementById('client-phone');
        const emailInput = document.getElementById('client-email');
        
        if (!nameInput || !phoneInput || !emailInput || !this.selectedDate || !this.selectedTime) {
            window.showNotification('Por favor, preencha todos os campos.', 'error');
            return;
        }
        
        const bookingData = {
            name: nameInput.value.trim(),
            phone: phoneInput.value.trim(),
            email: emailInput.value.trim(),
            date: this.selectedDate,
            time: this.selectedTime,
            city: this.currentCity,
            condominium: this.currentCondominium,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        try {
            // In a real app, this would be an API call
            console.log('Submitting booking:', bookingData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Show success message
            window.showNotification('Agendamento realizado com sucesso!', 'success');
            
            // Reset form
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                bookingForm.reset();
                bookingForm.classList.add('hidden');
            }
            
            // Reload agenda to show updated availability
            if (this.currentCity && this.currentCondominium) {
                await this.loadAgenda(this.currentCity, this.currentCondominium);
            }
            
            // Reset selection
            this.selectedDate = null;
            this.selectedTime = null;
            
        } catch (error) {
            console.error('Error submitting booking:', error);
            window.showNotification('Não foi possível realizar o agendamento. Por favor, tente novamente.', 'error');
        }
    }
    
    /**
     * Load agenda for a specific city and condominium
     * @param {string} city - The city name
     * @param {string} condominium - The condominium ID
     */
    async loadAgenda(city, condominium) {
        try {
            this.currentCity = city;
            this.currentCondominium = condominium;
            
            // Show loading state
            const agendaContainer = document.getElementById('agenda');
            if (agendaContainer) {
                agendaContainer.innerHTML = '<div class="text-center py-8">Carregando...</div>';
            }
            
            // Fetch agenda data
            this.agendaData = await this.fetchAgendaData(city, condominium);
            
            // Render the agenda
            this.renderAgenda();
            
        } catch (error) {
            console.error('Error loading agenda:', error);
            window.showNotification('Não foi possível carregar a agenda. Por favor, tente novamente.', 'error');
        }
    }
    
    /**
     * Fetch agenda data (mocked for now)
     */
    async fetchAgendaData(city, condominium) {
        // In a real app, this would be an API call
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate mock data for the next 14 days
                const daysData = [];
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                for (let i = 0; i < 14; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    
                    const dayData = {
                        date: date.toISOString().split('T')[0],
                        day: window.utils.getDayOfWeek(date),
                        dateObj: new Date(date),
                        slots: {}
                    };
                    
                    // Add some random availability
                    const periods = ['manha', 'tarde'];
                    periods.forEach(period => {
                        dayData.slots[period] = CONFIG.timeSlots[period].slots.map(slot => ({
                            time: slot,
                            available: Math.random() > 0.4, // 60% chance of being available
                            booked: false
                        }));
                    });
                    
                    daysData.push(dayData);
                }
                
                resolve(daysData);
            }, 300);
        });
    }
    
    /**
     * Render the agenda view
     */
    renderAgenda() {
        const agendaContainer = document.getElementById('agenda');
        if (!agendaContainer) return;
        
        if (!this.agendaData || this.agendaData.length === 0) {
            agendaContainer.innerHTML = '<div class="text-center py-8">Nenhum horário disponível para exibir.</div>';
            return;
        }
        
        // Format the week range for display
        const startDate = new Date(this.agendaData[0].date);
        const endDate = new Date(this.agendaData[this.agendaData.length - 1].date);
        const weekRange = this.formatWeekRange(startDate, endDate);
        
        // Render the agenda header
        let html = `
            <div class="mb-6 flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">Disponibilidade</h2>
                <div class="flex items-center space-x-2">
                    <button id="prev-week" class="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <span class="text-sm font-medium text-gray-700">${weekRange}</span>
                    <button id="next-week" class="p-2 rounded-full hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        `;
        
        // Render each day column
        this.agendaData.forEach(dayData => {
            html += this.renderDayColumn(dayData);
        });
        
        html += '</div>'; // Close grid
        agendaContainer.innerHTML = html;
    }
    
    /**
     * Render a day column in the agenda
     * @param {Object} dayData - The day data to render
     */
    renderDayColumn(dayData) {
        const date = new Date(dayData.date);
        const dayName = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][date.getDay()];
        const dayNumber = date.getDate();
        const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        const monthName = monthNames[date.getMonth()];
        const isToday = new Date().toDateString() === date.toDateString();
        
        let html = `
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <div class="bg-blue-600 text-white text-center py-2">
                    <div class="text-sm font-medium">${dayName}</div>
                    <div class="text-2xl font-bold">${dayNumber}</div>
                    <div class="text-xs">${monthName}</div>
                </div>
                <div class="p-3 space-y-2">
        `;
        
        // Render time slots for each period (manhã/tarde)
        const periods = ['manha', 'tarde'];
        periods.forEach(period => {
            const periodData = dayData.slots[period];
            if (!periodData) return;

            html += `
                <div class="mb-3">
                    <h3 class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">${CONFIG.timeSlots[period].label}</h3>
                    <div class="space-y-1">
            `;

            periodData.forEach(slot => {
                const isAvailable = slot.available && !slot.booked;
                const isPast = new Date(`${dayData.date}T${slot.time}`) < new Date();

                html += this.renderTimeSlot(slot, isAvailable, isPast, dayData.date);
            });

            html += `
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render a time slot button
     */
    renderTimeSlot(slot, isAvailable, isPast, date) {
        const isSelected = this.selectedDate === date && this.selectedTime === slot.time;
        const isDisabled = !isAvailable || isPast;

        let buttonClass = 'time-slot w-full text-left py-2 px-3 rounded text-sm';

        if (isSelected) {
            buttonClass += ' bg-blue-100 text-blue-800 border border-blue-300';
        } else if (isDisabled) {
            buttonClass += ' bg-gray-100 text-gray-400 cursor-not-allowed';
        } else {
            buttonClass += ' bg-green-100 text-green-800 hover:bg-green-200';
        }

        return `
            <button 
                class="${buttonClass}"
                data-time="${slot.time}"
                data-date="${date}"
                ${isDisabled ? 'disabled' : ''}
            >
                ${slot.time}
            </button>
        `;
    }

    /**
     * Format a date range for display
     */
    formatWeekRange(startDate, endDate) {
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        const startDay = startDate.getDate();
        const startMonth = monthNames[startDate.getMonth()];
        const endDay = endDate.getDate();
        const endMonth = monthNames[endDate.getMonth()];
        const year = endDate.getFullYear();

        if (startMonth === endMonth) {
            return `${startDay} - ${endDay} de ${startMonth} ${year}`;
        } else {
            return `${startDay} de ${startMonth} - ${endDay} de ${endMonth} ${year}`;
        }
    }

    /**
     * Navigate to previous or next week
     */
    navigateWeek(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        
        if (this.currentCity && this.currentCondominium) {
            this.loadAgenda(this.currentCity, this.currentCondominium);
        }
    }
    
    /**
     * Populate the condominium select dropdown
     */
    populateCondominiumSelect() {
        const select = document.getElementById('condominium');
        if (!select) return;
        
        // Clear existing options
        select.innerHTML = '<option value="">Selecione um condomínio</option>';
        
        // Add options from CONFIG
        const condominios = CONFIG.condominios['Jundiaí'] || [];
        condominios.forEach(cond => {
            const option = document.createElement('option');
            option.value = cond.id;
            option.textContent = cond.nome;
            select.appendChild(option);
        });
        
        // Add change event listener
        select.addEventListener('change', (e) => {
            const condominiumId = e.target.value;
            if (condominiumId) {
                this.loadAgenda('Jundiaí', condominiumId);
            }
        });
    }
}

// Export the class
export { AgendaManager };

// Also add to window for backward compatibility
window.AgendaManager = AgendaManager;

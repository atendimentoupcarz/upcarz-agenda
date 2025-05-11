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
    }

    /**
     * Populate the condominium select dropdown
     */
    populateCondominiumSelect() {
        const select = document.getElementById('condominium');
        if (!select) return;

        // Clear existing options except the first one
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Add condominiums from config
        CONFIG.city.condominiums.forEach(condo => {
            const option = document.createElement('option');
            option.value = condo.id;
            option.textContent = condo.name;
            select.appendChild(option);
        });
    }

    /**
     * Load agenda data for a specific city and condominium
     * @param {string} city - The city name
     * @param {string} condominium - The condominium ID
     */
    async loadAgenda(city, condominium) {
        try {
            console.log(`Loading agenda for ${city} - ${condominium}`);
            
            this.currentCity = city;
            this.currentCondominium = condominium;
            
            // In a real app, this would be an API call
            // For now, we'll use local data
            const data = await this.fetchAgendaData(city, condominium);
            
            if (data) {
                this.agendaData = data;
                this.renderAgenda();
            } else {
                throw new Error('No data received');
            }
        } catch (error) {
            console.error('Error loading agenda:', error);
            window.showError('Não foi possível carregar a agenda. Por favor, tente novamente.');
            throw error;
        }
    }

    /**
     * Fetch agenda data (mocked for now)
     */
    async fetchAgendaData(city, condominium) {
        // In a real app, this would be an API call
        // For now, we'll simulate a delay and return mock data
        return new Promise((resolve) => {
            setTimeout(() => {
                // Generate mock data for the next 7 days
                const weekData = [];
                const today = new Date();
                
                for (let i = 0; i < 7; i++) {
                    const date = new Date(today);
                    date.setDate(today.getDate() + i);
                    
                    const dayData = {
                        date: date.toISOString().split('T')[0],
                        day: window.utils.getDayOfWeek(date),
                        slots: {}
                    };
                    
                    // Add some random availability
                    const periods = ['manha', 'tarde'];
                    periods.forEach(period => {
                        dayData.slots[period] = CONFIG.timeSlots[period].slots.map(slot => {
                            // Make some slots unavailable (for demo purposes)
                            const isAvailable = Math.random() > 0.3;
                            return {
                                time: slot,
                                available: isAvailable,
                                booked: false
                            };
                        });
                    });
                    
                    weekData.push(dayData);
                }
                
                resolve(weekData);
            }, 500);
        });
    }

    /**
     * Render the agenda view
     */
    renderAgenda() {
        const agendaContainer = document.getElementById('agenda');
        if (!agendaContainer) return;
        
        if (!this.agendaData || this.agendaData.length === 0) {
            agendaContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Nenhum horário disponível para o período selecionado.</p>';
            return;
        }
        
        // Get the current week range
        const weekRange = window.utils.getWeekRange();
        
        // Generate the agenda HTML
        let html = `
            <div class="bg-white rounded-lg overflow-hidden">
                <!-- Week Navigation -->
                <div class="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <button id="prev-week" class="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    
                    <div id="week-range" class="text-sm font-medium text-gray-700">
                        ${this.formatWeekRange(weekRange.startDate, weekRange.endDate)}
                    </div>
                    
                    <button id="next-week" class="text-gray-600 hover:text-gray-800 focus:outline-none">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                        </svg>
                    </button>
                </div>
                
                <!-- Days Grid -->
                <div class="overflow-x-auto">
                    <div class="min-w-max">
                        <div class="grid grid-cols-7 divide-x divide-gray-200">
                            ${this.agendaData.map(day => this.renderDayColumn(day)).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Booking Form (Hidden by default) -->
            <div id="booking-form" class="hidden mt-6 bg-white p-6 rounded-lg border border-gray-200">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Confirmar Agendamento</h3>
                <p id="selected-time" class="text-gray-600 mb-4"></p>
                <form id="confirm-booking" class="space-y-4">
                    <div>
                        <label for="client-name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input type="text" id="client-name" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                    </div>
                    <div>
                        <label for="client-phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                        <input type="tel" id="client-phone" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                    </div>
                    <div>
                        <label for="client-email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
                        <input type="email" id="client-email" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required>
                    </div>
                    <div class="flex justify-end space-x-3 pt-2">
                        <button type="button" id="cancel-booking" class="btn btn-secondary">Cancelar</button>
                        <button type="submit" class="btn btn-primary">Confirmar Agendamento</button>
                    </div>
                </form>
            </div>
        `;
        
        agendaContainer.innerHTML = html;
        
        // Add event listeners for the booking form
        this.setupBookingForm();
    }
    
    /**
     * Render a day column in the agenda
     */
    renderDayColumn(dayData) {
        const date = new Date(dayData.date);
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        
        // Format date for display
        const dayNumber = date.getDate();
        const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthName = monthNames[date.getMonth()];
        const dayName = dayData.day.charAt(0).toUpperCase() + dayData.day.slice(1);
        
        // Generate time slots HTML
        let timeSlotsHtml = '';
        
        // Morning slots
        if (dayData.slots.manha && dayData.slots.manha.length > 0) {
            timeSlotsHtml += `
                <div class="mb-4">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Manhã</h4>
                    <div class="space-y-1">
                        ${dayData.slots.manha.map(slot => this.renderTimeSlot(slot, isPast)).join('')}
                    </div>
                </div>
            `;
        }
        
        // Afternoon slots
        if (dayData.slots.tarde && dayData.slots.tarde.length > 0) {
            timeSlotsHtml += `
                <div class="mb-4">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Tarde</h4>
                    <div class="space-y-1">
                        ${dayData.slots.tarde.map(slot => this.renderTimeSlot(slot, isPast)).join('')}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="p-2 ${isPast ? 'opacity-50' : ''}">
                <div class="text-center mb-3">
                    <div class="text-sm font-medium text-gray-900">${dayName}</div>
                    <div class="text-xs text-gray-500">${dayNumber} ${monthName}</div>
                    ${isToday ? '<div class="mt-1 h-1 w-1/2 mx-auto bg-blue-500 rounded-full"></div>' : ''}
                </div>
                <div class="h-64 overflow-y-auto">
                    ${timeSlotsHtml || '<p class="text-xs text-gray-500 text-center py-4">Nenhum horário disponível</p>'}
                </div>
            </div>
        `;
    }
    
    /**
     * Render a time slot button
     */
    renderTimeSlot(slot, isPast) {
        const isAvailable = slot.available && !isPast && !slot.booked;
        const isBooked = slot.booked;
        const isUnavailable = !slot.available || isPast;
        
        let buttonClass = 'time-slot w-full text-left';
        let buttonContent = slot.time;
        
        if (isBooked) {
            buttonClass += ' bg-red-50 text-red-400 cursor-not-allowed';
            buttonContent += ' (Indisponível)';
        } else if (isUnavailable) {
            buttonClass += ' bg-gray-100 text-gray-400 cursor-not-allowed';
            buttonContent += ' (Indisponível)';
        } else {
            buttonClass += ' bg-green-100 text-green-800 hover:bg-green-200';
            buttonContent += ' (Disponível)';
        }
        
        return `
            <button 
                class="${buttonClass}"
                ${!isAvailable ? 'disabled' : ''}
                data-time="${slot.time}"
                data-available="${isAvailable}"
            >
                ${buttonContent}
            </button>
        `;
    }
    
    /**
     * Format a date range for display
     */
    formatWeekRange(startDate, endDate) {
        const startDay = startDate.getDate();
        const startMonth = startDate.toLocaleString('pt-BR', { month: 'short' });
        const endDay = endDate.getDate();
        const endMonth = endDate.toLocaleString('pt-BR', { month: 'short' });
        const year = endDate.getFullYear();
        
        if (startMonth === endMonth) {
            return `${startDay} - ${endDay} ${startMonth} ${year}`;
        } else {
            return `${startDay} ${startMonth} - ${endDay} ${endMonth} ${year}`;
        }
    }
    
    /**
     * Navigate to previous or next week
     */
    navigateWeek(direction) {
        this.currentDate.setDate(this.currentDate.getDate() + (direction * 7));
        
        // Reload agenda data for the new week
        if (this.currentCity && this.currentCondominium) {
            this.loadAgenda(this.currentCity, this.currentCondominium);
        }
    }
    
    /**
     * Handle time slot click
     */
    handleTimeSlotClick(event) {
        const button = event.target.closest('.time-slot');
        if (!button || button.disabled) return;
        
        const time = button.dataset.time;
        const dateStr = button.closest('[data-date]')?.dataset.date;
        
        if (!time || !dateStr) return;
        
        this.selectedDate = dateStr;
        this.selectedTime = time;
        
        // Show the booking form
        const bookingForm = document.getElementById('booking-form');
        const selectedTimeDisplay = document.getElementById('selected-time');
        
        if (bookingForm && selectedTimeDisplay) {
            const date = new Date(dateStr);
            const dayName = date.toLocaleDateString('pt-BR', { weekday: 'long' });
            const formattedDate = date.toLocaleDateString('pt-BR');
            
            selectedTimeDisplay.textContent = `${dayName}, ${formattedDate} às ${time}`;
            bookingForm.classList.remove('hidden');
            
            // Scroll to the form
            bookingForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    /**
     * Set up the booking form
     */
    setupBookingForm() {
        const bookingForm = document.getElementById('booking-form');
        const cancelButton = document.getElementById('cancel-booking');
        const confirmForm = document.getElementById('confirm-booking');
        
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                if (bookingForm) {
                    bookingForm.classList.add('hidden');
                }
            });
        }
        
        if (confirmForm) {
            confirmForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitBooking();
            });
        }
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
            if (confirmForm) {
                confirmForm.reset();
            }
            
            // Hide booking form
            const bookingForm = document.getElementById('booking-form');
            if (bookingForm) {
                bookingForm.classList.add('hidden');
            }
            
            // Reload agenda to show updated availability
            if (this.currentCity && this.currentCondominium) {
                this.loadAgenda(this.currentCity, this.currentCondominium);
            }
            
        } catch (error) {
            console.error('Error submitting booking:', error);
            window.showNotification('Não foi possível realizar o agendamento. Por favor, tente novamente.', 'error');
        }
    }
}

// Export to window
window.AgendaManager = AgendaManager;

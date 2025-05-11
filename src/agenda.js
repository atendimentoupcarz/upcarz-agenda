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
            agendaContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Nenhum horário disponível para o período selecionado.</p>';
            return;
        }
        
        // Generate the agenda HTML
        let html = `
            <div class="bg-white rounded-xl shadow-card overflow-hidden">
                <!-- Header -->
                <div class="bg-primary-600 px-6 py-4">
                    <h2 class="text-xl font-bold text-white">Agenda de Horários</h2>
                    <p class="text-primary-100 text-sm mt-1">Selecione um horário disponível</p>
                </div>
                
                <!-- Days Grid -->
                <div class="overflow-x-auto">
                    <div class="min-w-max">
                        <div class="grid grid-cols-7 divide-x divide-gray-100">
                            ${this.agendaData.map(day => this.renderDayColumn(day)).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
            
        agendaContainer.innerHTML = html;
    }

    /**
     * Render a day column in the agenda
     */
    renderDayColumn(dayData) {
        const date = dayData.dateObj || new Date(dayData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        // Format date for display
        const dayNumber = date.getDate();
        const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthName = monthNames[date.getMonth()];
        const dayName = dayData.day.charAt(0).toUpperCase() + dayData.day.slice(1);
        
        // Count available slots
        let availableSlots = 0;
        Object.values(dayData.slots).forEach(period => {
            availableSlots += period.filter(slot => slot.available).length;
        });
        
        // Generate time slots HTML
        let timeSlotsHtml = '';
        
        // Morning slots
        if (dayData.slots.manha && dayData.slots.manha.length > 0) {
            timeSlotsHtml += `
                <div class="mb-3">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-1">Manhã</h4>
                    <div class="grid grid-cols-2 gap-1.5">
                        ${dayData.slots.manha.map(slot => this.renderTimeSlot(slot, isPast)).join('')}
                    </div>
                </div>`;
        }
        
        // Afternoon slots
        if (dayData.slots.tarde && dayData.slots.tarde.length > 0) {
            timeSlotsHtml += `
                <div class="mb-3">
                    <h4 class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-1">Tarde</h4>
                    <div class="grid grid-cols-2 gap-1.5">
                        ${dayData.slots.tarde.map(slot => this.renderTimeSlot(slot, isPast)).join('')}
                    </div>
                </div>`;
        }
        
        // Generate availability badge
        let availabilityBadge = '';
        if (availableSlots > 0) {
            availabilityBadge = `
                <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-green-800 bg-green-100 rounded-full">
                    ${availableSlots} vaga${availableSlots > 1 ? 's' : ''}
                </span>`;
        } else {
            availabilityBadge = `
                <span class="inline-block mt-1 px-2 py-0.5 text-xs font-medium text-red-800 bg-red-100 rounded-full">
                    Esgotado
                </span>`;
        }
        
        const todayIndicator = isToday ? 
            '<div class="mt-1 h-0.5 w-1/2 mx-auto bg-primary-500 rounded-full"></div>' : 
            '';
        
        const noSlotsMessage = !timeSlotsHtml ? 
            '<p class="text-xs text-gray-500 text-center py-4">Nenhum horário disponível</p>' : 
            timeSlotsHtml;
        
        return `
            <div class="p-3 border-r border-gray-100 last:border-r-0 ${isPast ? 'opacity-50' : ''} ${isWeekend ? 'bg-gray-50' : 'bg-white'}" 
                 data-date="${dayData.date}">
                <div class="text-center mb-3">
                    <div class="text-sm font-medium text-gray-900">${dayName}</div>
                    <div class="text-xs text-gray-500">${dayNumber} ${monthName}</div>
                    ${availabilityBadge}
                    ${todayIndicator}
                </div>
                <div class="h-80 overflow-y-auto pr-1">
                    ${noSlotsMessage}
                </div>
            </div>`;
    }

    /**
     * Render a time slot button
     */
    renderTimeSlot(slot, isPast) {
        const isAvailable = slot.available && !isPast && !slot.booked;
        const isBooked = slot.booked;
        const isUnavailable = !slot.available || isPast;
        
        let buttonClass = 'time-slot text-sm py-1.5 px-2 rounded-md text-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500';
        
        if (isBooked) {
            buttonClass += ' bg-red-50 text-red-500 border border-red-100 cursor-not-allowed';
        } else if (isUnavailable) {
            buttonClass += ' bg-gray-100 text-gray-400 cursor-not-allowed';
        } else {
            buttonClass += ' bg-green-50 text-green-700 hover:bg-green-100 border border-green-100 hover:border-green-200';
        }
        
        return `
            <button 
                class="${buttonClass}"
                ${!isAvailable ? 'disabled' : ''}
                data-time="${slot.time}"
                data-available="${isAvailable}"
                title="${isAvailable ? 'Clique para agendar' : 'Horário indisponível'}">
                ${slot.time}
            </button>`;
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
        if (!button) return;
        
        const time = button.dataset.time;
        const date = button.closest('[data-date]').dataset.date;
        const isAvailable = button.dataset.available === 'true';
        
        if (!isAvailable) return;
        
        this.selectedDate = date;
        this.selectedTime = time;
        
        // Show booking form or modal
        this.showBookingForm(date, time);
    }

    /**
     * Show booking form/modal
     */
    showBookingForm(date, time) {
        // In a real app, this would show a modal with a form
        // For now, we'll just log the selection
        console.log(`Selected time: ${date} at ${time}`);
        
        // Show a confirmation dialog
        if (confirm(`Deseja agendar para ${date} às ${time}?`)) {
            this.submitBooking();
        }
    }

    /**
     * Submit a booking
     */
    async submitBooking() {
        try {
            // In a real app, this would be an API call
            // For now, we'll just log the booking
            console.log('Submitting booking:', {
                date: this.selectedDate,
                time: this.selectedTime,
                condominium: this.currentCondominium
            });
            
            // Add to booked slots
            const slotKey = `${this.selectedDate}_${this.selectedTime}`;
            this.bookedSlots.add(slotKey);
            
            // Show success message
            window.showSuccess('Agendamento realizado com sucesso!');
            
            // Reload agenda to reflect the booking
            if (this.currentCity && this.currentCondominium) {
                await this.loadAgenda(this.currentCity, this.currentCondominium);
            }
            
            // Reset selection
            this.selectedDate = null;
            this.selectedTime = null;
            
        } catch (error) {
            console.error('Error submitting booking:', error);
            window.showError('Não foi possível realizar o agendamento. Por favor, tente novamente.');
        }
    }
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
                        dayData.slots[period] = CONFIG.timeSlots[period].slots.map(slot => {
                            // Make some slots unavailable (for demo purposes)
                            const isAvailable = Math.random() > 0.4; // Increased availability for demo
                            return {
                                time: slot,
                                available: isAvailable,
                                booked: false
                            };
                        });
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
            agendaContainer.innerHTML = '<p class="text-center text-gray-500 py-8">Nenhum horário disponível para o período selecionado.</p>';
            return;
        }
        
        // Generate the agenda HTML
        let html = `
            <div class="bg-white rounded-xl shadow-card overflow-hidden">
                <!-- Header -->
                <div class="bg-primary-600 px-6 py-4">
                    <h2 class="text-xl font-bold text-white">Agenda de Horários</h2>
                    <p class="text-primary-100 text-sm mt-1">Selecione um horário disponível</p>
                </div>
                
                <!-- Days Grid -->
                <div class="overflow-x-auto">
                    <div class="min-w-max">
                        <div class="grid grid-cols-7 divide-x divide-gray-100">
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
        const date = dayData.dateObj || new Date(dayData.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today && !isToday;
        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
        
        // Format date for display
        const dayNumber = date.getDate();
        const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
        const monthName = monthNames[date.getMonth()];
        const dayName = dayData.day.charAt(0).toUpperCase() + dayData.day.slice(1);
        
        // Count available slots
        let availableSlots = 0;
        Object.values(dayData.slots).forEach(period => {
            availableSlots += period.filter(slot => slot.available).length;
        });
        
        // Generate time slots HTML
    
    // Format date for display
    const dayNumber = date.getDate();
    const monthNames = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
    const monthName = monthNames[date.getMonth()];
    const dayName = dayData.day.charAt(0).toUpperCase() + dayData.day.slice(1);
    
    // Count available slots
    let availableSlots = 0;
    Object.values(dayData.slots).forEach(period => {
        availableSlots += period.filter(slot => slot.available).length;
    });
    
    // Generate time slots HTML
    let timeSlotsHtml = '';
    
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

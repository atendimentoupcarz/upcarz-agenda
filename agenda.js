
import { SheetsService } from './sheets-service.js';

export class Agenda {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
    }

    async loadAgenda() {
        const sheetName = window.getSheetName();
        const data = await SheetsService.loadSheetData(sheetName);
        this.render(data);
    }

    render(data) {
        if (!data || data.length === 0) {
            this.container.innerHTML = '<p>No available data.</p>';
            return;
        }

        this.container.innerHTML = data.map(slot => {
            const availableClass = slot.Available.toLowerCase() === "true" ? 'text-green-600' : 'text-red-600';
            return `<div class="border p-2 rounded ${availableClass}">
                        <strong>${slot.Date}</strong> - ${slot.Time} 
                        (${slot.Available === "true" ? "Disponível" : "Indisponível"})
                    </div>`;
        }).join('');
    }
}

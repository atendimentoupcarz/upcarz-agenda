
import { Agenda } from './agenda.js';

window.addEventListener('DOMContentLoaded', async () => {
    const agenda = new Agenda('agenda');
    await agenda.loadAgenda();
});

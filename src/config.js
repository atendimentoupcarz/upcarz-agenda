/**
 * Configuration for the Upcarz Scheduler
 * This file contains all the static configuration including cities, condominiums, and API settings
 */

const CONFIG = {
    // Google Sheets API configuration (for future implementation)
    api: {
        // This would be replaced with actual Google Sheets API endpoint
        baseUrl: 'https://sheets.googleapis.com/v4/spreadsheets',
        // This would be replaced with actual sheet ID
        sheetId: 'YOUR_GOOGLE_SHEET_ID',
        // API key would be loaded from environment variables in production
        apiKey: 'YOUR_GOOGLE_API_KEY',
    },

    // Time slots configuration with 30-minute increments
    timeSlots: {
        morning: { 
            start: 8, 
            end: 12, 
            label: 'Manhã',
            slots: [
                '08:00', '08:30', '09:00', '09:30', 
                '10:00', '10:30', '11:00', '11:30'
            ]
        },
        afternoon: { 
            start: 12, 
            end: 18, 
            label: 'Tarde',
            slots: [
                '12:00', '12:30', '13:00', '13:30',
                '14:00', '14:30', '15:00', '15:30',
                '16:00', '16:30', '17:00', '17:30'
            ]
        }
        // Evening period removed as requested
    },

    // City configuration
    city: {
        name: 'Jundiaí',
        condominiums: [
            { name: 'Brisas da Mata', slug: 'BrisasdaMata', microRegion: 2 },
            { name: 'Brisas Jundiaí', slug: 'BrisasJundiai', microRegion: 1 },
            { name: 'Canto da Natureza', slug: 'CantodaNatureza', microRegion: 5 },
            { name: 'Garden Resort', slug: 'GardenResort', microRegion: 4 },
            { name: 'Jardim Atenas', slug: 'JardimAtenas', microRegion: 2 },
            { name: 'Reserva da Mata', slug: 'ReservadaMata', microRegion: 3 },
            { name: 'Reserva Marajoara', slug: 'ReservaMarajoara', microRegion: 2 },
            { name: 'Village das Flores', slug: 'VillagedasFlores', microRegion: 2 },
            { name: 'Villaggio da Serra', slug: 'VillaggiodaSerra', microRegion: 2 },
            { name: 'Jardim Santa Teresa', slug: 'JardimSantaTeresa', microRegion: 2 }
        ]
    },

    // For demo purposes, we'll use local JSON files
    // In production, this would be replaced with actual API calls
    dataSource: 'local', // 'local' or 'google-sheets'
    
    // Local JSON file paths (for demo)
    localDataPath: 'data/'
};

// Helper function to get the sheet name for a city-condominium combination
function getSheetName(city, condominium) {
    return `${city}_${condominium.replace(/\s+/g, '')}`;
}

// For local development, we'll use this to map sheet names to JSON files
// In a real implementation, this would be replaced with actual API calls
const LOCAL_DATA_MAPPING = {
    // Jundiaí
    'Jundiai_BrisasdaMata': 'Jundiai_BrisasdaMata.json',
    'Jundiai_BrisasJundiai': 'Jundiai_BrisasJundiai.json',
    'Jundiai_CantodaNatureza': 'Jundiai_CantodaNatureza.json',
    'Jundiai_GardenResort': 'Jundiai_GardenResort.json',
    'Jundiai_JardimAtenas': 'Jundiai_JardimAtenas.json',
    'Jundiai_ReservadaMata': 'Jundiai_ReservadaMata.json',
    'Jundiai_ReservaMarajoara': 'Jundiai_ReservaMarajoara.json',
    'Jundiai_VillagedasFlores': 'Jundiai_VillagedasFlores.json',
    'Jundiai_VillaggiodaSerra': 'Jundiai_VillaggiodaSerra.json',
    'Jundiai_JardimSantaTeresa': 'Jundiai_JardimSantaTeresa.json'
};

// Export the configuration
window.CONFIG = CONFIG;
window.getSheetName = getSheetName;
window.LOCAL_DATA_MAPPING = LOCAL_DATA_MAPPING;

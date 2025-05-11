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

    // Time slots configuration
    timeSlots: {
        morning: { start: 8, end: 12, label: 'Manhã' },
        afternoon: { start: 13, end: 17, label: 'Tarde' },
        evening: { start: 18, end: 20, label: 'Noite' }
    },

    // Available cities and their condominiums
    locations: {
        'Campinas': ['Jardim dos Lagos', 'Parque das Universidades', 'Alphaville Campinas'],
        'São Paulo': ['Alphaville', 'Morumbi', 'Vila Olímpia'],
        'Curitiba': ['Ecoville', 'Batel', 'Água Verde']
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
    'Campinas_JardimdosLagos': 'Campinas_JardimdosLagos.json',
    'Campinas_ParquedasUniversidades': 'Campinas_ParquedasUniversidades.json',
    'Campinas_AlphavilleCampinas': 'Campinas_AlphavilleCampinas.json',
    'SãoPaulo_Alphaville': 'SaoPaulo_Alphaville.json',
    'SãoPaulo_Morumbi': 'SaoPaulo_Morumbi.json',
    'SãoPaulo_VilaOlimpia': 'SaoPaulo_VilaOlimpia.json',
    'Curitiba_Ecoville': 'Curitiba_Ecoville.json',
    'Curitiba_Batel': 'Curitiba_Batel.json',
    'Curitiba_AguaVerde': 'Curitiba_AguaVerde.json'
};

// Export the configuration
window.CONFIG = CONFIG;
window.getSheetName = getSheetName;
window.LOCAL_DATA_MAPPING = LOCAL_DATA_MAPPING;

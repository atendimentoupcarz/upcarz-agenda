// Application configuration
export const CONFIG = {
    // Base API URL (for future use)
    apiUrl: 'https://api.upcarz.com',
    
    // Local data path
    localDataPath: '/data/',
    
    // Time slots configuration
    timeSlots: {
        manha: {
            label: 'Manhã',
            slots: [
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                '11:00', '11:30', '12:00'
            ]
        },
        tarde: {
            label: 'Tarde',
            slots: [
                '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
                '16:00', '16:30', '17:00', '17:30'
            ]
        }
    },
    
    // City and condominiums data
    city: {
        name: 'Jundiaí',
        condominiums: [
            { id: 'cantodanatureza', name: 'Canto da Natureza' },
            { id: 'villadaterra', name: 'Vila da Terra' },
            { id: 'villabosque', name: 'Vila do Bosque' },
            { id: 'villadoslagos', name: 'Vila dos Lagos' },
            { id: 'villamontesiena', name: 'Vila Monte Siena' },
            { id: 'villanatureza', name: 'Vila Natureza' },
            { id: 'villapark', name: 'Vila Park' },
            { id: 'villareal', name: 'Vila Real' },
            { id: 'villareale', name: 'Villa Reale' },
            { id: 'villaregina', name: 'Vila Régia' },
            { id: 'villaregina2', name: 'Vila Regina II' },
            { id: 'villaregina3', name: 'Vila Regina III' },
            { id: 'villaregina4', name: 'Vila Regina IV' },
            { id: 'villaregina5', name: 'Vila Regina V' },
            { id: 'villareginanovo', name: 'Vila Regina Novo' },
            { id: 'villareginav', name: 'Vila Regina V' },
            { id: 'villareginavi', name: 'Vila Regina VI' },
            { id: 'villareginavii', name: 'Vila Regina VII' },
            { id: 'villareginaviii', name: 'Vila Regina VIII' },
            { id: 'villareginaix', name: 'Vila Regina IX' },
            { id: 'villareginax', name: 'Vila Regina X' },
            { id: 'villareginaxi', name: 'Vila Regina XI' },
            { id: 'villareginaxii', name: 'Vila Regina XII' },
            { id: 'villareginaxiii', name: 'Vila Regina XIII' },
            { id: 'villareginaxiv', name: 'Vila Regina XIV' },
            { id: 'villareginaxv', name: 'Vila Regina XV' },
            { id: 'villareginaxvi', name: 'Vila Regina XVI' },
            { id: 'villareginaxvii', name: 'Vila Regina XVII' },
            { id: 'villareginaxviii', name: 'Vila Regina XVIII' },
            { id: 'villareginaxix', name: 'Vila Regina XIX' },
            { id: 'villareginaxx', name: 'Vila Regina XX' },
            { id: 'villareginaxxi', name: 'Vila Regina XXI' },
            { id: 'villareginaxxii', name: 'Vila Regina XXII' },
            { id: 'villareginaxxiii', name: 'Vila Regina XXIII' },
            { id: 'villareginaxxiv', name: 'Vila Regina XXIV' },
            { id: 'villareginaxxv', name: 'Vila Regina XXV' },
            { id: 'villareginaxxvi', name: 'Vila Regina XXVI' },
            { id: 'villareginaxxvii', name: 'Vila Regina XXVII' },
            { id: 'villareginaxxviii', name: 'Vila Regina XXVIII' },
            { id: 'villareginaxxix', name: 'Vila Regina XXIX' },
            { id: 'villareginaxxx', name: 'Vila Regina XXX' },
            { id: 'villareginaxxxi', name: 'Vila Regina XXXI' },
            { id: 'villareginaxxxii', name: 'Vila Regina XXXII' },
            { id: 'villareginaxxxiii', name: 'Vila Regina XXXIII' },
            { id: 'villareginaxxxiv', name: 'Vila Regina XXXIV' },
            { id: 'villareginaxxxv', name: 'Vila Regina XXXV' },
            { id: 'villareginaxxxvi', name: 'Vila Regina XXXVI' },
            { id: 'villareginaxxxvii', name: 'Vila Regina XXXVII' },
            { id: 'villareginaxxxviii', name: 'Vila Regina XXXVIII' },
            { id: 'villareginaxxxix', name: 'Vila Regina XXXIX' },
            { id: 'villareginaxl', name: 'Vila Regina XL' },
            { id: 'villareginaxli', name: 'Vila Regina XLI' },
            { id: 'villareginaxlii', name: 'Vila Regina XLII' },
            { id: 'villareginaxliii', name: 'Vila Regina XLIII' },
            { id: 'villareginaxliv', name: 'Vila Regina XLIV' },
            { id: 'villareginaxlv', name: 'Vila Regina XLV' },
            { id: 'villareginaxlvi', name: 'Vila Regina XLVI' },
            { id: 'villareginaxlvii', name: 'Vila Regina XLVII' },
            { id: 'villareginaxlviii', name: 'Vila Regina XLVIII' },
            { id: 'villareginaxlix', name: 'Vila Regina XLIX' },
            { id: 'villareginal', name: 'Vila Regina L' }
        ]
    }
};

// Local data mapping for development
export const LOCAL_DATA_MAPPING = {
    'Jundiai_CantodaNatureza': 'Jundiai_CantodaNatureza.json',
    'Jundiai_ViladaTerra': 'Jundiai_ViladaTerra.json',
    'Jundiai_ViladoBosque': 'Jundiai_ViladoBosque.json',
    'Jundiai_ViladosLagos': 'Jundiai_ViladosLagos.json',
    'Jundiai_VilaMonteSiena': 'Jundiai_VilaMonteSiena.json',
    'Jundiai_VilaNatureza': 'Jundiai_VilaNatureza.json',
    'Jundiai_VilaPark': 'Jundiai_VilaPark.json',
    'Jundiai_VilaReal': 'Jundiai_VilaReal.json',
    'Jundiai_VillaReale': 'Jundiai_VillaReale.json'
};

// Helper function to get sheet name for API calls
export function getSheetName(city, condominium) {
    return `${city.replace(/\s+/g, '')}_${condominium}`;
}

// Add to window for backward compatibility
window.CONFIG = CONFIG;
window.LOCAL_DATA_MAPPING = LOCAL_DATA_MAPPING;
window.getSheetName = getSheetName;

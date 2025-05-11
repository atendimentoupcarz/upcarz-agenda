
export class SheetsService {
    static async loadSheetData(sheetName) {
        try {
            const gid = window.CONFIG.googleSheets.sheetIds[sheetName];
            const url = `${window.CONFIG.googleSheets.baseUrl}${gid}`;
            const response = await fetch(url);
            const csvData = await response.text();
            return this.parseCSV(csvData);
        } catch (error) {
            console.error('Error loading sheet data:', error);
            return null;
        }
    }

    static parseCSV(csv) {
        const lines = csv.split('\n').filter(l => l.trim() !== '');
        const headers = lines[0].split(',');
        return lines.slice(1).map(row => {
            const values = row.split(',');
            return Object.fromEntries(headers.map((h, i) => [h.trim(), values[i]?.trim()]));
        });
    }
}

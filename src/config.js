
const CONFIG = {
    dataSource: 'google-sheets',
    googleSheets: {
        baseUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ0_8zbf12m3XMGTLwHjy6yreq-YFGy-geEHGCBXAWYfRlXchi-YEADB5y7cMKuA6TrWlbBtniDWFum/pub?output=csv&gid=',
        sheetIds: {
            'Agenda': '0'
        }
    }
};

window.CONFIG = CONFIG;

window.getSheetName = function(city, condo) {
    return "Agenda"; // fixed for now
};

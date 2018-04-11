const ssclient = require('smartsheet');
const { 
    smartsheetApiToken,
    prodFolderId,
    testFolderId,
    testSourceData,
    appSheets
} = require('../ss-config.json');

// Create a SmartSheet client.
const ss = ssclient.createClient({
    accessToken: smartsheetApiToken,
    logLevel: 'info'
});

// Use the prod folder for production.
const folderIdForSheets = 
    (process.env.NODE_ENV === "production") ? prodFolderId : testFolderId;


const populateInviteGuests = async () => {
    const guestList = await ss.sheets.getSheet({ id: testSourceData.id });

    const rows = guestList.rows.slice(1, guestList.rows.length - 1).map(row => ({
        toBottom: true,
        cells: [
            {
                columnId: appSheets.inviteGuests.columnIds.inviteNumber,
                value: row.cells.find(cell => cell.columnId === testSourceData.columnIds.inviteNumber).value
            },
            {
                columnId: appSheets.inviteGuests.columnIds.guestName,
                value: row.cells.find(cell => cell.columnId === testSourceData.columnIds.guestName).value
            }
        ]
    }));
    

    try {
        const newRows = await ss.sheets.addRows({
            sheetId: appSheets.inviteGuests.id,
            body: rows
        });
    }
    catch (err) {
        console.error(err);
    }
}

populateInviteGuests();

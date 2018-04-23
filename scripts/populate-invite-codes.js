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

const generateRandomCode = () => {
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const length = 16;
    let code = "";
    for (let i = 0; i < length; ++i) {
        const charIdx = Math.floor(Math.random() * chars.length);
        if (i % 4 === 0 && i !== 0) {
            code += "-";
        }
        code += chars.charAt(charIdx);
    }

    return code;
};

const populateInviteCodes = async () => {
    const guestList = await ss.sheets.getSheet({ id: appSheets.inviteGuests.id });

    const inviteNumbers = new Set();
    guestList.rows.forEach(row => {
        inviteNumbers.add(
            row.cells.find(cell => cell.columnId === appSheets.inviteGuests.columnIds.inviteNumber)
                .value
        );
    });
    
    const rsvpInvites = await ss.sheets.getSheet({ id: appSheets.rsvpInvitesId });
    const rows = [...inviteNumbers].map(inviteNumber => ({
        toBottom: true,
        cells: [
            {
                columnId: appSheets.rsvpInvites.columnIds.inviteNumber,
                value: inviteNumber
            },
            {
                columnId: appSheets.rsvpInvites.columnIds.inviteCode,
                value: generateRandomCode()
            }
        ]
    }));

    try {
        const newRows = await ss.sheets.addRows({
            sheetId: appSheets.rsvpInvites.id,
            body: rows
        });
    }
    catch (err) {
        console.error(err);
    }
};

populateInviteCodes();

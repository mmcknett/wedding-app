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

    console.log(guestList);
    const inviteNumbers = new Set();
    const rows = guestList.rows.forEach(row => {
        inviteNumbers.add(
            row.cells.find(cell => cell.columnId === appSheets.inviteGuests.columnIds.inviteNumber)
                .value
        );
    });

    console.log(inviteNumbers);
};

populateInviteCodes();

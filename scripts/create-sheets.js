const ssclient = require('smartsheet');

const { 
    smartsheetApiToken,
    prodFolderId,
    testFolderId
} = require('../ss-config.json');
const guestSpec = require('../sheetSpecs/invite-guests.json');
const inviteSpec = require('../sheetSpecs/rsvp-invites.json');
const actionSpec = require('../sheetSpecs/rsvp-actions.json');

// Create a SmartSheet client.
const ss = ssclient.createClient({
    accessToken: smartsheetApiToken,
    logLevel: 'info'
});

// Use the prod folder for production.
const folderIdForSheets = 
    (process.env.NODE_ENV === "production") ? prodFolderId : testFolderId;

const createRsvpSheetsInFolder = async () => {
    createSheet(inviteSpec);
    createSheet(actionSpec);
    createSheet(guestSpec);
};

const createSheet = async (sheetSpec) => {
    const options = {
        folderId: folderIdForSheets,
        body: sheetSpec
    };

    try {
        const sheetResponse = await ss.sheets.createSheetInFolder(options);
        console.log(`${sheetSpec.name} sheet id:`, sheetResponse.result.id);
    } catch(error) {
        console.error(`Failed to create ${actionSpec.name}:`, error);
    }
}

createRsvpSheetsInFolder();

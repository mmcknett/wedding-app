const ssclient = require('smartsheet');
const { 
    smartsheetApiToken,
    prodFolderId,
    testFolderId
} = require('../ss-config.json');

const ss = ssclient.createClient({
    accessToken: smartsheetApiToken,
    logLevel: 'info'
});

const listSheets = async () => {
    const list = await ss.sheets.listSheets();
    list.data.forEach(async (sheet, index) => {
        console.log("More details:", sheet);
        
        const sheetInfo = await ss.sheets.getSheet({id: sheet.id});
        console.log(`Sheet ${index} is called ${sheet.name}`);
    });
}

// listSheets();



const listStuff = async () => {
    

    const options = {
        id: testFolderId
    };

    const list = await ss.folders.getFolder(options);
    console.log(list);
}

listStuff();

const createRsvpSheetsInFolder = async (folderId) => {
    const inviteSpec = {
        "name": "rsvp-invites",
        "columns": [
            {
                "title": "Invite #",
                "primary": true,
                "type": "TEXT_NUMBER"
            },
            {
                "title": "Guest Name",
                "type": "TEXT_NUMBER"
            }
        ]
    };

    const actionSpec = {
        "name": "rsvp-actions",
        "columns": [
            {
                "title": "Invite #",
                "primary": true,
                "type": "TEXT_NUMBER"
            },
            {
                "title": "Accepts",
                "type": "TEXT_NUMBER"
            }
        ]
    }
} 

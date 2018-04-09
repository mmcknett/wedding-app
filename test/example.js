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

listSheets();



const listStuff = async () => {
    

    const options = {
        id: testFolderId
    };

    const list = await ss.folders.getFolder(options);
    console.log(list);
}

// listStuff();

const createRsvpSheetsInFolder = async (folderId) => {
    const guestSpec = {
        "name": "invite-guests",
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

    const inviteSpec = {
        "name": "rsvp-invites",
        "columns": [
            {
                "title": "Invite #",
                "primary": true,
                "type": "TEXT_NUMBER"
            },
            {
                "title": "Invite Code",
                "type": "TEXT_NUMBER"
            }
        ]
    }

    const actionSpec = {
        "name": "rsvp-actions",
        "columns": [
            {
                "title": "Action #",
                "systemColumnType": "AUTO_NUMBER",
                "autoNumberFormat": {
                    "startingNumber": 0
                },
                "type": "TEXT_NUMBER"
            },
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
    };

    const options = {
        folderId: testFolderId,
        body: inviteSpec
    };

    try {
        const inviteSheet = await ss.sheets.createSheetInFolder(options);
        console.log("invite sheet info:", inviteSheet);
    } catch(error) {
        console.error("Failed to create", inviteSpec.name, "-", error);
    }

    options.body = actionSpec;

    try {
        const actionSheet = await ss.sheets.createSheetInFolder(options);
        console.log("action sheet info:", actionSheet);
    } catch(error) {
        console.error("Failed to create", actionSpec.name, "-", error);
    }

    options.body = guestSpec;

    try {
        const guestSheet = await ss.sheets.createSheetInFolder(options);
        console.log("action sheet info:", guestSheet);
    } catch(error) {
        console.error("Failed to create", guestSpec.name, "-", error);
    }
};

// createRsvpSheetsInFolder();

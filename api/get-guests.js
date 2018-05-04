const ssclient = require('smartsheet');
const { 
    smartsheetApiToken,
    appSheets
} = require('../ss-config.json');

const ss = ssclient.createClient({
    accessToken: smartsheetApiToken,
    logLevel: 'info'
});

let inviteCodes = {};

const loadInviteCodes = async () => {
    if (!Object.keys(inviteCodes).length) {
        console.log('Loading invite codes from Smartsheet...');

        const rsvpInvites = await ss.sheets.getSheet({ id: appSheets.rsvpInvites.id });
        rsvpInvites.rows.forEach(row => {
            inviteCodes[row.cells[1].displayValue] = row.cells[0].displayValue;
        });
    }
};

let guests = {};

const loadGuestList = async () => {
    if (!Object.keys(guests).length) {
        console.log('Loading guest list from Smartsheet...');

        const guestList = await ss.sheets.getSheet({ id: appSheets.inviteGuests.id });
        guestList.rows.forEach(row => {
            const inviteNumber = row.cells[0].displayValue;
            const guest = {
                name: row.cells[1].displayValue,
                status: row.cells[2].displayValue
            };

            guests[inviteNumber] = guests[inviteNumber] ?
                [...guests[inviteNumber], guest] :
                [guest];
        });
    }
};

const getGuestsFromInvite = async (inviteCode) => {
    await loadInviteCodes();
    await loadGuestList();
    const inviteNumber = inviteCodes[inviteCode] || -1;
    return {
        guests: guests[inviteNumber]
    };
}

const isCodeValid = async (inviteCode) => {
    await loadInviteCodes();
    return Object.keys(inviteCodes).includes(inviteCode);
}

module.exports.getGuests = async (event, context, callback) => {
    console.log('Getting guests...');

    const { Authorization: authorization } = event.headers;
    const prefix = 'Bearer ';

    let statusCode = 200;
    let message;

    if (!authorization || !authorization.startsWith(prefix)) {
        statusCode = 400;
        message = 'Invalid authorization scheme.';
    } else {
        const inviteCode = authorization.slice(prefix.length);
        if (await isCodeValid(inviteCode)) {
            message = await getGuestsFromInvite(inviteCode);
        } else {
            statusCode = 401;
            message = 'Invalid token.';
        }
    }

    const response = {
        statusCode,
        body: JSON.stringify({
            message
        }),
    };

    callback(null, response);
};

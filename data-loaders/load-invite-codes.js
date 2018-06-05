const ss = require('./create-ss-client');
const { appSheets } = require('../ss-config.json');
const transformCode = require('../rsvp-logic/transform-code');

let inviteCodes = {};

const loadInviteCodes = async () => {
    if (!Object.keys(inviteCodes).length) {
        console.log('Loading invite codes from Smartsheet...');

        const rsvpInvites = await ss.sheets.getSheet({ id: appSheets.rsvpInvites.id });
        rsvpInvites.rows.forEach(row => {
            const inviteCode = transformCode(row.cells[1].displayValue);
            inviteCodes[inviteCode] = row.cells[0].displayValue;
        });
    }

    return inviteCodes;
};

module.exports = loadInviteCodes;

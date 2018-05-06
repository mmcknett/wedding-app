const ss = require('./create-ss-client');
const { appSheets } = require('../ss-config.json');

let inviteCodes = {};

const loadInviteCodes = async () => {
    if (!Object.keys(inviteCodes).length) {
        console.log('Loading invite codes from Smartsheet...');

        const rsvpInvites = await ss.sheets.getSheet({ id: appSheets.rsvpInvites.id });
        rsvpInvites.rows.forEach(row => {
            inviteCodes[row.cells[1].displayValue] = row.cells[0].displayValue;
        });
    }

    return inviteCodes;
};

module.exports = loadInviteCodes;

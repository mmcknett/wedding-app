const ss = require('./create-ss-client');
const { appSheets } = require('../ss-config.json');

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

    return guests;
};

module.exports = loadGuestList;

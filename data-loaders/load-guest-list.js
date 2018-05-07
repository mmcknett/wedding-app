const ss = require('./create-ss-client');
const { appSheets } = require('../ss-config.json');

let guests = {};
let guestRows = {};

const loadGuestList = async () => {
    if (!Object.keys(guests).length || !Object.keys(guestRows).length) {
        console.log('Loading guest list from Smartsheet...');

        const guestList = await ss.sheets.getSheet({ id: appSheets.inviteGuests.id });
        guestList.rows.forEach(row => {
            const inviteNumber = row.cells[0].displayValue;

            // Cache the row itself for easy patching.
            if (guestRows[inviteNumber]) {
                guestRows[inviteNumber].push(row);
            } else {
                guestRows[inviteNumber] = [row];
            }

            // Transform to the rsvp-app data model.
            addGuestFromRow(inviteNumber, row); 
        });
    }

    return guests;
};

const addGuestFromRow = (inviteNumber, row) => {
    const guest = {
        name: row.cells[1].displayValue,
        status: row.cells[2].displayValue
    };

    if (guests[inviteNumber]) {
        guests[inviteNumber].push(guest);
    } else {
        guests[inviteNumber] = [guest];
    }
}

const addGuestsFromRows = (inviteNumber) => {
    guestRows[inviteNumber] && guestRows[inviteNumber].forEach(row => {
        addGuestFromRow(inviteNumber, row);
    });
}

const patchGuestList = async (inviteNumber, updatedGuests) => {
    if (updatedGuests.length == 0) {
        console.log('Ignoring update request with no guests specified.');
        return;
    }

    console.log('Upating guest list in  Smartsheet...');

    // Ensure the guest list is loaded.
    await loadGuestList();

    const rows = guestRows[inviteNumber];
    console.log('Invite #:', inviteNumber);

    const updateRows = [];

    for (const row of rows) {
        const updateIdx = updatedGuests.findIndex(update => update.name === row.cells[1].displayValue);
        if (updateIdx >= 0) {
            // Construct a row update for the status column of the current row.
            const newStatus = updatedGuests[updateIdx].status;
            const updateRow = {
                id: row.id,
                cells: [{
                    columnId: row.cells[2].columnId,
                    value: newStatus
                }]
            };
            updateRows.push(updateRow);

            // Update status locally in guestRows and guests.
            row.cells[2].value = row.cells[2].displayValue = newStatus;
            guests[inviteNumber] = [];
            addGuestsFromRows(inviteNumber, row);
        }
        else {
            console.error(`Invite #${inviteNumber} attempted to update nonexistent guest.`);
        }
    }

    try {
        await ss.sheets.updateRow({
            sheetId: appSheets.inviteGuests.id,
            body: updateRows
        });
        updateRows.forEach(row => console.log(row));
    } catch(err) {
        console.error('Patching the guest list failed:', err);
        guestRows = {}; // Force a re-update the next time the guest list is requested.
    }
}

module.exports = {
    loadGuestList,
    patchGuestList
};

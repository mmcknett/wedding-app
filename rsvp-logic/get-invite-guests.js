const loadInviteCodes = require('../data-loaders/load-invite-codes');
const loadGuestList = require('../data-loaders/load-guest-list');

const getGuestsFromInvite = async (inviteCode) => {
    const inviteCodes = await loadInviteCodes();
    const guests = await loadGuestList();
    const inviteNumber = inviteCodes[inviteCode] || -1;
    return {
        guests: guests[inviteNumber]
    };
}

module.exports = getGuestsFromInvite;

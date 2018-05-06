const loadInviteCodes = require('../data-loaders/load-invite-codes');

const isCodeValid = async (inviteCode) => {
    const inviteCodes = await loadInviteCodes();
    return Object.keys(inviteCodes).includes(inviteCode);
}

module.exports = isCodeValid;

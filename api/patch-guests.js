const isCodeValid = require('../rsvp-logic/is-code-valid');
const { patchGuestList } = require('../data-loaders/load-guest-list');
const loadInviteCodes = require('../data-loaders/load-invite-codes');
const getCorsHeaders = require('./get-cors-headers');
const getInviteCode = require('./get-invite-code');

const updateGuestResponses = async (inviteCode, updateBlock) => {
    const inviteCodes = await loadInviteCodes();
    const inviteNumber = inviteCodes[inviteCode] || -1;
    console.log('Update requested:', updateBlock);
    return patchGuestList(inviteNumber, updateBlock.guests);
};

module.exports.patchGuests = async (event, context, callback) => {
    console.log('Updating guests...');

    const inviteCode = getInviteCode(event.headers.Authorization);

    let statusCode = 200;
    let message;

    if (!inviteCode) {
        statusCode = 400;
        message = 'Invalid authorization scheme.';
    } else {
        if (await isCodeValid(inviteCode)) {
            statusCode = 200;
            message = await updateGuestResponses(inviteCode, JSON.parse(event.body));
        } else {
            statusCode = 401;
            message = 'Invalid invite code.';
        }
    }

    const headers = getCorsHeaders(event);
    const response = {
        statusCode,
        headers,
        body: JSON.stringify({
            message,
            requestBody: event.body
        }),
    };

    callback(null, response);
};
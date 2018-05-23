const isCodeValid = require('../rsvp-logic/is-code-valid');
const { patchGuestList } = require('../data-loaders/load-guest-list');
const loadInviteCodes = require('../data-loaders/load-invite-codes');
const getCorsHeaders = require('./get-cors-headers');

const updateGuestResponses = async (inviteCode, updateBlock) => {
    const inviteCodes = await loadInviteCodes();
    const inviteNumber = inviteCodes[inviteCode] || -1;
    console.log('Update requested:', updateBlock);
    return patchGuestList(inviteNumber, updateBlock.guests);
};

module.exports.patchGuests = async (event, context, callback) => {
    console.log('Updating guests...');

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
            statusCode = 200;
            message = await updateGuestResponses(inviteCode, JSON.parse(event.body));
        } else {
            statusCode = 401;
            message = 'Invalid token.';
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
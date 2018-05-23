const getGuestsFromInvite = require('../rsvp-logic/get-invite-guests');
const isCodeValid = require('../rsvp-logic/is-code-valid');
const getCorsHeaders = require('./get-cors-headers');

module.exports.getGuests = async (event, context, callback) => {
    console.log('Getting guests...');

    const { Authorization: authorization } = event.headers;
    const prefix = 'Bearer ';

    let statusCode = 200;
    let message;
    let guests;

    if (!authorization || !authorization.startsWith(prefix)) {
        statusCode = 400;
        message = 'Invalid authorization scheme.';
    } else {
        const inviteCode = authorization.slice(prefix.length);
        if (await isCodeValid(inviteCode)) {
            const response = await getGuestsFromInvite(inviteCode);
            guests = response.guests;
            console.log(`Guests loaded for invite ${inviteCode}: ${JSON.stringify(guests)}`);
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
            guests
        }),
    };

    callback(null, response);
};

const getGuestsFromInvite = require('../rsvp-logic/get-invite-guests');
const isCodeValid = require('../rsvp-logic/is-code-valid');

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
        } else {
            statusCode = 401;
            message = 'Invalid token.';
        }
    }

    // TODO: Use a more exclusive regex to match the domain; this will allow subdomains that include the domain.
    const origin = event.headers.origin;
    const accessControlAllowOrigin = origin && origin.includes('rsvp.amynmatt.life') ? origin : null;

    console.log(`Origin is "${origin}", origin allowed is "${accessControlAllowOrigin}"`);

    const response = {
        statusCode,
        headers: {
            'Access-Control-Allow-Origin': accessControlAllowOrigin,
            'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
            message,
            guests
        }),
    };

    callback(null, response);
};

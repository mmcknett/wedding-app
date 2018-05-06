const getGuestsFromInvite = require('../rsvp-logic/get-invite-guests');
const isCodeValid = require('../rsvp-logic/is-code-valid');

module.exports.getGuests = async (event, context, callback) => {
    console.log('Getting guests...');

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
            message = await getGuestsFromInvite(inviteCode);
        } else {
            statusCode = 401;
            message = 'Invalid token.';
        }
    }

    const response = {
        statusCode,
        body: JSON.stringify({
            message
        }),
    };

    callback(null, response);
};

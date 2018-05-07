const isCodeValid = require('../rsvp-logic/is-code-valid');

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
            message = 'Token valid, but did nothing.';
        } else {
            statusCode = 401;
            message = 'Invalid token.';
        }
    }

    const response = {
        statusCode,
        body: JSON.stringify({
            message,
            requestBody: event.body
        }),
    };

    callback(null, response);
};
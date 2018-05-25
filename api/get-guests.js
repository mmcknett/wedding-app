const getGuestsFromInvite = require('../rsvp-logic/get-invite-guests');
const isCodeValid = require('../rsvp-logic/is-code-valid');
const getCorsHeaders = require('./get-cors-headers');
const getInviteCode = require('./get-invite-code');

module.exports.getGuests = async (event, context, callback) => {
    console.log('Getting guests...');

    const inviteCode = getInviteCode(event.headers.Authorization);

    let statusCode = 200;
    let message;
    let guests;
    let contactUs;

    if (!inviteCode) {
        statusCode = 400;
        message = 'Invalid authorization scheme.';
    } else {
        if (await isCodeValid(inviteCode)) {
            const response = await getGuestsFromInvite(inviteCode);
            guests = response.guests;
            console.log(`Guests loaded for invite ${inviteCode}: ${JSON.stringify(guests)}`);

            contactUs = {
                phone: '(425) 449-0919',
                email: 'us@mattnamy.us'
            }
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
            guests,
            contactUs
        }),
    };

    callback(null, response);
};

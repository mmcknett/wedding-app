const getGuestsFromInvite = require('../rsvp-logic/get-invite-guests');
const isCodeValid = require('../rsvp-logic/is-code-valid');
const getCorsHeaders = require('./get-cors-headers');
const getInviteCode = require('./get-invite-code');
const { contactUsDetails, infoPageText } = require('./private-info');

module.exports.getGuests = async (event, context, callback) => {
    console.log('Getting guests...');

    const inviteCode = getInviteCode(event.headers.Authorization);

    let statusCode = 200;
    let message;
    let guests;
    let contactUs;
    let infoPage;

    if (!inviteCode) {
        statusCode = 400;
        message = 'Invalid authorization scheme.';
    } else {
        if (await isCodeValid(inviteCode)) {
            const response = await getGuestsFromInvite(inviteCode);
            guests = response.guests;
            console.log(`Guests loaded for invite ${inviteCode}: ${JSON.stringify(guests)}`);

            // With a valid code, allow private information to be returned.
            contactUs = contactUsDetails;
            infoPage = infoPageText;
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
            contactUs,
            infoPage
        }),
    };

    callback(null, response);
};

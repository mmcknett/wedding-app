const transformCode = require('../rsvp-logic/transform-code');

const getInviteCode = (authorization) => {
    const prefix = 'Bearer ';

    if (!authorization || !authorization.startsWith(prefix)) {
        return null;
    }

    const inviteCode = authorization.slice(prefix.length);
    return transformCode(inviteCode);
}

module.exports = getInviteCode;

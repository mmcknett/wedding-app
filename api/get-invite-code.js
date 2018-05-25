const getInviteCode = (authorization) => {
    const prefix = 'Bearer ';

    if (!authorization || !authorization.startsWith(prefix)) {
        return null;
    }

    const inviteCode = authorization.slice(prefix.length);
    return inviteCode.toUpperCase();
}

module.exports = getInviteCode;

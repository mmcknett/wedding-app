const getGuestsFromInvite = (inviteCode) => {
    return [
        {
            name: 'Matt',
            status: 'Attending'
        },
        {
            name: 'Amy',
            status: 'Not Yet Responded'
        },
        {
            name: 'Joe',
            status: 'Not Attending'
        }
    ]
}

const isCodeValid = (inviteCode) => {
    return true;
}

module.exports.getGuests = (event, context, callback) => {
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
        if (isCodeValid(inviteCode)) {
            message = getGuestsFromInvite(inviteCode);
        } else {
            statusCode = 401;
            message = 'Invalid token.';
        }
    }
  
    const response = {
      statusCode,
      body: JSON.stringify({
        message,
        input: event,
      }),
    };
  
    callback(null, response);
  };
